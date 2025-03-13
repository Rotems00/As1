import postsModel, { IPost } from "../modules/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import mongoose from "mongoose";
import { generateImage } from "../controllers/api_controller";
import userModel from "../modules/auth_model";
import { decodeToken } from "../controllers/auth_controller";

class PostController extends BaseController<IPost> {
  constructor(model : mongoose.Model<IPost>) {

    //super(postsModel);
    super(model);
  }

  async createPost(req: Request, res: Response) {
    let imageUrl;
    if(req.body.imageUrl.trim() !== "" || req.body.imageUrl !== undefined){
       imageUrl = req.body.imageUrl;
       console.log(imageUrl);
       console.log(req.body);
    }
    try {
      if (req.body.imageUrl.trim() == "" || req.body.imageUrl == undefined) {
      imageUrl = await generateImage(req.body.title);
  
      if (!imageUrl) {
        res.status(500).send({ error: "Failed to generate image" });
        return;
      }}
      // Prepare the post data, including the generated image URL
      const post = {
        title: req.body.title,
        content: req.body.content,
        owner: req.body.owner,
        rank: req.body.rank,
        imageUrl: imageUrl,  // Add the image URL here
        
      };
      
      // Check if required fields are provided
      if (!post.owner || !post.content || !post.title) {
        res.status(400).send("Missing Data");
        return;
      }
  
      // Save the new post to the database
      const newPost = await postsModel.create(post);
      res.status(201).send(newPost); // Send the created post as the response
      return;
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).send({ error: "Internal Server Error" });
      return;
    }
  }

async deletePost(req: Request, res: Response) {
    const postID = req.params._id;
    try {
      const postToDelete = await postsModel.findByIdAndDelete(postID);
      if (!postToDelete) {
        res.status(404).send("Couldnt find post");
        return;
      } else {
        res.status(200).send(postToDelete);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }
  async unLike(req: Request, res: Response) {
    const postID = req.params._id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      res.status(401).send("Missing token");
      return;
    }
  
    try {
      const userId = decodeToken(token); // Decode the token to get the user ID
      console.log(userId);
      if (!userId) {
        res.status(403).send("Invalid Token");
        return;
      }
  
      // First, decrement the likes in the post
      const postToUpdate = await postsModel.findByIdAndUpdate(
        postID,
        { $inc: { likes: -1 } },  // Decrement the likes by 1
        { new: true }  // Return the updated post
      );
  
      // Then, remove the post ID from the user's likedPosts array
      await userModel.findByIdAndUpdate(
        userId,
        { $pull: { likedPosts: postID } },  // Remove the post ID from likedPosts
        { new: true }
      );
  
      if (!postToUpdate) {
        res.status(404).send("Couldn't find post");
        return;
      } else {
        res.status(200).send(postToUpdate);  // Send back the updated post
        return;
      }
    } catch (error) {
      res.status(400).send(error);  // Send error response if something goes wrong
      return;
    }
  }
  


  async addLike(req: Request, res: Response) {
    console.log("addLike"); 
    const postID = req.params._id;
    const authHeader = req.headers["authorization"];
    console.log(req.headers)
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).send("Missing 000  token");
      return;
    }
  
    try {
      const userId = decodeToken(token); // Decode the token to get the user ID
  
      if (!userId) {
        res.status(403).send("Invalid Token");
        return;
      }
      
      const postToUpdate = await postsModel.findByIdAndUpdate(
        postID,
        { $inc: { likes: 1 } },  // Increment the likes by 1
        { new: true }  // Return the updated post
      );
      await userModel.findByIdAndUpdate(userId,{ $push: { likedPosts: postID } },{ new: true }
      );
  
      if (!postToUpdate) {
        res.status(404).send("Couldn't find post");
        return;
      } else {
        res.status(200).send(postToUpdate);  // Send back the updated post
        return;
      }
    } catch (error) {
      res.status(400).send(error);  // Send error response if something goes wrong
      return;
    }
  }

  async updatePost(req: Request, res: Response) {
    const askerID = req.params._id;
    const newContent = req.body.content;
    try {
      const postToUpdate = await postsModel.findByIdAndUpdate(
        askerID,
        { content: newContent },
        { new: true }
      );
      if (!postToUpdate) {
        res.status(404).send("COULDNT FIND POST! DUE TO AN ERROR");
        return;
      } else {
        res.status(200).send(postToUpdate);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }

  async create(req: Request, res: Response) {
    const post = {
        title: req.body.title,
        content: req.body.content,
        owner: req.body.owner,
    };

    if (!post.owner || !post.content || !post.title) {
        res.status(400).send("Missing Data");
        return;
    }

    req.body = post;
    return super.create(req, res);
}


async  isLiked(req: Request, res: Response) {
  const postID = req.params._id;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if( !token){
    res.status(401).send("Missing token");
    return;
  }
  try {
    const userId = decodeToken(token);
    if (!userId) {
      res.status(403).send("Invalid Token");
      return;
    }
    const userProfile = await userModel.findById(userId);
    if (!userProfile) {
      res.status(404).send("User not found");
      return;
    }
    if (userProfile.likedPosts.includes(postID)) {
      res.status(200).send(true);
    }
    else {
      res.status(200).send(false);
    }
  }catch (error) {
    res.status(400).send(error);  
    return;}
  }
}
export default new PostController(postsModel);
