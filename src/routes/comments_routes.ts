import commentController from "../controllers/comments_controller";
import express, { Request, Response } from "express";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: The Comments API for the Web Dev 2025 REST API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - postId
 *         - owner
 *       properties:
 *         comment:
 *           type: string
 *           description: The comment content
 *         postId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         owner:
 *           type: string
 *           description: The username of the comment owner
 *       example:
 *         comment: "This is a comment"
 *         postId: "60d0fe4f5311236168a109ca"
 *         owner: "johndoe"
 */

router.get("/", (req: Request, res: Response) => {
  if (!req.query.post_id) {
    commentController.getAll(req, res);
  } else {
    commentController.readAllCommentsOnSpecifiecPost(req, res);
  }
});
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments or comments on a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: The ID of the post to filter comments by
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: The username of the owner to filter comments by
 *     responses:
 *       200:
 *         description: A list of comments
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
 *                   postId:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   comment:
 *                     type: string
 *                     example: "This is a comment"
 *                   owner:
 *                     type: string
 *                     example: "johndoe"
 *       400:
 *         description: Bad request or no comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "There are not comments on this post"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

router.get("/:_id", (req: Request, res: Response) => {
  commentController.getById(req, res);
});
/**
 * @swagger
 * /comments/{_id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: A comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 postId:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 comment:
 *                   type: string
 *                   example: "This is a comment"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Bad Request"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Comment not found"
 */

router.post("/", authMiddleware, (req: Request, res: Response) => {
  commentController.create(req, res);
});

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - comment
 *               - postId
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Username of the comment owner
 *                 example: "johndoe"
 *               comment:
 *                 type: string
 *                 description: The comment content
 *                 example: "This is a comment"
 *               postId:
 *                 type: string
 *                 description: ID of the post being commented on
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
 *                 comment:
 *                   type: string
 *                   example: "This is a comment"
 *                 postId:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

router.put(
  "/:_id",
  authMiddleware,
  commentController.updateComment.bind(commentController)
);
/**
 * @swagger
 * /comments/{_id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The updated comment content
 *                 example: "This is an updated comment"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 comment:
 *                   type: string
 *                   example: "This is an updated comment"
 *                 postId:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 owner:
 *                   type: string
 *                   example: "johndoe"
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "COULD NOT UPDATE COMMENT DUE TO AN ERROR!"
 */

router.delete("/:_id", authMiddleware, (req: Request, res: Response) => {
  commentController.deleteComment(req, res);
});
/**
 * @swagger
 * /comments/{_id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Could not delete comment due to an error"
 */

export default router;
