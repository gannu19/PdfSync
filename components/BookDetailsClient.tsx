'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import VapiControls from "@/components/VapiControls";
import { IBook } from "@/types";

interface BookDetailsClientProps {
  book: IBook;
}

export default function BookDetailsClient({ book }: BookDetailsClientProps) {
  return (
    <div className="relative">
      {/* Floating Back Button */}
      <Link 
        href="/" 
        className="back-btn-floating group cursor-pointer"
        aria-label="Back to Library"
      >
        <ArrowLeft className="w-5 h-5 text-[#212a3b] transition-transform group-hover:-translate-x-0.5" />
      </Link>

      {/* Main Vapi Voice Controls Component */}
      <VapiControls book={book} />
    </div>
  );
}
