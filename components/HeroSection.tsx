'use client';

import React from 'react';
import { Plus, BookOpen, Mic, Cpu, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Outer Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
        {/* Glowing Ambient Backdrop */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="relative bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-100/50 p-8 md:p-12 lg:p-14 dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT COLUMN: Main Pitch & CTA (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-100/70 dark:bg-amber-950/60 dark:border-amber-400/20 px-3.5 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 w-fit shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-spin" />
                <span>Next-Gen RAG & Voice AI Reader</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-ping" />
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                Turn your books into <span className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 dark:from-amber-400 dark:via-orange-400 dark:to-amber-200 bg-clip-text text-transparent">interactive AI</span> conversations.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl font-medium">
                Upload your PDF books to perform instant RAG vector searches, ask complex questions with page-accurate citations, or discuss concepts in real-time with an AI voice agent.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/books/new">
                  <Button className="flex items-center gap-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-bold px-7 py-6 text-base shadow-xl shadow-amber-900/20 transition-all hover:scale-[1.02] cursor-pointer">
                    <Plus size={20} />
                    <span>Upload Book PDF</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-3 py-2 rounded-xl bg-background/60 border border-border/50">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Private Vector Isolation</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 3-Step Process Glass Card (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full rounded-2xl border border-border/70 bg-card/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    <span>How PdfSync Works</span>
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 bg-muted px-2.5 py-1 rounded-md">
                    3 Steps
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold shadow-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        Upload Document
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Parse PDF with structure-aware chunking & page metadata.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold shadow-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        Vector Embedding & RAG
                        <Cpu className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Generates embeddings for vector similarity search.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold shadow-xs">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        Voice & Text AI Chat
                        <Mic className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Ask questions out loud or via chat with page citations.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
