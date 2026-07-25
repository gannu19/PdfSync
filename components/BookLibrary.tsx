'use client';

import React, { useMemo, useState } from 'react';
import BookCard from '@/components/BookCard';
import { IBook } from '@/types';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BOOKS_PER_PAGE = 10;

interface BookLibraryProps {
  books: IBook[];
}

export default function BookLibrary({ books }: BookLibraryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE));

  const visibleBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return books.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [books, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="library-section pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Uploaded Books
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {books.length === 1 ? '1 book available' : `${books.length} books available`}
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 py-16 px-4 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No books uploaded yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Upload your first PDF book to start listening, reading, and interacting with AI.
          </p>
          <Link href="/books/new">
            <Button className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-5 shadow-md">
              <Plus size={18} />
              Upload your first book
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="library-books-grid">
            {visibleBooks.map((book) => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                coverURL={book.coverURL || 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'}
                slug={book.slug}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="library-pagination mt-10" aria-label="Book pagination">
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
          )}
        </>
      )}
    </section>
  );
}
