import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}
declare global {
    var mongooseCache:{
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;

    }
}

let caches = global.mongooseCache || (globalCache = { conn: null, promise: null });
if (caches.conn) return caches.conn;
if (!caches.promise) {
    caches.promise = mongoose.connect(MONGO_URI,{bufferCommands: false}).then((mongoose) => {
        return mongoose;
    });
}
try{
    caches.conn = await caches.promise;

}catch(e){
    cached.promise = null;
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + e,)
    throw e;
}

console.info("Connected to MongoDB");
return caches.conn;


export const connectToDatabase = async () => {
}

