'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, UserButton, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { MoonStar, Sun, Sparkles, BookOpen, PlusCircle } from 'lucide-react';
import PdfSyncLogo from './PdfSyncLogo';

const navItems = [
  { label: "Library", href: "/", icon: BookOpen },
  { label: "Add New Book", href: "/books/new", icon: PlusCircle },
];

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const storedTheme = window.localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return storedTheme ? storedTheme === 'dark' : prefersDark;
};

const Navbar = () => {
  const pathName = usePathname();
  const { isLoaded, user } = useUser();
  const [isDark, setIsDark] = React.useState(getInitialDarkMode);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-3 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto rounded-2xl border border-white/40 dark:border-white/10 bg-card/75 dark:bg-card/70 shadow-lg shadow-black/5 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex justify-between items-center transition-all">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 dark:from-amber-500 dark:via-amber-600 dark:to-orange-700 text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform duration-300">
            <PdfSyncLogo className="w-5 h-5 text-white" />
            <div className="absolute -inset-0.5 rounded-xl bg-amber-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg font-bold font-serif tracking-tight text-foreground flex items-center gap-1.5">
              PdfSync
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-pulse" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground/80 -mt-1 tracking-wide">
              AI Voice & RAG Reader
            </span>
          </div>
        </Link>

        {/* Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 p-1 rounded-xl border border-border/40">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer select-none',
                  isActive
                    ? 'bg-amber-800 text-white dark:bg-amber-700 shadow-md shadow-amber-900/15'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme & Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              <Sun size={13} className="dark:hidden" />
              <MoonStar size={13} className="hidden dark:block" />
            </span>
            <span className="hidden sm:inline font-medium">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Signed Out Auth Controls */}
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 shadow-md shadow-amber-900/15 transition-all cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Signed In Profile */}
          <Show when="signed-in">
            <div className="flex items-center gap-2.5">
              {isLoaded && user && user.firstName && (
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  Welcome, <span className="text-foreground font-bold">{user.firstName}</span>
                </span>
              )}

              <div className="p-0.5 rounded-full border border-amber-800/30 dark:border-amber-400/30">
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
