'use client';
import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import logo from "../assets/logo.png";
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

// Navigation items displayed in the header.

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
];

const Navbar = () => {
  // Read the current path from the Next.js router so active link styling can be applied.
  const pathName = usePathname();
  const { isLoaded, user } = useUser();

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
          <span className="logo-text">PdfSync</span>
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

          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="nav-link-base text-black hover:opacity-70">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="nav-link-base text-black hover:opacity-70">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              {isLoaded && user && user.firstName && (
                <span className="text-sm font-medium text-black">
                  Hello, {user.firstName}
                </span>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </Show>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
