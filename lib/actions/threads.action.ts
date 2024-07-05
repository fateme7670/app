"use server";

import { model } from "mongoose";
import Thread from "../models/threads.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";

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
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      communityId:communityIdObject,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      })
    }
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
      })   .populate({
        path: "community",
        model: Community,
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
    const isNext = totalpost > startnumber + posts.length;

    return { posts ,isNext};
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
      .populate({
          path: "community",
          model: Community,
          select: "_id id name image",
        }) // Populate the community field with _id and name
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
async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
