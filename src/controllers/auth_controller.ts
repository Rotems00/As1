import { Request, Response, NextFunction } from "express";
import userModel from "../modules/auth_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

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
      email: email,
      password: hashedPassword,
    });
    res.status(201).send(newUser);
    return;
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

const generateTokens = (
  _id: string
): { accessToken: string; refreshToken: string } | null => {
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
  const email = req.body.email;
  const password = req.body.password;
  if (
    !email ||
    !password ||
    email.trim().length === 0 ||
    password.trim().length === 0
  ) {
    res.status(400).send("Email and Password are required");
    return;
  }
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(400).send("Check your email or password");
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send("Check your email or password");
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
  const id = req.query.userId;
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

export default { register, login, logout, refresh };
