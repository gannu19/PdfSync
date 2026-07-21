'use client';

import React from 'react';
import { Plus, BookOpen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * HeroSection Component
 * Displays the main landing section with:
 * - Left: Heading, description, and CTA button
 * - Center: Decorative book stack and globe illustration
 * - Right: Three-step process card showing how the app works
 */
const HeroSection = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Card Container */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-2xl">
        {/* Gradient Beige Background */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-8 md:p-12 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          {/* Three-column grid layout: content, illustration, steps (responsive to single column on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* LEFT SECTION - Main heading, description, and call-to-action button */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="mb-3 text-4xl font-bold text-foreground md:text-5xl">
                  Your Library
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
                </p>
              </div>
              
              {/* Call-to-action button with plus icon - users can click to add a new book to their library */}
              <Button 
                className="flex w-fit items-center gap-2 rounded-xl border-2 border-amber-200 bg-background px-6 py-6 text-base font-semibold text-amber-600 shadow-md transition-all duration-300 hover:bg-amber-50 hover:shadow-lg dark:border-amber-400/40 dark:bg-slate-900 dark:text-amber-400 dark:hover:bg-slate-800"
              >
                <Plus size={20} />
                Add new book
              </Button>
            </div>

            {/* CENTER SECTION - Decorative illustration showing three books and a globe */}
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Decorative Background Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to from-amber-100 to-orange-100 opacity-30 blur-3xl dark:from-amber-500/20 dark:to-orange-500/20"></div>
                
                {/* Stack of three colorful books - represents the book library */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  {/* Three books arranged horizontally with rotations for visual interest */}
                  <div className="flex gap-4">
                    <div className="w-16 h-24 bg-amber-800 rounded-lg shadow-lg transform -rotate-12 flex items-center justify-center">
                      <BookOpen size={32} className="text-amber-100" />
                    </div>
                    <div className="w-16 h-24 bg-red-700 rounded-lg shadow-lg flex items-center justify-center">
                      <BookOpen size={32} className="text-red-100" />
                    </div>
                    <div className="w-16 h-24 bg-amber-700 rounded-lg shadow-lg transform rotate-12 flex items-center justify-center">
                      <BookOpen size={32} className="text-amber-100" />
                    </div>
                  </div>
                  
                  {/* Globe Icon */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg">
                    <Globe size={40} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Steps Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-background/90 p-8 shadow-xl dark:bg-slate-900/90">
                <div className="space-y-6">
                  
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-lg shadow-md">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Upload PDF</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Add your book file</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-lg shadow-md">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">AI Processing</h3>
                      <p className="mt-1 text-sm text-muted-foreground">We analyze the content</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 text-white font-bold text-lg shadow-md">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Voice Chat</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Discuss with AI</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
