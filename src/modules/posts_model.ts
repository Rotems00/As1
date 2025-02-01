import mongoose from "mongoose";
export enum Rank {
  One = 1,
  Two,
  Three,
  Four,
  Five,
}

export interface IPost {
  owner: string;
  title: string;
  content: string;
  likes: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  rank?: Rank; // The rank will be a number from 1 to 5
}

const post_Schema = new mongoose.Schema<IPost>(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    imageUrl : {
      type: String,
      required: false,
    },
    rank: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const postsModel = mongoose.model<IPost>("Posts", post_Schema);
export default postsModel;
