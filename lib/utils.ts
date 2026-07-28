import { TextSegment } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    DEFAULT_VOICE,
    voiceOptions,
    MAX_FILE_SIZE,
    ACCEPTED_PDF_TYPES,
    MAX_IMAGE_SIZE,
    ACCEPTED_IMAGE_TYPES,
} from './constants';

/**
 * Validates whether an uploaded file is a valid PDF within file size limits.
 * 
 * @param {File} file The target file object to check
 * @returns {{ success: boolean; error?: string }} Validation status and error message
 */
export const validatePDF = (file: File): { success: boolean; error?: string } => {
    if (!ACCEPTED_PDF_TYPES.includes(file.type)) {
        return { success: false, error: 'File must be a PDF' };
    }
    if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: 'File size must be less than 50MB' };
    }
    return { success: true };
};

/**
 * Validates cover image format and size constraints.
 * 
 * @param {File} file The target image file object to check
 * @returns {{ success: boolean; error?: string }} Validation result
 */
export const validateCoverImage = (file: File): { success: boolean; error?: string } => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return { success: false, error: 'File must be an image (jpeg, png, or webp)' };
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return { success: false, error: 'Image size must be less than 10MB' };
    }
    return { success: true };
};

/**
 * Combines Tailwind CSS classes using clsx and twMerge to resolve duplicate utility conflicts.
 * 
 * @param {...ClassValue[]} inputs List of class values, objects, or conditional arrays
 * @returns {string} Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serializes Mongoose documents or deep nested objects to plain JSON objects,
 * stripping Mongo ObjectIds, Date types, and internal methods for Next.js Server Action compatibility.
 * 
 * @template T Type of data being serialized
 * @param {T} data Input object or document
 * @returns {T} Plain JavaScript object
 */
export const serializeData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

/**
 * Generates a clean, URL-safe slug from string input (e.g. book titles or filenames).
 * Removes extensions, special characters, and formats whitespace as single hyphens.
 * 
 * @param {string} text Target title or string
 * @returns {string} Clean URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
      .replace(/\.[^/.]+$/, '') // Remove file extension (.pdf, .txt, etc.)
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from both ends
      .replace(/[^\w\s-]/g, '') // Remove special characters (keep letters, numbers, spaces, hyphens)
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Escapes regex special characters in string inputs to prevent Regular Expression Denial of Service (ReDoS).
 * 
 * @param {string} str Target raw search string
 * @returns {string} Escaped safe regex string
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export interface PageText {
    pageNum: number;
    text: string;
}


/**
 * Splits page-by-page extracted PDF text into structured, overlapping text segments.
 * Preserves page numbers and detects heading/section structure for AI citations.
 * 
 * @param {PageText[]} pages Array of page numbers and extracted text
 * @param {number} maxWordsPerSegment Maximum word count threshold per segment (default: 350)
 * @param {number} overlapWords Overlap word count between consecutive segments (default: 40)
 * @returns {TextSegment[]} Formatted segments array ready for storage
 */
export const splitPagesIntoSegments = (
    pages: PageText[],
    maxWordsPerSegment: number = 350,
    overlapWords: number = 40
): TextSegment[] => {
    const segments: TextSegment[] = [];
    let segmentIndex = 0;

    let currentChunkWords: string[] = [];
    let currentStartPage = 1;
    let currentHeading = '';

    const isHeadingLine = (line: string) => {
        if (line.length > 70 || line.endsWith('.')) return false;
        if (/^(?:Chapter|Section|Part|Unit|Lesson|Module)\s+\d+/i.test(line)) return true;
        if (/^\d+(\.\d+)*\s+[A-Z]/i.test(line)) return true;
        if (line === line.toUpperCase() && line.replace(/[^A-Z]/g, '').length >= 4) return true;
        return false;
    };

    for (const page of pages) {
        const lines = page.text.split(/(?<=[.!?])\s+|\n+/);

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            if (isHeadingLine(trimmedLine)) {
                currentHeading = trimmedLine;
            }

            const lineWords = trimmedLine.split(/\s+/).filter((w) => w.length > 0);
            if (lineWords.length === 0) continue;

            if (currentChunkWords.length === 0) {
                currentStartPage = page.pageNum;
            }

            currentChunkWords.push(...lineWords);

            if (currentChunkWords.length >= maxWordsPerSegment) {
                const chunkText = currentChunkWords.join(' ');
                segments.push({
                    text: chunkText,
                    segmentIndex,
                    pageNumber: currentStartPage,
                    heading: currentHeading || undefined,
                    wordCount: currentChunkWords.length,
                });
                segmentIndex++;

                // Overlap words for continuous context across chunks
                const overlap = currentChunkWords.slice(currentChunkWords.length - overlapWords);
                currentChunkWords = [...overlap];
                currentStartPage = page.pageNum;
            }
        }
    }

    if (currentChunkWords.length > 0) {
        const chunkText = currentChunkWords.join(' ');
        segments.push({
            text: chunkText,
            segmentIndex,
            pageNumber: currentStartPage,
            heading: currentHeading || undefined,
            wordCount: currentChunkWords.length,
        });
    }

    return segments;
};

/**
 * Splits raw continuous text content into indexed segments (legacy/fallback chunker).
 * 
 * @param {string} text Raw book content
 * @param {number} segmentSize Max word limit per chunk
 * @param {number} overlapSize Overlap word count
 * @returns {TextSegment[]} Array of structured text segments
 */
export const splitIntoSegments = (
    text: string,
    segmentSize: number = 500,
    overlapSize: number = 50,
): TextSegment[] => {
  if (segmentSize <= 0) {
    throw new Error('segmentSize must be greater than 0');
  }
  if (overlapSize < 0 || overlapSize >= segmentSize) {
    throw new Error('overlapSize must be >= 0 and < segmentSize');
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const segments: TextSegment[] = [];

  let segmentIndex = 0;
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + segmentSize, words.length);
    const segmentWords = words.slice(startIndex, endIndex);
    const segmentText = segmentWords.join(' ');

    segments.push({
      text: segmentText,
      segmentIndex,
      pageNumber: 1,
      wordCount: segmentWords.length,
    });

    segmentIndex++;

    if (endIndex >= words.length) break;
    startIndex = endIndex - overlapSize;
  }

  return segments;
};

/**
 * Retrieves voice configuration options based on persona name or voice key.
 * 
 * @param {string} [persona] Target persona string or voice ID
 * @returns {object} Voice configuration object from constants
 */
export const getVoice = (persona?: string) => {
  if (!persona) return voiceOptions[DEFAULT_VOICE];

  // Find by voice ID
  const voiceEntry = Object.values(voiceOptions).find((v) => v.id === persona);
  if (voiceEntry) return voiceEntry;

  // Find by key
  const voiceByKey = voiceOptions[persona as keyof typeof voiceOptions];
  if (voiceByKey) return voiceByKey;

  // Default fallback
  return voiceOptions[DEFAULT_VOICE];
};

/**
 * Formats time duration in total seconds into a clean `MM:SS` display string.
 * 
 * @param {number} seconds Elapsed time in seconds
 * @returns {string} Formatted time string (e.g. "04:15")
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parses an uploaded PDF file on the client using `pdfjs-dist`.
 * Extracts full text per page, chunks content into structured segments,
 * and renders page 1 on an HTML5 canvas to generate a high-res PNG cover image URL.
 * 
 * @param {File} file Target PDF file object
 * @returns {Promise<{ content: TextSegment[]; cover: string }>} Extracted segments and cover data URL
 */
export async function parsePDFFile(file: File) {
  try {
    const pdfjsLib = await import('pdfjs-dist');

    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
      ).toString();
    }

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // Render first page as cover image
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2 }); // 2x scale for high crispness

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    await firstPage.render({
      canvas,
      canvasContext: context,
      viewport: viewport,
    }).promise;


    // Convert canvas to data URL
    const coverDataURL = canvas.toDataURL('image/png');

    // Extract page-by-page text while preserving page numbers
    const pages: PageText[] = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
          .filter((item) => 'str' in item)
          .map((item) => (item as { str: string }).str)
          .join(' ');

      if (pageText.trim()) {
        pages.push({ pageNum, text: pageText });
      }
    }

    // Split page text into structured segments with page numbers & headings
    const segments = splitPagesIntoSegments(pages);

    // Clean up PDF document resources
    await pdfDocument.cleanup();
    await loadingTask.destroy();

    return {
      content: segments,
      cover: coverDataURL,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`);
  }
}
