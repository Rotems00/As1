import postsModel, { IPost } from "../modules/posts_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";


class PostController extends BaseController<IPost> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(model : any) {
    //super(postsModel);
    super(model);
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
    const userId = req.query.userId;
    if (!userId) {
        res.status(403).send("Unauthorized");
        return;
    }

    const post = {
        title: req.body.title,
        content: req.body.content,
        owner: userId
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
