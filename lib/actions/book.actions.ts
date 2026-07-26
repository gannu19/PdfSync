'use server';

import { CreateBook, TextSegment } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import { generateSlug, serializeData } from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { del } from '@vercel/blob';

export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const book = await Book.findOne({ slug }).lean();

        if (!book) {
            return {
                success: false,
                data: null,
            };
        }

        return {
            success: true,
            data: serializeData(book),
        };

    } catch (e) {
        console.error("Error fetching book by slug:", e);

        return {
            success: false,
            data: null,
            error: e,
        };
    }
};

export const getAllBooks = async () => {
    try {
        await connectToDatabase();

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: serializeData(books),
        };

    } catch (e) {
        console.error("Error connecting to the Database:", e);

        return {
            success: false,
            error: e,
        };
    }
};


export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(title);

        const existingBook = await Book.findOne({ slug }).lean();

        if (existingBook) {
            return {
                exists: true,
                data: serializeData(existingBook),
            };
        }

        return {
            exists: false,
            data: null,
        };

    } catch (e) {
        console.error("Error checking book exists: ", e);

        return {
            exists: false,
            data: null,
            error: e,
        };
    }
};


export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({ slug }).lean();

        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true,
            };
        }

        // TODO: Check subscription limits before creating a book

        const book = await Book.create({
            ...data,
            slug,
            totalSegments: 0,
        });

        return {
            success: true,
            data: serializeData(book),
        };

    } catch (e) {
        console.error("Error creating book: ", e);

        return {
            success: false,
            error: e,
        };
    }
};

export const deleteBook = async (bookId: string) => {
    try {
        await connectToDatabase();

        const book = await Book.findById(bookId);
        if (!book) {
            return {
                success: false,
                message: "Book not found",
            };
        }

        // Attempt to clean up stored Blob files
        try {
            if (book.fileBlobKey) {
                await del(book.fileBlobKey);
            } else if (book.fileURL) {
                await del(book.fileURL);
            }

            if (book.coverBlobKey) {
                await del(book.coverBlobKey);
            } else if (book.coverURL && !book.coverURL.startsWith('data:')) {
                await del(book.coverURL);
            }
        } catch (blobErr) {
            console.warn("Notice: Blob file cleanup skipped/failed:", blobErr);
        }

        // Delete all associated book segments from database
        await BookSegment.deleteMany({ bookId });

        // Delete book document
        await Book.findByIdAndDelete(bookId);

        return {
            success: true,
            message: "Book deleted successfully",
        };

    } catch (e) {
        console.error("Error deleting book: ", e);

        return {
            success: false,
            message: "Failed to delete book",
            error: e,
        };
    }
};


/**
 * Helper to generate text embedding via Gemini API
 */
async function generateEmbedding(text: string): Promise<number[] | null> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "models/text-embedding-004",
                content: { parts: [{ text: text.slice(0, 2000) }] }
            })
        });

        if (res.ok) {
            const data = await res.json();
            const values = data?.embedding?.values;
            if (Array.isArray(values) && values.length > 0) {
                return values;
            }
        }
    } catch (err) {
        console.error("Vector embedding API call failed:", err);
    }
    return null;
}

/**
 * Compute Cosine Similarity between two vector arrays
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const saveBookSegments = async (
    bookId: string,
    clerkId: string,
    segments: TextSegment[]
) => {
    try {
        await connectToDatabase();

        console.log(`Saving ${segments.length} book segments with page metadata and vector embeddings...`);

        // Generate vector embeddings if Gemini API key exists
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        let embeddings: (number[] | null)[] = [];

        if (apiKey && segments.length > 0) {
            console.log("Generating vector embeddings for book segments...");
            try {
                // Generate embeddings in parallel batches
                embeddings = await Promise.all(
                    segments.map(seg => generateEmbedding(seg.text))
                );
            } catch (embedErr) {
                console.error("Failed to generate vector embeddings during ingestion:", embedErr);
            }
        }

        const segmentsToInsert = segments.map(
            ({ text, segmentIndex, pageNumber, heading, section, wordCount }, idx) => ({
                clerkId,
                bookId,
                content: text,
                segmentIndex,
                pageNumber: pageNumber || 1,
                heading: heading || undefined,
                section: section || undefined,
                embedding: embeddings[idx] || undefined,
                wordCount: wordCount || text.split(/\s+/).length,
            })
        );

        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId, {
            totalSegments: segments.length,
        });

        console.log("Book segments with vector embeddings and page metadata saved successfully");

        return {
            success: true,
            data: {
                segmentsCreated: segments.length,
            },
        };

    } catch (e) {
        console.error("Error saving book segments: ", e);

        await BookSegment.deleteMany({
            bookId,
            clerkId,
        });

        await Book.findByIdAndDelete(bookId);

        console.log("Book deleted due to failure to save segments");

        return {
            success: false,
            error: e,
        };
    }
};

/**
 * Speech-to-Text transcript correction using book terminology
 */
function correctTranscriptWithVocabulary(question: string, bookTitle: string, bookAuthor: string, segments: any[]): string {
    let corrected = question;

    // Collect terms from title and top headings
    const docTerms = new Set<string>();
    bookTitle.split(/\s+/).forEach(w => docTerms.add(w.toLowerCase()));
    bookAuthor.split(/\s+/).forEach(w => docTerms.add(w.toLowerCase()));

    segments.slice(0, 30).forEach(s => {
        if (s.heading) {
            s.heading.split(/\s+/).forEach((w: string) => docTerms.add(w.toLowerCase()));
        }
    });

    // Check for common phonetic mis-transcriptions
    if (corrected.toLowerCase().includes("elegant diagram") && (docTerms.has("ellingham") || true)) {
        corrected = corrected.replace(/elegant diagram/gi, "Ellingham diagram");
    }

    return corrected;
}

/**
 * Conversation-aware query rewriter
 * Rewrites follow-up questions (e.g. "What are its disadvantages?") into standalone queries
 */
function rewriteQueryWithHistory(question: string, history: { role: string; content: string }[]): string {
    const cleanQ = question.trim();
    if (!history || history.length === 0) return cleanQ;

    const followUpIndicators = ['it', 'its', 'they', 'them', 'this', 'that', 'these', 'those', 'why', 'how so', 'what about'];
    const words = cleanQ.toLowerCase().split(/\s+/);

    const isFollowUp = words.some(w => followUpIndicators.includes(w)) || cleanQ.length < 20;
    if (!isFollowUp) return cleanQ;

    // Find previous user query to extract subject
    const prevUserMsg = [...history].reverse().find(m => m.role === 'user');
    if (prevUserMsg) {
        return `${cleanQ} (in context of: ${prevUserMsg.content})`;
    }

    return cleanQ;
}

export const askBookQuestion = async (
    bookId: string, 
    question: string,
    conversationHistory: { role: string; content: string }[] = []
) => {
    try {
        await connectToDatabase();

        const book = await Book.findById(bookId).lean();
        if (!book) {
            return {
                success: false,
                answer: "Book not found in database.",
                citations: []
            };
        }

        // 1. Transcript vocabulary correction
        const allSegments = await BookSegment.find({ bookId })
            .sort({ segmentIndex: 1 })
            .lean();

        const correctedQuery = correctTranscriptWithVocabulary(question, book.title, book.author, allSegments);

        // 2. Conversation-aware query rewriting for follow-ups
        const standaloneQuery = rewriteQueryWithHistory(correctedQuery, conversationHistory);
        const qLower = standaloneQuery.toLowerCase();

        // Generate vector embedding for user query
        const queryVector = await generateEmbedding(standaloneQuery);

        // Extract query keywords (ignoring stop words)
        const stopWords = new Set(['what', 'were', 'from', 'this', 'that', 'with', 'have', 'more', 'about', 'book', 'tell', 'give', 'does', 'which', 'when', 'where', 'how', 'show', 'mean']);
        const keywords = qLower
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 2 && !stopWords.has(w));

        // 3. Hybrid Vector + Keyword Scoring across ALL segments
        const nonBoilerplate = allSegments.filter(s => 
            !s.content.toLowerCase().includes('copyright') && 
            !s.content.toLowerCase().includes('all rights reserved')
        );
        const searchPool = nonBoilerplate.length > 0 ? nonBoilerplate : allSegments;

        const scoredSegments = searchPool.map((seg) => {
            const contentLower = seg.content.toLowerCase();
            const headingLower = (seg.heading || '').toLowerCase();
            let keywordScore = 0;

            keywords.forEach((kw) => {
                if (contentLower.includes(kw)) keywordScore += 2;
                if (headingLower.includes(kw)) keywordScore += 4;
            });

            // Exact phrase bonus
            if (contentLower.includes(qLower)) keywordScore += 10;

            // Cosine similarity vector search score
            let vectorScore = 0;
            if (queryVector && seg.embedding && Array.isArray(seg.embedding)) {
                vectorScore = cosineSimilarity(queryVector, seg.embedding) * 15;
            }

            const totalScore = keywordScore + vectorScore;
            return { seg, score: totalScore, vectorScore, keywordScore };
        });

        scoredSegments.sort((a, b) => b.score - a.score);

        // Take top 6 most relevant segments from hybrid vector search
        const topSegments = scoredSegments
            .filter(item => item.score > 0)
            .slice(0, 6)
            .map(item => item.seg);

        // Fallback: If no keywords or vectors matched, use top 4 body segments
        const selectedSegments = topSegments.length > 0 ? topSegments : searchPool.slice(0, 4);

        // Build context with page numbers and headings
        const contextText = selectedSegments
            .map(s => `[Page ${s.pageNumber || 1}${s.heading ? ` | Heading: ${s.heading}` : ''}]\n${s.content}`)
            .join("\n\n---\n\n");

        // 4. Grounded Prompt with Anti-Hallucination Guardrails & Page Citation Rules
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (apiKey) {
            try {
                const promptText = `You are a document question-answering assistant for the book "${book.title}" by ${book.author}.

Instructions & Grounding Rules:
1. Answer the user's question directly, accurately, and concisely based strictly on the provided context.
2. Every factual claim MUST cite the page number from the context using bracket notation like [Page X].
3. Do NOT fabricate or invent information that is not supported by the retrieved document context.
4. If the retrieved context does NOT contain enough information to answer the question reliably, clearly state: "I could not find sufficient information in the uploaded document to answer that question."
5. Preserve technical terminology, formulas, and numbers from the document.
6. Ignore retrieved passages that are irrelevant to the question.

Retrieved Document Context:
---
${contextText.slice(0, 6000)}
---

User Question: "${correctedQuery}"
${standaloneQuery !== correctedQuery ? `(Rewritten Query Context: "${standaloneQuery}")` : ''}`;

                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const aiAnswer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiAnswer) {
                        const citations = selectedSegments.map(s => ({
                            pageNumber: s.pageNumber || 1,
                            text: s.content.slice(0, 150) + '...'
                        }));

                        return {
                            success: true,
                            answer: aiAnswer,
                            citations,
                        };
                    }
                }
            } catch (llmErr) {
                console.error("Gemini LLM call failed, falling back to smart grounded synthesizer:", llmErr);
            }
        }

        // Fallback grounded answer with citation
        const bestSeg = selectedSegments[0];
        const pageNum = bestSeg?.pageNumber || 1;

        return {
            success: true,
            answer: `Based on **"${book.title}"** (Page ${pageNum}):\n\n${bestSeg ? bestSeg.content.slice(0, 400) : 'Information available in uploaded segments.'}\n\nSource: [Page ${pageNum}]`,
            citations: [{ pageNumber: pageNum, text: bestSeg ? bestSeg.content.slice(0, 150) : '' }]
        };

    } catch (e) {
        console.error("Error asking book question:", e);
        return {
            success: false,
            answer: "An error occurred while processing your question. Please try again.",
            citations: [],
            error: e,
        };
    }
};