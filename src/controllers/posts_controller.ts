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
    console.log("Create Post - Received Request");
    console.log("Full Request Body:", req.body);

    try {
      // Destructure request body with defaults
      const { 
        title = '', 
        content = '', 
        owner = '', 
        rank = null, 
        imgUrl = '' 
      } = req.body;

      // Validate required fields
      const missingFields: string[] = [];
      if (!owner) missingFields.push('owner');
      if (!content) missingFields.push('content');
      if (!rank) missingFields.push('rank');

      if (missingFields.length > 0) {
        res.status(400).json({
          error: "Missing required fields",
          missingFields
        });
        return;
      }

      // Image URL handling
      let imageUrl = imgUrl;
      console.log('Image URL:', imageUrl);
      if (!imageUrl) {
        try {
          // Generate image if no URL provided
          imageUrl = await generateImage(title || 'Default Post');
        } catch (imageError) {
          console.error('Image generation error:', imageError);
          imageUrl = ''; // Fallback to empty string
        }
      }

      // Prepare post data
      const post = {
        title: title || 'Untitled Post',
        content: content,
        owner,
        rank,
        imageUrl
      };

      // Log the final post data before creation
      console.log('Creating Post:', post);

      // Save the new post to the database
      const newPost = await postsModel.create(post);
      
      console.log('Post Created Successfully:', newPost);
      res.status(201).json(newPost);
      return;

    } catch (error) {
      console.error('Detailed Error in Post Creation:', {
        error,
        errorName: error instanceof Error ? error.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : 'No error message',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }
    );
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
