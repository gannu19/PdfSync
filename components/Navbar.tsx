'use client';
import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import logo from "../assets/logo.png";
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { MoonStar, Sun } from 'lucide-react';
import PdfSyncLogo from './PdfSyncLogo';

/**
 * Navbar Component
 * Fixed header navigation with:
 * - App logo and branding on the left
 * - Navigation links (Library, Add New) in the center (hidden on mobile)
 * - Authentication controls on the right (Sign In/Up for guests, User profile for logged-in users)
 * - Active link highlighting based on current route
 * Uses Clerk for authentication management
 */

// Static navigation links shown on all pages.
const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
];

const Navbar = () => {
  // Get current pathname to highlight active navigation link
  // Used for active link styling based on current route
  const pathName = usePathname();
  // Clerk hook to access user authentication state and user data
  // isLoaded: Indicates if Clerk has finished initializing
  // user: Contains user data (firstName, email, etc.) or null if not authenticated
  const { isLoaded, user } = useUser();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className="w-full fixed top-0 z-50 border-b border-gray-100 bg-gradient-to-r from-white via-slate-50 to-white bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:bg-slate-950/80">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex gap-2.5 items-center group">
          {/* App logo and brand text */}
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md group-hover:shadow-lg transition-all duration-300">
            <PdfSyncLogo className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
              PdfSync
            </span>
            <span className="text-xs text-gray-500 font-medium -mt-1 dark:text-slate-400">AI Book Chat</span>
          </div>
        </Link>

        {/* Center Navigation - Hidden on mobile (md:flex shows it on medium+ screens) */}
        <nav className="hidden md:flex gap-1 items-center">
          {/* Map through navigation items and create links with active state styling */}
          {navItems.map(({ label, href }) => {
            // Check if current route matches the nav item to highlight active link
            const isActive =
              pathName === href || (href !== '/' && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  // Active link: gradient background with warm colors
                  // Inactive link: gray text with hover background
                  isActive
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 shadow-sm dark:from-amber-500/20 dark:to-orange-500/20 dark:text-amber-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section - Theme toggle and authentication controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 p-1.5 pr-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle dark mode"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-amber-100 text-amber-600'}`}>
              {isDark ? <MoonStar size={16} /> : <Sun size={16} />}
            </span>
            <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Show for unauthenticated users - Sign In and Sign Up buttons */}
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              {/* Sign In button - Opens Clerk's sign-in modal */}
              <SignInButton>
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800">
                  Sign In
                </button>
              </SignInButton>

              {/* Sign Up button - Opens Clerk's sign-up modal with gradient styling */}
              <SignUpButton>
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Show for authenticated users - User greeting and profile button */}
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              {/* Display user's first name greeting (hidden on small screens) */}
              {isLoaded && user && user.firstName && (
                <span className="text-sm font-medium text-gray-700 hidden sm:inline dark:text-slate-300">
                  Hello, <span className="text-amber-600 font-semibold dark:text-amber-400">{user.firstName}</span>
                </span>
              )}

              {/* Clerk's built-in UserButton - Shows user profile and sign-out options */}
              <div className="p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                <UserButton />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
