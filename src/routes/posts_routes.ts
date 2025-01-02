import PostController from "../controllers/posts_controller";
import express , { Request , Response ,  } from "express";
import {authMiddleware} from "../controllers/auth_controller";
const router = express.Router();

router.post("/", authMiddleware ,(req : Request, res : Response ) => {
  PostController.create(req, res);
});
router.get("/", PostController.getAll.bind(PostController));
router.get("/:_id", (req : Request, res : Response) => {
  PostController.getById(req, res);
});
router.put("/:_id", PostController.updatePost.bind(PostController));

export default router;
