import mongoose from "mongoose";

/*
export interface IUser {
  email: string;
  password: string;
}
*/
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: false,
    unique: false,
  },  
  password: {
    type: String,
    default: "",
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
  imagePath: {
    type: String,
    required: false,
    default: "",
  },
  likedPosts: {
    type: [String],
    default: [],
  },
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
