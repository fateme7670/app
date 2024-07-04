import React from "react";
import PostCard from "./PostCard";
import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
interface Params {
  userId: string;
  accountId: string;
  accountType: string;
}
interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}
const ThreadCard = async ({ userId, accountId, accountType }: Params) => {
  const result = await fetchUserPosts(userId);
  
  if (!result) {
    redirect("/");
  }
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((item: any) => (
        <PostCard
          key={item._id}
          id={item._id}
          currentUserId={userId}
          parentId={item.parentId}
          content={item.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: item.author.name,
                  image: item.author.image,
                  id: item.author.id,
                }
          }
          community={
            accountType === "User"
              ? { name: result.name, id: result.id, image: result.image }
              : item.community
          }
          createdAt={item.createdAt}
          comments={item.children}
          isComment
        />
      ))}
    </section>
  );
};

export default ThreadCard;
