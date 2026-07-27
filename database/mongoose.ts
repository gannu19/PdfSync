import mongoose from "mongoose";

// Mongoose connection string retrieved from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

/**
 * Global interface extension to cache the Mongoose connection across hot-reloads
 * in Next.js serverless functions, preventing connection leaks.
 */
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// Retrieve or initialize cached connection object on the global scope
let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to MongoDB database using a cached connection for serverless efficiency.
 * Prevents multiple connections during hot module replacement (HMR) or serverless invocations.
 * 
 * @returns {Promise<typeof mongoose>} The connected Mongoose instance.
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
    // If an active connection exists in cache, reuse it
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection promise is pending, initiate a new connection
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false,
        }).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        // Await the connection promise and store the resolved connection
        cached.conn = await cached.promise;
    } catch (e) {
        // Reset promise on failure to allow retry on next invocation
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

