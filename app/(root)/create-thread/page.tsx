import PostThreads from '@/components/form/PostThreads';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

async function page() {
    const user= await currentUser()
    if (!user) {
        return null
    }
    const userInfo=await fetchUser(user.id)
  return (
    <div>
      <h1>create threads</h1>
      <PostThreads userId={userInfo._id}/>
    </div>
  );
}

export default page;
