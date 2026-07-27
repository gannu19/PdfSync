import { Schema, model, models } from "mongoose";
import { IBook } from "@/types";

/**
 * Mongoose Schema representing a Book in the system.
 * Stores metadata, blob storage keys/urls, user ownership, and document statistics.
 */
const BookSchema = new Schema<IBook>({
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    author: { type: String, required: true },
    persona: { type: String },
    fileURL: { type: String, required: true },
    fileBlobKey: { type: String, required: true },
    coverURL: { type: String },
    coverBlobKey: { type: String },
    fileSize: { type: Number, required: true },
    totalSegments: { type: Number, default: 0 },
}, { timestamps: true });

// Export cached Book model or compile a new one if not already created
const Book = models.Book || model<IBook>('Book', BookSchema);

export default Book;
