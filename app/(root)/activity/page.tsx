import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const result = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">activity</h1>
      {result.length > 0 ? (
        <>
          {result.map((item) => (
            <Link key={item.id} href={`/thread/${item.parentId}`}>
              <article className="activity-card">
                <Image
                  src={item.author.image}
                  alt="user_logo"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {item.author.name}
                  </span>{" "}
                  replied to your thread
                </p>
              </article>
            </Link>
          ))}
        </>
      ) : (
        <p className="!text-base-regular text-light-3">No activity yet</p>
      )}
    </section>
  );
};

export default page;
