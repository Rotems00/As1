import { Request, Response, NextFunction } from "express";
import userModel from "../modules/auth_model";
import postModel from "../modules/posts_model";
import commentsModel from "../modules/comments_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { get } from "http";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Replace with your actual Google Client ID


const googleConnection = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ error: 'Invalid token' });
      return
    }

    const { email } = payload;

    let user = await userModel.findOne({ email });
    
    if (!user) {
      const username = email?.split('@')[0];
    
      user = new userModel({
        username,  // שם המשתמש יהיה האימייל ללא ה-@
        email,
      });
    }
    const tokens = generateTokens(user._id.toString());
    if (!tokens) {
      res.status(500).json({ error: 'Failed to generate tokens' });
      return;
    }
    const { accessToken, refreshToken } = tokens;
    // Generate JWT token
    user.refreshTokens.push(refreshToken);
    await user.save();
    res.status(200).send({
      email: user.email,
      username: user.username,
      _id: user._id,
      imagePath : user.imagePath,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return;

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
    return ;
  }
};


const register = async (req: Request, res: Response) => {
  const { username, email, password  } = req.body;
  const imgUrl = req.body.imgUrl || " ";
  if (
    !email ||
    !password ||
    email.trim().length == 0 ||
    password.trim().length == 0
  ) {
    res.status(400).send("Email and Password are required");
    return;
  }
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.status(400).send("User already exists");
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      imagePath : imgUrl,
    });
    res.status(201).send(newUser);
    return;
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

const generateTokens = (_id: string): { accessToken: string; refreshToken: string } | null => {
  const rand = Math.floor(Math.random() * 10000000);
  const rand2 = Math.floor(Math.random() * 10000000);
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  const accessToken = jwt.sign(
    { _id: _id, rand2: rand2 },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { _id: _id, rand: rand },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  if (
    !usernameOrEmail ||
    !password ||
    usernameOrEmail.trim().length === 0 ||
    password.trim().length === 0
  ) {
    res.status(400).send("Email and Password are required");
    return;
  }
  try {
    const user = await userModel.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
    if (!user) {

      res.status(400).send("invalid email/username or password");
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send("invalid email/username or password");
      return;
    }
    const tokens = generateTokens(user._id.toString());
    if (!tokens) {
      res.status(500).send("Cannot Generate Tokens");
      return;
    }
    if (user.refreshTokens == null) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    console.log("Login Valid");
    res.status(200).send({
      email: user.email,
      _id: user._id,
      imagePath : user.imagePath,
      username: user.username,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,

    });
    return;
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

type TokenPayload = {
  _id: string;
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("Missing Refresh Token");
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Missing Token Secret");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any , data: any) => {
      if (err) {
        res.status(403).send("Invalid Refresh Token");
        return;
      }
      const payload = data as TokenPayload;
      try {
        const user = await userModel.findById(payload._id);
        if (!user) {
          res.status(404).send("Invalid Refresh Token11");
          return;
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(403).send("User do not have this refresh token");
          return;
        }
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        await user.save();
        res.status(200).send("Logged out");
        return;
      } catch (err) {
        console.log(err);
        res.status(400).send("invalid token");
        return;
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  //validity of the refresh token
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("Missing Refresh Token");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Missing Token Secret");
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("Invalid Refresh Token");
        return;
      }

      //find the user

      const payload = data as TokenPayload;
      try {
        const user = await userModel.findById(payload._id);
        if (!user) {
          res.status(404).send("Invalid Refresh Token");
          return;
        }
        //check if the refresh token is in the user's refresh token list

        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("Invalid Refresh Token");
          return;
        }
        //generate a new access token

        const newTokens = generateTokens(user._id.toString());
        if (!newTokens) {
          user.refreshTokens = [];
          await user.save();
          res.status(500).send("Missing Token Secret");
          return;
        }
        //delete the old refresh token
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        //save the new refresh token
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();
        //send the new access token and refresh token to the user
        res.status(200).send({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });
      } catch (err) {
        console.log(err);
        res.status(400).send("invalid token");
      }
    }
  );
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Missing Token Secret");
    return;
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(403).send("Invalid Token");
        return;
      }
      const payload = data as TokenPayload;
      req.query.userId = payload._id;

      next();
    });
  }
};
const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;  
  if (!username) {
    res.status(400).send("Missing Data");
    return;
  }
  try {
    const user = await userModel.findOne( { username: username });
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    } else {
      res.status(200).send(user);
      return;
    }
  } catch {
    res.status(400).send("problem find user request");
  }
}
const changePassword = async (req: Request, res: Response) => {
  const { username , oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).send("Missing Data");
    return;
  }
  try {
    
    const user = await userModel.findOne({username : username});
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    }
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      res.status(400).send("invalid password");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send("Password Changed");
    return;
  } catch { 
    res.status(400).send("problem change password request");
  }
}
const deleteAccount = async (req: Request, res: Response) => {
  const username  = req.query.username;
  console.log(username);
  if (!username) {
    res.status(400).send("Missing Data");
    return;
  }
  try {
    const user = await userModel
      .findOneAndDelete({ username: username });
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    }
    
    const userPosts = await postModel.deleteMany({ owner: username });
    
    const userComments = await commentsModel.deleteMany({ owner: username });
    if (!userPosts) {
      res.status(404).send("Couldnt find user posts");
      return;
    }
    if (!userComments) {
      res.status(404).send("Couldnt find user comments");
      return;
    }
  } catch {
    res.status(400).send("problem delete account request");
    return;
  }
  res.status(200).send("Account Deleted");
  return; 
}


const updateUser = async (req: Request, res: Response) => {
  const { oldUsername , newUsername } = req.body;
  if (!oldUsername || !newUsername) {
    res.status(400).send("Missing Data");
    return;
  }
  try {
    const user = await userModel.findOne({ username:oldUsername });
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    }
    user.username = newUsername;
    await user.save();
    const userPosts = await postModel.updateMany({ owner: oldUsername }, { owner: newUsername });
    const userComments = await commentsModel.updateMany({ owner: oldUsername }, { owner: newUsername });
    if (!userPosts || !userComments) {
      res.status(404).send("Couldnt find user posts or comments");
      return;
    }
  } catch {
    res.status(400).send("problem update user request");
    return;
  }
  res.status(200).send("User Updated");
  return;
}
const saveImg = async (req: Request, res: Response) => {

  const username = req.body.username;
  const file = req.body.file;
  if (!username || !file) {
    res.status(400).send("Missing Data");
    return;
  }
  
  try {

    const user = await userModel.findOne({ username: username });
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    }
    user.imagePath = file;
    await user.save();
    res.status(200).send(file);
    return;
  } catch {
    res.status(400).send("problem save img request");
    return;
  }
}

const getImg = async (req: Request, res: Response) => {
  const username = req.query.username;
  console.log(username);
  if (!username) {
    res.status(400).send("Missing Data");
    return;
  }
  try {
    const user = await userModel.findOne({ username:
      username });
    if (!user) {
      res.status(404).send("Couldnt find user");
      return;
    }
    console.log(user.imagePath);
    res.status(200).send(user.imagePath);
    return;
  } catch {
    res.status(400).send("problem get img request");
    return;
  }
}

export const decodeToken = (token: string): string | null => {
  try {
    if (!process.env.TOKEN_SECRET) {
      throw new Error("Missing Token Secret");
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as TokenPayload;
    return decoded._id;  // Return the user ID from the token payload
  } catch (error) {
    return null; // If there's an error, return null
  }
};
export default { register, login, logout, refresh , googleConnection, getUser,changePassword , deleteAccount, updateUser,saveImg , getImg};
