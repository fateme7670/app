"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/threads.model";
import { FilterQuery, model, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function UpdateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchUser(userId: string) {
  connectToDB();
  try {
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export async function fetchUserPosts(id: string) {
  connectToDB();
  try {
    const threads = await User.findOne({ id }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "_id image name",
          },
        },
      ],
    });
    return threads;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchUsers({
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  sortBy = "desc",
  userId,
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  connectToDB();
  try {
    const skip = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const sortOption = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skip + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error("user not fount", error.message);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();
    // Find all threads created by the user

    const userThreads = await Thread.find({ id: userId });
    // Collect all the child thread ids (replies) from the 'children' field of each user thread

    const allChild = userThreads.reduce((prev, next) => {
      return prev.concat(next.children);
    }, []);
    const replies = await Thread.find({
      _id: { $in: allChild },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name _id image",
    });
    return replies;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
