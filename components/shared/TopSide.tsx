import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dark } from "@clerk/themes";

function TopSide() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex gap-4 item-center">
        <Image src="/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-light-1 text-heading3-bold max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton redirectUrl={"/sign-in"}>
              <div className="flex cursor-pointer gap-4 p-4">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />

                <p className="text-light-2 max-lg:hidden">Logout</p>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTriger: "py-2 px-2",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default TopSide;
