'use client';

import React, { useMemo, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import { sampleBooks } from '@/lib/constants';
import BookCard from '@/components/BookCard';

const BOOKS_PER_PAGE = 10;

/**
 * Home Page Component
 * Main landing page that displays:
 * - Hero section with introduction and CTA
 * - Grid of available books from the library
 * Features responsive layout and modern design
 */
const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sampleBooks.length / BOOKS_PER_PAGE);

  const visibleBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return sampleBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="min-h-screen bg-background pt-[94px] text-foreground transition-colors duration-300">
      {/* Main container - unified wrapper for hero and book sections with consistent max-width and padding */}
      <div className="wrapper">
        {/* Hero Section - displays app introduction and key features */}
        <div className="py-12">
          <HeroSection />
        </div>

        <section className="library-section pb-12">
          {/* Books Grid - renders the books for the active page as cards */}
          <div className='library-books-grid'> 
            {visibleBooks.map((book) => (
              <BookCard 
                key={book._id} 
                title={book.title} 
                author={book.author} 
                coverURL={book.coverURL} 
                slug={book.slug}
              />
            ))}
          </div>

          <div className="library-pagination" aria-label="Book pagination">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={`library-pagination-button ${
                    isActive ? 'library-pagination-button-active' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
