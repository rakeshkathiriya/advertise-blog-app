import mongoose, { Schema } from 'mongoose';
import { Client } from '../utils/types/type';

const ClientSchema: Schema<Client> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    poc: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    postLimit: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    expiredDate: {
      type: Date,
      default: () => {
        const date = new Date();
        return date;
      },
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

export const clientModel = mongoose.model<Client>('Client', ClientSchema);
