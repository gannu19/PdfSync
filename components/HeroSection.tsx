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
      <div className="rounded-2xl shadow-2xl overflow-hidden">
        {/* Gradient Beige Background */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-8 md:p-12">
          {/* Three-column grid layout: content, illustration, steps (responsive to single column on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* LEFT SECTION - Main heading, description, and call-to-action button */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Your Library
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
                </p>
              </div>
              
              {/* Call-to-action button with plus icon - users can click to add a new book to their library */}
              <Button 
                className="w-fit bg-white text-amber-600 hover:bg-amber-50 border-2 border-amber-200 rounded-xl px-6 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Add new book
              </Button>
            </div>

            {/* CENTER SECTION - Decorative illustration showing three books and a globe */}
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Decorative Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-30 blur-3xl"></div>
                
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
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
                <div className="space-y-6">
                  
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-lg shadow-md">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Upload PDF</h3>
                      <p className="text-sm text-gray-600 mt-1">Add your book file</p>
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
                      <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
                      <p className="text-sm text-gray-600 mt-1">We analyze the content</p>
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
                      <h3 className="text-lg font-semibold text-gray-900">Voice Chat</h3>
                      <p className="text-sm text-gray-600 mt-1">Discuss with AI</p>
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
