import PostThreads from '@/components/form/PostThreads';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

async function page() {
    const user= await currentUser()
    if (!user) {
        return null
    }
    const userInfo=await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1>create threads</h1>
      <PostThreads userId={JSON.stringify(userInfo._id)}/>
    </div>
  );
}

export default page;
