'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  Sparkles,
  Loader2,
  FileText,
  ExternalLink,
  Highlighter
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker URL for pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PDFViewerProps {
  /** Blob URL or remote HTTP link to the PDF document */
  fileURL: string;
  /** Document title for headers */
  title: string;
  /** Currently requested active page (for programmatic AI citation jumps) */
  activePage?: number;
  /** Callback fired when page navigation occurs */
  onPageChange?: (pageNum: number) => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', hex: '#fde047', bgClass: 'bg-yellow-300' },
  { name: 'Amber', hex: '#f59e0b', bgClass: 'bg-amber-500' },
  { name: 'Emerald', hex: '#34d399', bgClass: 'bg-emerald-400' },
  { name: 'Cyan', hex: '#38bdf8', bgClass: 'bg-sky-400' },
  { name: 'Pink', hex: '#f472b6', bgClass: 'bg-pink-400' },
];

/**
 * Interactive PDF Canvas Viewer component.
 * Renders pages dynamically using `pdfjs-dist` on an HTML5 canvas, supporting page jumps,
 * zoom controls, page citations, full screen view, and page highlight effects.
 */
export default function PDFViewer({
  fileURL,
  title,
  activePage = 1,
  onPageChange,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(activePage);
  const [prevActivePage, setPrevActivePage] = useState<number>(activePage);

  const [scale, setScale] = useState<number>(1.2);
  const [highlightColor, setHighlightColor] = useState<string>('#fde047');
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  const [prevFileURL, setPrevFileURL] = useState<string>(fileURL);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  // Derived state sync for activePage prop changes (programmatic AI citation jump)
  if (activePage !== prevActivePage) {
    setPrevActivePage(activePage);
    if (activePage <= numPages && activePage >= 1) {
      setCurrentPage(activePage);
      setIsHighlighted(true);
    }
  }

  // Derived state sync for fileURL changes
  if (fileURL !== prevFileURL) {
    setPrevFileURL(fileURL);
    setIsLoading(true);
    setError(null);
  }

  // Auto-dismiss highlight pulse after citation jump
  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: fileURL,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error('Failed to load PDF in canvas viewer:', err);
        if (isMounted) {
          setError('Could not load PDF in interactive canvas mode.');
          setIsLoading(false);
        }
      }
    };

    if (fileURL) {
      loadPDF();
    }

    return () => {
      isMounted = false;
    };
  }, [fileURL]);

  // Render Current Page onto Canvas whenever currentPage or scale changes
  useEffect(() => {
    if (!pdfDocRef.current || isLoading) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        const page = await pdfDocRef.current!.getPage(currentPage);
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Cancel previous render task if active
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        };


        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: unknown) {
        const errorObj = err as { name?: string };
        if (errorObj?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [currentPage, scale, isLoading]);


  const handlePrevPage = () => {
    if (currentPage > 1) {
      const nextP = currentPage - 1;
      setCurrentPage(nextP);
      setIsHighlighted(true);
      if (onPageChange) onPageChange(nextP);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      const nextP = currentPage + 1;
      setCurrentPage(nextP);
      setIsHighlighted(true);
      if (onPageChange) onPageChange(nextP);
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  return (
    <div className="flex flex-col h-full w-full rounded-3xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[600px]">
      
      {/* Control Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/60 border-b border-border/60">
        
        {/* Left: Title & Citation Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-800 text-white dark:bg-amber-600 shadow-xs">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-sm font-bold text-foreground truncate max-w-[180px] sm:max-w-[240px]">
              {title}
            </h3>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Auto-syncs with AI citations
            </p>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2 bg-background border border-border/80 rounded-xl px-2 py-1 shadow-xs">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-foreground disabled:opacity-30 transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-semibold text-foreground px-1 select-none">
            Page <span className="font-bold text-amber-800 dark:text-amber-400">{currentPage}</span> of {numPages || '--'}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-foreground disabled:opacity-30 transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Color Picker, Zoom Controls & New Tab */}
        <div className="flex items-center gap-2">
          
          {/* Interactive Highlight Color Picker */}
          <div className="flex items-center gap-1 bg-background border border-border/80 rounded-xl px-2 py-1 shadow-xs" title="Choose PDF Citation Highlight Color">
            <Highlighter size={13} className="text-muted-foreground mr-0.5" />
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setHighlightColor(c.hex)}
                className={`h-4.5 w-4.5 rounded-full ${c.bgClass} transition-transform cursor-pointer ${
                  highlightColor === c.hex ? 'ring-2 ring-foreground scale-110' : 'hover:scale-105 opacity-80'
                }`}
                title={`Highlight in ${c.name}`}
              />
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>

            <span className="text-[11px] font-bold text-muted-foreground w-10 text-center select-none">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Open PDF in new tab"
          >
            <ExternalLink size={13} />
          </a>
        </div>

      </div>

      {/* Main Canvas Document Viewer */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-auto bg-muted/20 min-h-[500px]">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-amber-700 dark:text-amber-400" />
            <p className="text-xs font-semibold">Loading PDF Viewer...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 bg-card rounded-2xl border border-border/80 shadow-md">
            <FileText className="h-10 w-10 text-amber-700 dark:text-amber-400" />
            <div>
              <p className="text-sm font-bold text-foreground">Interactive Canvas Preview</p>
              <p className="text-xs text-muted-foreground mt-1">
                Embedded browser PDF viewer is available.
              </p>
            </div>
            <iframe
              src={`${fileURL}#page=${currentPage}`}
              className="w-full h-96 rounded-xl border border-border/60"
              title={title}
            />
          </div>
        )}

        {!isLoading && !error && (
          <div 
            className="relative shadow-2xl rounded-lg overflow-hidden border transition-all duration-300"
            style={{
              borderColor: isHighlighted ? highlightColor : 'rgba(0,0,0,0.1)',
              boxShadow: isHighlighted 
                ? `0 0 25px ${highlightColor}, 0 20px 40px rgba(0,0,0,0.15)` 
                : '0 20px 40px rgba(0,0,0,0.12)'
            }}
          >
            {/* Active Citation Highlight Floating Badge */}
            <div 
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-lg transition-all animate-bounce"
              style={{ 
                backgroundColor: highlightColor, 
                color: '#000000',
                border: '1px solid rgba(0,0,0,0.15)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Page {currentPage} Highlighted</span>
            </div>

            {/* Glowing Citation Overlay Tint */}
            {isHighlighted && (
              <div 
                className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
                style={{
                  backgroundColor: highlightColor,
                  opacity: 0.15
                }}
              />
            )}

            <canvas ref={canvasRef} className="max-w-full h-auto block" />
          </div>
        )}
      </div>

    </div>
  );
}
