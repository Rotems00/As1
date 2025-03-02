import commentsModel, { IComment } from "../modules/comments_model";
import { Request, Response } from "express";
import { BaseController } from "./base_controller";

class CommentController extends BaseController<IComment> {
  constructor() {
    super(commentsModel);
  }

  async readAllCommentsOnSpecifiecPost(req: Request, res: Response) {
    const postID = req.params.postId;
    console.log("Method : Read All Comments on a specific post");
    console.log(postID);
    try {
      const findAllComments = await commentsModel.find({ postId: postID });
      if (findAllComments.length === 0) {
        res.status(400).send("There are not comments on this post");
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
    console.log("this id is should be deleted:" + commentID); 
    try {
      const theComment = await commentsModel.findByIdAndDelete({
        _id: commentID,
      });
      console.log(theComment);  
      if (!theComment) {
        res.status(404).send("Could not delete comment due to an error");
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
  /*
  async create(req: Request, res: Response) {
      const userId = req.query.userId;
      console.log("*******************"+req.body);
      const comment = {
        owner : userId,
        postId : req.body.postId,
        comment : req.body.comment
      }
      if(comment.owner === undefined || comment.postId === undefined || comment.comment === undefined){
        res.status(400).send("Missing Data");
        return;
      }
      req.body = comment
      return super.create(req, res);
    }
      */
}

export default new CommentController();
