import mongoose, { Schema } from 'mongoose';
import { Post } from '../utils/types/type';

const postSchema: Schema<Post> = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    uploadOnFacebook: {
      type: Boolean,
      default: false,
    },
    uploadOnInstagram: {
      type: Boolean,
      default: false,
    },
    fbPostId: {
      type: String,
    },
    igPostId: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
  },
  { timestamps: true }
);

export const postModel = mongoose.model<Post>('Post', postSchema);
