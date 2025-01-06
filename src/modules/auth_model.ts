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
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
