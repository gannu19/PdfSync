'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import { IBook } from '@/types';
import Link from 'next/link';
import { Plus, BookOpen, Search, X, User, SearchX, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteBook } from '@/lib/actions/book.actions';
import { toast } from 'sonner';

const BOOKS_PER_PAGE = 10;

export type SearchFilterMode = 'all' | 'title' | 'author';

interface BookLibraryProps {
  books: IBook[];
}

export default function BookLibrary({ books: initialBooks }: BookLibraryProps) {
  const [bookList, setBookList] = useState<IBook[]>(initialBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<SearchFilterMode>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBookList(initialBooks);
  }, [initialBooks]);

  // Filter books based on search query and selected filter mode
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookList;

    return bookList.filter((book) => {
      const titleMatch = book.title?.toLowerCase().includes(query) || false;
      const authorMatch = book.author?.toLowerCase().includes(query) || false;

      if (filterMode === 'title') return titleMatch;
      if (filterMode === 'author') return authorMatch;
      return titleMatch || authorMatch;
    });
  }, [bookList, searchQuery, filterMode]);

  // Reset pagination when search query or filter mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMode]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));

  const visibleBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilterMode('all');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await deleteBook(bookId);
      if (res.success) {
        toast.success("Book deleted successfully");
        setBookList((prev) => prev.filter((b) => (b._id || (b as any).id) !== bookId));
      } else {
        toast.error(res.message || "Failed to delete book");
      }
    } catch (err) {
      console.error("Delete book error:", err);
      toast.error("Failed to delete book");
    }
  };

  const isFiltered = searchQuery.trim().length > 0 || filterMode !== 'all';

  return (
    <section className="library-section pb-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl font-serif">
            Uploaded Books
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {bookList.length === 0
              ? 'No books in library'
              : isFiltered
              ? `Found ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} matching search`
              : `${bookList.length} ${bookList.length === 1 ? 'book' : 'books'} available`}
          </p>
        </div>

        {bookList.length > 0 && (
          <Link href="/books/new" className="shrink-0">
            <Button className="flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium px-4 py-2.5 shadow-sm transition-all duration-200 cursor-pointer">
              <Plus size={16} />
              Add Book
            </Button>
          </Link>
        )}
      </div>

      {/* Modern Search Control Bar */}
      {bookList.length > 0 && (
        <div className="mb-8 rounded-2xl border border-border/70 bg-card/80 p-4 md:p-5 shadow-sm backdrop-blur-md transition-all">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-[280px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Search className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  filterMode === 'title'
                    ? 'Search by book title...'
                    : filterMode === 'author'
                    ? 'Search by author name...'
                    : 'Search by title or author...'
                }
                className="w-full rounded-xl border border-border/80 bg-background/90 py-3 pl-11 pr-24 text-sm md:text-base text-foreground placeholder:text-muted-foreground/70 shadow-inner outline-none transition-all duration-200 focus:border-amber-700/60 focus:ring-2 focus:ring-amber-700/20 dark:focus:border-amber-400/60 dark:focus:ring-amber-400/20"
              />

              {/* Right Side Input Controls: ESC hint & Clear X Button */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors cursor-pointer"
                    title="Clear search (Esc)"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                ) : (
                  <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 select-none">
                    ESC to clear
                  </span>
                )}
              </div>
            </div>

            {/* Filter Target Pills (All / Title / Author) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
                <Filter size={13} className="text-amber-700 dark:text-amber-400" />
                Filter by:
              </span>

              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                  filterMode === 'all'
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-900/10 dark:bg-amber-700'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Sparkles size={14} />
                All Fields
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('title')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                  filterMode === 'title'
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-900/10 dark:bg-amber-700'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <BookOpen size={14} />
                Title
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('author')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                  filterMode === 'author'
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-900/10 dark:bg-amber-700'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <User size={14} />
                Author
              </button>
            </div>

          </div>

          {/* Active Filter Indicators Bar */}
          {isFiltered && (
            <div className="mt-3.5 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Active search:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 px-2 py-0.5 font-medium">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                  Mode: {filterMode === 'all' ? 'Title & Author' : filterMode === 'title' ? 'Title only' : 'Author only'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="text-amber-800 dark:text-amber-400 hover:underline font-medium cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area: Books Grid or Empty States */}
      {bookList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 py-16 px-4 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No books uploaded yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Upload your first PDF book to start listening, reading, and interacting with AI.
          </p>
          <Link href="/books/new">
            <Button className="flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold px-6 py-5 shadow-md">
              <Plus size={18} />
              Upload your first book
            </Button>
          </Link>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/60 py-14 px-4 text-center shadow-sm backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">No matching books found</h3>
          <p className="text-muted-foreground max-w-md mb-6 text-sm">
            We couldn&apos;t find any books matching &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
            {filterMode !== 'all' ? ` searching in ${filterMode}` : ''}.
            Try checking spelling or switching filter mode.
          </p>
          <Button
            onClick={handleClearSearch}
            variant="outline"
            className="flex items-center gap-2 rounded-xl border-amber-800/30 text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 px-5 py-2.5 font-medium cursor-pointer"
          >
            <X size={16} />
            Clear Search Filter
          </Button>
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="library-books-grid">
            {visibleBooks.map((book) => (
              <BookCard
                key={book._id}
                id={book._id}
                title={book.title}
                author={book.author}
                coverURL={book.coverURL || 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'}
                slug={book.slug}
                onDelete={handleDeleteBook}
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
