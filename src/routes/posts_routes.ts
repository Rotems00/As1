import PostController from "../controllers/posts_controller";
import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  PostController.create(req, res);
});
router.get("/", PostController.getAll.bind(PostController));
router.get("/:_id", (req, res) => {
  PostController.getById(req, res);
});
router.put("/:_id", PostController.updatePost.bind(PostController));

export default router;
