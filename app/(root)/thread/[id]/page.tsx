import PostCard from "@/components/cards/PostCard";
import CommentForm from "@/components/form/CommentForm";
import { fetchPost, fetchPostById } from "@/lib/actions/threads.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchPostById(params.id);

  return (
    <section className="relative">
      <div>
        <PostCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <CommentForm
          userId={JSON.stringify(userInfo._id)}
          threadId={params.id}
          currentUserImg={user.imageUrl}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((item: any) => (
          <PostCard
            id={item._id}
            currentUserId={item.id}
            parentId={item.parentId}
            content={item.text}
            author={item.author}
            community={item.community}
            createdAt={item.createdAt}
            comments={item.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
