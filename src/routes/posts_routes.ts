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
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - content
 *         - owner
 *         - rank
 *       properties:
 *         title:
 *           type: string
 *           description: The post title (defaults to 'Untitled Post' if not provided)
 *         content:
 *           type: string
 *           description: The post content
 *         owner:
 *           type: string
 *           description: The username of the post owner
 *         rank:
 *           type: number
 *           description: The rank of the post
 *         imageUrl:
 *           type: string
 *           description: URL to the post image
 *         likes:
 *           type: number
 *           description: Number of likes on the post
 *           default: 0
 *       example:
 *         title: "My First Post"
 *         content: "This is the content of my post"
 *         owner: "johndoe"
 *         rank: 1
 *         imageUrl: "https://example.com/image.jpg"
 *         likes: 0
 */

router.post("/", authMiddleware, (req: Request, res: Response) => {
  PostController.createPost(req, res);
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
 *             required:
 *               - content
 *               - owner
 *               - rank
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Post"
 *                 description: Optional title (defaults to 'Untitled Post')
 *               content:
 *                 type: string
 *                 example: "This is the content of my post"
 *               owner:
 *                 type: string
 *                 example: "johndoe"
 *                 description: Username of post owner
 *               rank:
 *                 type: number
 *                 example: 1
 *                 description: Rank of the post
 *               imgUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *                 description: Optional image URL (will be generated if not provided)
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of my post"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 rank:
 *                   type: number
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 likes:
 *                   type: number
 *                   example: 0
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["owner", "content", "rank"]
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 details:
 *                   type: string
 *                   example: "Error details"
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
 *         description: Filter posts by owner username
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
 *                     example: "My First Post"
 *                   content:
 *                     type: string
 *                     example: "This is the content of my post"
 *                   owner:
 *                     type: string
 *                     example: "johndoe"
 *                   rank:
 *                     type: number
 *                     example: 1
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *                   likes:
 *                     type: number
 *                     example: 5
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

router.get("/:_id", (req: Request, res: Response) => {PostController.getById(req, res)});
/**
 * @swagger
 * /Posts/{_id}:
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of my post"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 rank:
 *                   type: number
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 likes:
 *                   type: number
 *                   example: 5
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

router.put( "/:_id",authMiddleware,PostController.updatePost.bind(PostController));
/**
 * @swagger
 * /Posts/{_id}:
 *   put:
 *     summary: Update a post content
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content"
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "Updated post content"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 rank:
 *                   type: number
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 likes:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Bad Request"
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       404: 
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "COULDNT FIND POST! DUE TO AN ERROR"
 */

router.post("/create", authMiddleware, (req, res) => PostController.createPost(req, res));
/**
 * @swagger
 * /Posts/create:
 *   post:
 *     summary: Create a new post (alternative route)
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - owner
 *               - rank
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Post"
 *                 description: Optional title (defaults to 'Untitled Post')
 *               content:
 *                 type: string
 *                 example: "This is the content of my post"
 *               owner:
 *                 type: string
 *                 example: "johndoe"
 *                 description: Username of post owner
 *               rank:
 *                 type: number
 *                 example: 1
 *                 description: Rank of the post
 *               imgUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *                 description: Optional image URL (will be generated if not provided)
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of my post"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 rank:
 *                   type: number
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 likes:
 *                   type: number
 *                   example: 0
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["owner", "content", "rank"]
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 details:
 *                   type: string
 *                   example: "Error details"
 */

router.delete("/delete/:_id", authMiddleware, (req, res) => PostController.deletePost(req, res));
/**
 * @swagger
 * /Posts/delete/{_id}:
 *   delete:
 *     summary: Delete a post by ID
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid post ID format"
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Couldnt find post"
 */

router.put("/like/:_id", authMiddleware, (req, res) => PostController.addLike(req, res));
/**
 * @swagger
 * /Posts/like/{_id}:
 *   put:
 *     summary: Like a post
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to like
 *     responses:
 *       200:
 *         description: Post liked successfully
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of my post"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 likes:
 *                   type: number
 *                   example: 6
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User already liked this post"
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       404:
 *         description: Post or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Couldn't find post"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Database error while updating post"
 */

router.put("/unlike/:_id", authMiddleware, (req, res) => PostController.unLike(req, res));
/**
 * @swagger
 * /Posts/unlike/{_id}:
 *   put:
 *     summary: Unlike a post
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
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
 *                   example: "My First Post"
 *                 content:
 *                   type: string
 *                   example: "This is the content of my post"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 likes:
 *                   type: number
 *                   example: 5
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User has not liked this post"
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       404:
 *         description: Post or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Couldn't find post"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Database error while updating post"
 */

router.get("/isLiked/:_id", authMiddleware, (req, res) => PostController.isLiked(req, res));
/**
 * @swagger
 * /Posts/isLiked/{_id}:
 *   get:
 *     summary: Check if a post is liked by the current user
 *     security:
 *      - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to check
 *     responses:
 *       200:
 *         description: Liked status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid post ID format"
 *       401:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing token"
 *       403:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not found"
 */

export default router;

