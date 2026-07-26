import { BookCardProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * BookCard Component
 * Displays an individual book card with:
 * - Book cover image with hover zoom effect
 * - Title and author information
 * - Interactive hover states with overlay & optional quick delete action
 * - "Read More" button for navigation
 */
const BookCard = ({ id, title, author, coverURL, slug, onDelete }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id && onDelete) {
      onDelete(id);
    }
  };

  return (
    <Link href={`/books/${slug}`}>
      <article 
        className="relative group h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Card Container */}
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 dark:border-white/15 bg-card/95 dark:bg-slate-900/90 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-amber-700/50 dark:hover:border-amber-400/60">
          
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-950 rounded-t-2xl">
            <div className="relative h-56 md:h-64 w-full flex items-center justify-center">
              <Image 
                src={coverURL || 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'} 
                alt={title} 
                width={180} 
                height={280}
                unoptimized={Boolean(coverURL?.startsWith('data:'))}
                className={`h-full w-auto object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-108' : 'scale-100'
                }`}
              />
              
              {/* Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Optional Quick Delete Button */}
              {onDelete && id && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/95 text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:scale-110 ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                  }`}
                  title={`Delete "${title}"`}
                  aria-label="Delete book"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="line-clamp-2 text-base font-bold leading-tight text-foreground transition-colors hover:text-amber-700 dark:hover:text-amber-300 font-serif">
                {title}
              </h3>
            </div>

            <div className="mb-3">
              <p className="line-clamp-1 text-sm font-medium text-muted-foreground md:text-base">
                {author}
              </p>
            </div>

            <div className="border-t border-border/60 dark:border-white/10 pt-3">
              <button 
                type="button"
                className="inline-flex items-center text-sm font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors group/btn"
              >
                Read & Talk to AI
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

        {/* Glow Effect */}
        <div 
          className={`absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 transition-opacity duration-300 -z-10 ${
            isHovered ? 'opacity-30 dark:opacity-40 blur-xs' : 'opacity-0'
          }`}
        />
      </article>
    </Link>
  );
};

export default BookCard;