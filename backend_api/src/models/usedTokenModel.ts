import mongoose, { Document, Model, Schema } from 'mongoose';

// 1️⃣ Interface for TypeScript type safety
export interface IUsedToken extends Document {
  token: string;
  createdAt: Date;
}

// 2️⃣ Schema definition
const usedTokenSchema = new Schema<IUsedToken>({
  token: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

// 3️⃣ Model with proper TS typing
export const UsedToken: Model<IUsedToken> =
  mongoose.models.UsedToken || mongoose.model<IUsedToken>('UsedToken', usedTokenSchema);
