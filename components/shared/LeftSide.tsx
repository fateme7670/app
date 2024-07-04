"use client";
import React from "react";
import { sidebarLinks } from "@/constants/index";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignOutButton, useAuth } from "@clerk/nextjs";
function LeftSide() {
  const path = usePathname();
  const { userId } = useAuth();
  const router = useRouter();
  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="w-full flex  gap-4 flex-1 flex-col px-6">
        {sidebarLinks.map((item) => {
          const isActive =
            path === item.route ||
            (path.includes(item.route) && item.route.length > 1);
            if (item.route === "/profile") item.route = `${item.route}/${userId}`;

          return (
            <Link
              key={item.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}
              href={item.route}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={25}
                height={25}
              />
              <p className="text-light-2 max-lg:hidden">{item.label}</p>
            </Link>
          );
        })}
        <div className="mt-8 px-1">
        <SignedIn>
          <SignOutButton redirectUrl={"/sign-in"}>
            <div className='flex cursor-pointer gap-4 pl-4'>
              <Image
                src='/assets/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />

              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
        </div>
      </div>
    </section>
  );
}

export default LeftSide;
