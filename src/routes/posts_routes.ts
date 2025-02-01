import PostController from "../controllers/posts_controller";
import express, { Request, Response } from "express";
import { authMiddleware } from "../controllers/auth_controller";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: The Posts API for the Web Dev 2025 REST API
 */

router.post("/", authMiddleware, (req: Request, res: Response) => {
  PostController.create(req, res);
});
/**
 * @swagger
 * /Posts:
 *   post:
 *     summary: Create a new post
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Post Title"
 *               content:
 *                 type: string
 *                 example: "Post Content"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 title:
 *                   type: string
 *                   example: "Post Title"
 *                 content:
 *                   type: string
 *                   example: "Post Content"
 *                 owner:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *       400:
 *         description: Missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 */
router.get("/", PostController.getAll.bind(PostController));
/**
 * @swagger
 * /Posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter posts by owner ID
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   title:
 *                     type: string
 *                     example: "Post Title"
 *                   content:
 *                     type: string
 *                     example: "Post Content"
 *                   owner:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Bad Request"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

router.get("/:_id", (req: Request, res: Response) => {
  PostController.getById(req, res);
});
/**
 * @swagger
 * /posts/{_id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 title:
 *                   type: string
 *                   example: "Post Title"
 *                 content:
 *                   type: string
 *                   example: "Post Content"
 *                 owner:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "COULDNT FIND DUE TO AN ERROR"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Bad Request"
 */
router.put(
  "/:_id",
  authMiddleware,
  PostController.updatePost.bind(PostController)
);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated Post Content"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 title:
 *                   type: string
 *                   example: "Updated Post Title"
 *                 content:
 *                   type: string
 *                   example: "Updated Post Content"
 *                 owner:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Bad Request"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "COULDNT FIND POST! DUE TO AN ERROR"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

router.post("/create", (req, res) => PostController.createPost(req, res));
router.delete("/delete/:_id", (req, res) => PostController.deletePost(req, res));
router.put("/like/:_id", (req, res) => PostController.addLike(req, res));
router.put("/unlike/:_id", (req, res) => PostController.unLike(req, res));
router.put("/update/:_id", (req, res) => PostController.updatePost(req, res));
export default router;
