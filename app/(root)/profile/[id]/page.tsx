import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadCard from "@/components/cards/ThreadCard";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        imageurl={userInfo.image}
        bioofuser={userInfo.bio}
        username={userInfo.username}
        name={userInfo.name}
        accountid={userInfo.id}
        authUserId={user.id}
      />
      <div className="mt-3">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((item) => (
              <TabsTrigger className="tab" key={item.label} value={item.value}>
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt={item.label}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{item.label}</p>
                {item.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map(item=>(

          <TabsContent   className='w-full text-light-1'  key={`content-${item.label}`} value={item.value}>
           <ThreadCard userId={user.id} accountId={userInfo.id} accountType='User'/>
          </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default page;
