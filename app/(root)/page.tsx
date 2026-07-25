import React from 'react';
import HeroSection from '@/components/HeroSection';
import BookLibrary from '@/components/BookLibrary';
import { getAllBooks } from '@/lib/actions/book.actions';

export const revalidate = 0;

/**
 * Home Page Component
 * Main landing page that fetches uploaded books dynamically and displays:
 * - Hero section with introduction and CTA
 * - Grid of uploaded books from database
 */
const Page = async () => {
  const bookResults = await getAllBooks();
  const books = (bookResults.success && bookResults.data) ? bookResults.data : [];

  return (
    <main className="min-h-screen bg-background pt-[94px] text-foreground transition-colors duration-300">
      <div className="wrapper">
        {/* Hero Section */}
        <div className="py-12">
          <HeroSection />
        </div>

        {/* Uploaded Books Section */}
        <BookLibrary books={books} />
      </div>
    </main>
  );
};

export default Page;
