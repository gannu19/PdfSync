'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Columns, MessageSquare, BookOpen, Sparkles, Sun, MoonStar, Maximize2, Minimize2 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import VapiControls from "@/components/VapiControls";
import PDFViewer from "@/components/PDFViewer";
import PdfSyncLogo from "@/components/PdfSyncLogo";
import { IBook } from "@/types";

interface BookDetailsClientProps {
  book: IBook;
}

type ViewMode = 'split' | 'chat' | 'pdf';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const storedTheme = window.localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return storedTheme ? storedTheme === 'dark' : prefersDark;
};

export default function BookDetailsClient({ book }: BookDetailsClientProps) {
  const [activePdfPage, setActivePdfPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isDark, setIsDark] = useState<boolean>(getInitialDarkMode);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen to Escape key to exit Focus Mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  const handlePageCitationClick = (pageNum: number) => {
    setActivePdfPage(pageNum);
    if (viewMode === 'chat') {
      setViewMode('split');
    }
  };

  return (
    <div className={isFocusMode 
      ? "fixed inset-0 z-[100] bg-background p-3 sm:p-5 overflow-auto flex flex-col h-screen w-screen" 
      : "w-full max-w-[99%] mx-auto px-2 sm:px-4 pt-3 pb-8 space-y-4"
    }>
      
      {/* Top Header Bar matching user design: Top-Left Logo & Back Link, Top-Right Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/50 pb-3 shrink-0">
        
        {/* Top-Left Side: Logo + Back to Library */}
        <div className="flex items-center gap-3">
          <Link href="/" title="PdfSync Home Library" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
              <PdfSyncLogo className="w-5 h-5 text-white" />
            </div>
          </Link>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            aria-label="Back to Library"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-card shadow-xs group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </div>
            <span className="font-semibold text-foreground">Back to Library</span>
          </Link>

          {isFocusMode && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Focus Mode Active (Esc to exit)
            </span>
          )}
        </div>

        {/* Top-Right Side: View Mode Pills + Focus Mode Toggle + Theme Toggle + User Profile */}
        <div className="flex flex-wrap items-center gap-2.5 self-center sm:self-auto">
          
          {/* View Mode Toggle Pills */}
          <div className="flex items-center gap-1 bg-muted/60 dark:bg-muted/40 p-1 rounded-2xl border border-border/60 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                viewMode === 'split'
                  ? 'bg-amber-800 text-white dark:bg-amber-700 shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
              }`}
            >
              <Columns size={14} />
              <span>Split View</span>
              <Sparkles size={12} className="text-amber-300 dark:text-amber-200 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                viewMode === 'chat'
                  ? 'bg-amber-800 text-white dark:bg-amber-700 shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
              }`}
            >
              <MessageSquare size={14} />
              <span>AI Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                viewMode === 'pdf'
                  ? 'bg-amber-800 text-white dark:bg-amber-700 shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
              }`}
            >
              <BookOpen size={14} />
              <span>PDF Document</span>
            </button>
          </div>

          {/* Focus Mode / Fullscreen Window Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFocusMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer text-xs font-bold ${
              isFocusMode ? 'bg-amber-800 text-white dark:bg-amber-600 border-amber-700' : ''
            }`}
            title={isFocusMode ? "Exit Focus Mode (Esc)" : "Maximize Window (Focus Mode)"}
          >
            {isFocusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border/80 bg-card text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <Sun size={15} className="dark:hidden text-amber-600" />
            <MoonStar size={15} className="hidden dark:block text-amber-400" />
          </button>

          {/* User Profile Avatar */}
          <div className="p-0.5 rounded-full border border-amber-800/30 dark:border-amber-400/30 shrink-0">
            <UserButton />
          </div>

        </div>

      </div>

      {/* Main Interactive Grid Layout */}
      <div className="w-full flex-1 transition-all">
        
        {/* SPLIT VIEW MODE: Left Side = AI Voice Chat (6 cols), Right Side = Interactive PDF (6 cols) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full h-full">
            {/* Left Column: AI Voice & Text Controls */}
            <div className="lg:col-span-6 w-full">
              <VapiControls 
                book={book} 
                onPageCitationClick={handlePageCitationClick} 
              />
            </div>

            {/* Right Column: PDF Reader Document */}
            <div className="lg:col-span-6 w-full sticky top-16">
              <PDFViewer 
                fileURL={book.fileURL} 
                title={book.title} 
                activePage={activePdfPage}
                onPageChange={(pageNum) => setActivePdfPage(pageNum)}
              />
            </div>
          </div>
        )}

        {/* CHAT ONLY MODE */}
        {viewMode === 'chat' && (
          <div className="w-full max-w-6xl mx-auto">
            <VapiControls 
              book={book} 
              onPageCitationClick={handlePageCitationClick} 
            />
          </div>
        )}

        {/* PDF ONLY MODE */}
        {viewMode === 'pdf' && (
          <div className="w-full max-w-6xl mx-auto">
            <PDFViewer 
              fileURL={book.fileURL} 
              title={book.title} 
              activePage={activePdfPage}
              onPageChange={(pageNum) => setActivePdfPage(pageNum)}
            />
          </div>
        )}

      </div>

    </div>
  );
}
