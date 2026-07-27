import { Schema, model, models } from "mongoose";
import { IBookSegment } from "@/types";

/**
 * Mongoose Schema representing a parsed text segment/chunk of a Book.
 * Includes page mapping, segment index, text content, word count, and full-text index.
 */
const BookSegmentSchema = new Schema<IBookSegment>({
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true, index: true },
    pageNumber: { type: Number, index: true },
    heading: { type: String },
    section: { type: String },
    embedding: { type: [Number], default: undefined },
    wordCount: { type: Number, required: true },
}, { timestamps: true });

// Compound indexes for performant lookups and segment ordering
BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 }, { unique: true });
BookSegmentSchema.index({ bookId: 1, pageNumber: 1 });
BookSegmentSchema.index({ clerkId: 1, content: 'text' });

// Export cached model or compile a new one
const BookSegment = models.BookSegment || model<IBookSegment>('BookSegment', BookSegmentSchema);

export default BookSegment;

