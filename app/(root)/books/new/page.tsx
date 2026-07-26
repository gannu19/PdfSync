import UploadForm from '@/components/UploadForm';
import React from 'react';

const Page = () => {
  return (
    <main className="wrapper container pt-24 pb-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground dark:text-white tracking-tight">
            Add a New Book
          </h1> 
          <p className="text-base text-muted-foreground font-medium">
            Upload a PDF to generate your interactive reading experience with AI voice and RAG search.
          </p>
        </section>

        <UploadForm />
      </div>
    </main>
  );
};

export default Page;