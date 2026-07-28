import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBookBySlug } from '@/lib/actions/book.actions';
import BookDetailsClient from '@/components/BookDetailsClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookDetailsPage({ params }: PageProps) {
  // Require auth via Clerk's auth()
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get slug from params
  const { slug } = await params;

  // Fetch book from database using getBookBySlug(slug) server action
  const result = await getBookBySlug(slug);

  // Redirect to / if not found
  if (!result || !result.success || !result.data) {
    redirect('/');
  }

  const book = result.data;

  return (
    <main className="book-page-container">
      <BookDetailsClient book={book} />
    </main>
  );
}
