import commentController from "../controllers/comments_controller";
import express , { Request , Response } from "express";
import {authMiddleware} from "../controllers/auth_controller";

const router = express.Router();

router.get("/", (req : Request, res : Response) => {
  if (!req.query.postId) {
    commentController.getAll(req, res);
  } else {
    commentController.readAllCommentsOnSpecifiecPost(req, res);
  }
});

router.get("/:_id", (req : Request, res : Response) => {
  commentController.getById(req, res);
});
router.post("/", authMiddleware, (req : Request, res : Response) => {
  commentController.create(req, res);
});
router.put("/:_id", authMiddleware ,commentController.updateComment.bind(commentController));
router.delete("/:_id", authMiddleware , (req : Request, res : Response) => {
  commentController.deleteComment(req, res);
});

export default router;
