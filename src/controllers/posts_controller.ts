import postsModel, { IPost } from "../modules/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import mongoose from "mongoose";
import { generateImage } from "../controllers/api_controller";


class PostController extends BaseController<IPost> {
  constructor(model : mongoose.Model<IPost>) {

    //super(postsModel);
    super(model);
  }

  async createPost(req: Request, res: Response) {
    try {
      // Generate the image URL by calling the generateImage function
      const imageUrl = await generateImage(req.body.title);
  
      if (!imageUrl) {
        res.status(500).send({ error: "Failed to generate image" });
        return;
      }
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
    try {
      const postToUpdate = await postsModel.findByIdAndUpdate(postID, { $inc: { likes: -1 } }, { new: true });
      if (!postToUpdate) {
        res.status(404).send("Couldnt find post");
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


  async addLike(req: Request, res: Response) {
    const postID = req.params._id;
    try {
      const postToUpdate = await postsModel.findByIdAndUpdate(postID, { $inc: { likes: 1 } }, { new: true });
      if (!postToUpdate) {
        res.status(404).send("Couldnt find post");
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

}

export default new PostController(postsModel);
