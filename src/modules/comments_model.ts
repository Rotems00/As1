import mongoose from "mongoose";
export interface IComment {
  comment: string;
  postId: string;
  owner: string;
}

const comments_Schema = new mongoose.Schema<IComment>({
  comment: {
    type: String,
    required: true,
  },

  postId: {
    type: String,
    required: true,
  },
    owner: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true,
});

const commentsModel = mongoose.model<IComment>("Comments", comments_Schema);
export default commentsModel;
