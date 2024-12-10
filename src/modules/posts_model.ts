import mongoose from "mongoose";

export interface IPost {
  owner: string;
  title: string;
  content: string;
}

const post_Schema = new mongoose.Schema<IPost>({
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
});

const postsModel = mongoose.model<IPost>("Posts", post_Schema);
export default postsModel;
