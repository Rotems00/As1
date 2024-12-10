import commentsModel, { IComment } from "../modules/comments_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(commentsModel);
  }

  async readAllCommentsOnSpecifiecPost(req: Request, res: Response) {
    const postID = req.query.postId;
    console.log("GET ALL COMMENTS ON SPECIFIC POST METHOD");
    console.log(postID);
    try {
      const findAllComments = await commentsModel.find({ postId: postID });
      if (findAllComments.length === 0) {
        res
          .status(400)
          .send("COULD NOT FIND COMMENTS DUE TO AN ERROR IN MONGO");
        return;
      } else {
        res.status(200).send(findAllComments);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async updateComment(req: Request, res: Response) {
    const commentID = req.params._id;
    const newContent = req.body.comment;
    try {
      const commentToUpdate = await commentsModel.findByIdAndUpdate(
        commentID,
        { comment: newContent },
        { new: true }
      );
      if (!commentToUpdate) {
        res.status(404).send("COULD NOT UPDATE COMMENT DUE TO AN ERROR!");
        return;
      } else {
        res.status(200).send(commentToUpdate);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }

  async deleteComment(req: Request, res: Response) {
    const commentID = req.params._id;
    console.log("DELETE METHOD");
    console.log(commentID);

    try {
      const theComment = await commentsModel.findByIdAndDelete({
        _id: commentID,
      });
      if (!theComment) {
        res.status(404).send("COULD NOT DELETE THE COMMENT DUE TO AN ERROR!");
        return;
      } else {
        res.status(200).send(theComment);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }
}

export default new CommentController();
