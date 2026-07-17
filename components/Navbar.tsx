'use client';
import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import logo from "../assets/logo.png";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Navigation items displayed in the header.
const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
];

const Navbar = () => {
  // Read the current path from the Next.js router so active link styling can be applied.
  const pathName = usePathname();

  return (
    <header className="w-full fixed z-50 bg-('--bg-primary')">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          {/* App logo and brand text */}
          <Image
            src={logo}
            alt="Pdf-Sync"
            width={42}
            height={26}
            className="rounded-full"
          />
          <span className="logo-text">Pdf-Sync</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || (href !== '/' && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  'nav-link-base',
                  isActive ? 'nav-link-active' : 'text-black hover:opacity-70'
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
