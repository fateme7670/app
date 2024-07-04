import PostCard from "@/components/cards/PostCard";
import { fetchPost } from "@/lib/actions/threads.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const user= await currentUser()
  if (!user) {
    return null
  }
  const result= await fetchPost(1,30)
  return (
  <>
      <h1 className='head-text text-left'>Home</h1>

<section className='mt-9 flex flex-col gap-10'>
    {result.posts.length ===0 ?
    (          <p className='no-result'>No threads found</p>
    ) :
    
    (
      <>
      {result.posts.map(post=>
      <PostCard 
       id={post._id}
      currentUserId={user.id}
      parentId={post.parentId}
      content={post.text}
      author={post.author}
      community={post.community}
      createdAt={post.createdAt}
      comments={post.children} />
        )}
      </>
    )}
</section>
  </>
  );
}
