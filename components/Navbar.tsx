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
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Track window scroll position to compact navbar and dock to top-right on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const isDetailPage = pathName.startsWith('/books/') && pathName !== '/books/new';
  if (isDetailPage) return null;

  const shouldCompact = isScrolled;

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 transition-all duration-500 ease-in-out py-3 px-4 sm:px-6",
        shouldCompact 
          ? "right-0 left-auto max-w-fit pointer-events-auto" 
          : "inset-x-0 w-full"
      )}
    >
      <div 
        className={cn(
          "rounded-2xl border border-border/80 dark:border-white/15 bg-card/90 dark:bg-card/85 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-500 ease-in-out flex items-center justify-between gap-3 sm:gap-6",
          shouldCompact
            ? "px-4 py-2 rounded-full shadow-2xl bg-card/95 border-amber-800/30 dark:border-amber-400/30 hover:scale-[1.02]"
            : "max-w-7xl mx-auto px-4 sm:px-6 py-2.5"
        )}
      >
        
        {/* Brand Logo */}
        <Link href="/" title="PdfSync Home Library" className="flex items-center gap-2.5 group shrink-0">
          <div className={cn(
            "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform duration-300",
            shouldCompact ? "h-9 w-9" : "h-10 sm:h-11 w-10 sm:w-11"
          )}>
            <PdfSyncLogo className={shouldCompact ? "w-5 h-5 text-white" : "w-5 sm:w-6 h-5 sm:h-6 text-white"} />
          </div>
          
          {!shouldCompact && (
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5 font-serif">
                PdfSync
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground -mt-0.5 tracking-wide hidden sm:block">
                AI Voice & RAG Reader
              </span>
            </div>
          )}
        </Link>

        {/* Center Navigation Links (Hidden when compact on scroll to give maximum page capacity) */}
        {!shouldCompact && (
          <nav className="hidden md:flex items-center gap-2 bg-muted/80 dark:bg-muted/50 p-1.5 rounded-xl border border-border/60">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));

              return (
                <Link
                  href={href}
                  key={label}
                  title={label}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-all duration-200 cursor-pointer select-none',
                    isActive
                      ? 'bg-amber-800 text-white dark:bg-amber-600 shadow-md shadow-amber-900/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                  )}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Section: Compact Navigation Icons when docked, Theme & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Nav Icons when docked/scrolled */}
          {shouldCompact && (
            <div className="flex items-center gap-1 bg-muted/60 dark:bg-muted/40 p-1 rounded-full border border-border/40 mr-1">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));
                return (
                  <Link
                    href={href}
                    key={label}
                    title={label}
                    aria-label={label}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer",
                      isActive
                        ? "bg-amber-800 text-white dark:bg-amber-600 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                    )}
                  >
                    <Icon size={15} />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 py-1.5 text-xs font-bold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              <Sun size={13} className="dark:hidden" />
              <MoonStar size={13} className="hidden dark:block" />
            </span>
            {!shouldCompact && <span className="hidden sm:inline font-bold">{isDark ? 'Dark' : 'Light'}</span>}
          </button>

          {/* Signed Out Auth Controls */}
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <button className="px-4 py-1.5 rounded-xl text-xs md:text-sm font-bold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-900/20 transition-all cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Signed In Profile */}
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              {isLoaded && user && user.firstName && !shouldCompact && (
                <span className="text-sm font-bold text-muted-foreground hidden sm:inline">
                  Welcome, <span className="text-foreground font-bold">{user.firstName}</span>
                </span>
              )}

              <div className="p-0.5 rounded-full border border-amber-800/30 dark:border-amber-400/30 shrink-0">
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
