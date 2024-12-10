import commentController from "../controllers/comments_controller";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.query.postId) {
    commentController.getAll(req, res);
  } else {
    commentController.readAllCommentsOnSpecifiecPost(req, res);
  }
});

router.get("/:_id", (req, res) => {
  commentController.getById(req, res);
});
router.post("/", (req, res) => {
  commentController.create(req, res);
});
router.put("/:_id", commentController.updateComment.bind(commentController));
router.delete("/:_id", (req, res) => {
  commentController.deleteComment(req, res);
});

export default router;
