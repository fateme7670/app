"use client"
import React from 'react';
import {sidebarLinks} from '@/constants'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
function BottomSide() {
  const path=usePathname()
  return (
      <section className='bottombar'>
    <div className='bottombar_container'>
{sidebarLinks.map((item) => {
  const isActive=(path.includes(item.route) && item.route.length>1) || path=== item.route ;
return(
  <Link className={`bottombar_link ${isActive && "bg-primary-500"}`} href={item.route} key={item.label}>
  <Image  className='object-contain' src={item.imgURL} width={20} height={20} alt={item.label} />
  <p className='text-subtle-medium text-light-1 max-sm:hidden'>{item.label.split(/\s+/)[0]}</p>
</Link>
)
})}
      </div>
    </section>
  );
}

export default BottomSide;
 