import { BookCardProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

/**
 * BookCard Component
 * Displays an individual book card with:
 * - Book cover image with hover zoom effect
 * - Title and author information
 * - Interactive hover states with overlay
 * - "Read More" button for navigation
 * Uses state to track hover for smooth animations
 */




const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  // State to track if the card is being hovered for animation effects
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/books/${slug}`}>
      {/* Article wrapper with hover event listeners - tracks when user hovers over the card */}
      <article 
        className="relative group h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Card Container - white card with shadow that intensifies on hover */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          
          {/* Image Container - displays book cover with zoom effect on hover */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl">
            <div className="relative h-56 md:h-64 w-full flex items-center justify-center">
              {/* Book cover image - scales up 10% on hover for visual feedback */}
              <Image 
                src={coverURL} 
                alt={title} 
                width={180} 
                height={280}
                className={`h-full w-auto object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              
              {/* Dark overlay that fades in on hover - creates depth effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>

          {/* Content Section - displays title, author, and action button */}
          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
            
            {/* Book Title - limited to 2 lines for consistent card height */}
            <div className="mb-2">
              <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight hover:text-amber-600 transition-colors">
                {title}
              </h3>
            </div>

            {/* Book Author - limited to 1 line */}
            <div className="mb-3">
              <p className="text-sm md:text-base text-gray-600 line-clamp-1 font-medium">
                {author}
              </p>
            </div>

            {/* Read More Button with arrow icon - navigates to book detail page */}
            <div className="pt-3 border-t border-gray-100">
              <button 
                className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors group/btn"
              >
                Read More
                <svg 
                  className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Gradient glow effect behind card that appears on hover - creates premium feel */}
        <div 
          className={`absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 transition-opacity duration-300 -z-10 ${
            isHovered ? 'opacity-20' : 'opacity-0'
          }`}
        />
      </article>
    </Link>
  )

}
export default BookCard;