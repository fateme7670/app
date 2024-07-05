import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const result = await fetchUsers({
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
    searchString: searchParams.q,
    userId: user.id,
  });
  return (
    <section >
            <h1 className='head-text mb-10'>Search</h1>
            <Searchbar routeType='search' />

      <div className="mt-14 flex flex-col gap-9">
       {result.users.length === 0 ?
      (<p className="no-result"> No Result</p>)
      :
      (
        <>
        {result.users.map(item=>(
          <UserCard 
          key={item.id}
          id={item.id}
          name={item.name}
          username={item.username}
          image={item.image}
          personTypes='User'
          />
        ))}
        </>
      ) 
      }
      </div>
      <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
};

export default page;
