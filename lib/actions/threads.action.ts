"use server";

import { model } from "mongoose";
import Thread from "../models/threads.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThreads({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();
  try {
    const createdThread = await Thread.create({
      text,
      author,
      communityId: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`create thread Error=> ${error.message} `);
  }
}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
  connectToDB();

  try {
    const startnumber = (pageNumber - 1) * pageSize;

    const post = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(startnumber)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id name parentId image", // Select only _id and username fields of the author
        },
      });

    const totalpost = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await post.exec();
    return { posts };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchPostById(id: string) {
  connectToDB();
  try {
    const threads = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id name image",
      })
      // .populate({
      //     path: "community",
      //     model: Community,
      //     select: "_id id name image",
      //   }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();
    return threads;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function addComment(
  userId: string,
  text: string,
  threadId: string,
  path: string
) {
  connectToDB();
  try {
    const orginalThread = await Thread.findById(threadId);

    if (!orginalThread) {
      throw new Error("Thread not found");
    }

    const newThread = new Thread({
        text,
        author: userId,
      parentId: threadId,
    })

    const saveThread =await newThread.save();
    orginalThread.children.push(saveThread._id);
    await orginalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
