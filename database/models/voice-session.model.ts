import { Schema, model, models } from "mongoose";
import { IVoiceSession } from "@/types";

/**
 * Mongoose Schema representing a Vapi Voice Session log.
 * Tracks session duration, user ID, book referenced, and start/end dates.
 */
const VoiceSessionSchema = new Schema<IVoiceSession>({
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, default: 0, required: true },
    billingPeriodStart: { type: Date, required: true, index: true },
}, { timestamps: true });

// Compound index for querying user sessions per billing cycle
VoiceSessionSchema.index({ clerkId: 1, billingPeriodStart: 1 });

/**
 * Export cached model or compile a new one
 */
const VoiceSession = models.VoiceSession || model<IVoiceSession>('VoiceSession', VoiceSessionSchema);

export default VoiceSession;
