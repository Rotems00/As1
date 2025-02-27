import postsModel, { IPost } from "../modules/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import mongoose from "mongoose";


class PostController extends BaseController<IPost> {
  constructor(model : mongoose.Model<IPost>) {
    //super(postsModel);
    super(model);
  }

async createPost(req: Request, res: Response) {
    const post = {
      title: req.body.title,
      content: req.body.content,
      owner: req.body.owner,
      rank : req.body.rank,
      imageUrl : req.body.imageUrl,
    };
 

    if (!post.owner || !post.content || !post.title) {
      res.status(400).send("Missing Data");
      return;
    }
    try {
      const newPost = await postsModel.create(post);
      res.status(201).send(newPost);
    } catch (error) {
      res.status(400).send(error);
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
