'use client';

import React from 'react';
import HeroSection from '@/components/HeroSection';
import { sampleBooks } from '@/lib/constants';
import BookCard from '@/components/BookCard';

/**
 * Home Page Component
 * Main landing page that displays:
 * - Hero section with introduction and CTA
 * - Grid of available books from the library
 * Features responsive layout and modern design
 */
const Page = () => {
  return (
    <main className="wrapper container">
      {/* Main content area with gradient background and top padding for fixed navbar */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-[94px]">
        {/* Hero Section - displays app introduction and key features */}
        <div className="wrapper px-4 py-12">
          <HeroSection />
        </div>

        {/* Books Grid - renders all available books as cards in a responsive grid layout */}
        <div className='library-books-grid'> 
          {/* Map through sampleBooks array and create a BookCard for each book */}
          {sampleBooks.map((book) => (
            <BookCard 
              key={book._id} 
              title={book.title} 
              author={book.author} 
              coverURL={book.coverURL} 
              slug={book.slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;