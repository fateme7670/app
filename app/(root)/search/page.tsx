import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const result = await fetchUsers({
    pageNumber: 1,
    pageSize: 20,
    searchString: "",
    userId: user.id,
  });
  return (
    <section >
            <h1 className='head-text mb-10'>Search</h1>

      <div className="mt-14 flex flex-col gap-9">
       {result.users.length === 0 ?
      (<p className="no-result"> No Result</p>)
      :
      (
        <>
        {result.users.map(item=>{
          <UserCard 
          key={item.id}
          id={item.id}
          name={item.name}
          username={item.username}
          image={item.image}
          personTypes='User'
          />
        })}
        </>
      ) 
      }
      </div>
    </section>
  );
};

export default page;
