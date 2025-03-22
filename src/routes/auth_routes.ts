import authController, { authMiddleware } from "../controllers/auth_controller";
import express from "express";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: The Authentication API for the Web Dev 2025 REST API
 */
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user password
 *         imagePath:
 *           type: string
 *           description: URL to the user's profile image
 *       example:
 *         email: "user@example.com"
 *         username: "username123"
 *         password: "password123"
 *         imagePath: "https://example.com/image.jpg"
 */

router.post("/register", authController.register);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password123"
 *               imgUrl:
 *                 type: string
 *                 description: The user's profile image URL
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: The new user has been created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's unique ID
 *                   example: "60d0fe4f5311236168a109ca"
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                   example: "john@example.com"
 *                 imagePath:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Email and Password are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */

router.post("/login", authController.login);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usernameOrEmail
 *               - password
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 description: Username or email address
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 imagePath:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid email/username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Check email/username or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Cannot Generate Tokens"
 */

router.post("/logout", authController.logout);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Logged out"
 *       400:
 *         description: Missing refresh token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Refresh Token"
 *       403:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Refresh Token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Refresh Token11"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Token Secret"
 */

router.post("/refresh", authController.refresh);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: New tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Refresh Token"
 *       403:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Refresh Token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Refresh Token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Token Secret"
 */

router.post('/google-signin', authController.googleConnection);
/**
 * @swagger
 * /auth/google-signin:
 *   post:
 *     summary: Authenticate user with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUyZT..."
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 email:
 *                   type: string
 *                   example: "user@gmail.com"
 *                 username:
 *                   type: string
 *                   example: "user"
 *                 imagePath:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Failed to authenticate with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to authenticate with Google"
 */

router.get('/myuser/:username', authMiddleware, authController.getUser);
/**
 * @swagger
 * /auth/myuser/{username}:
 *   get:
 *     summary: Get user information by username
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 username:
 *                   type: string
 *                   example: "username"
 *                 imagePath:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *       400:
 *         description: Missing data or problem finding user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

router.put('/myuser/changePassword', authMiddleware, authController.changePassword);
/**
 * @swagger
 * /auth/myuser/changePassword:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: "johndoe"
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Password Changed"
 *       400:
 *         description: Missing data or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

router.delete('/myuser/deleteAccount', authMiddleware, authController.deleteAccount);
/**
 * @swagger
 * /auth/myuser/deleteAccount:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the account to delete
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Account Deleted"
 *       400:
 *         description: Missing data or problem with delete request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

router.put('/myuser/updateAccount', authMiddleware, authController.updateUser);
/**
 * @swagger
 * /auth/myuser/updateAccount:
 *   put:
 *     summary: Update username
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldUsername
 *               - newUsername
 *             properties:
 *               oldUsername:
 *                 type: string
 *                 description: Current username
 *                 example: "oldjohndoe"
 *               newUsername:
 *                 type: string
 *                 description: New username
 *                 example: "newjohndoe"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User Updated"
 *       400:
 *         description: Missing data or problem with update request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

router.post('/myuser/saveImg', authMiddleware, authController.saveImg);
/**
 * @swagger
 * /auth/myuser/saveImg:
 *   post:
 *     summary: Save user profile image
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - file
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: "johndoe"
 *               file:
 *                 type: string
 *                 description: Image URL or base64 encoded image
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Image saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "https://example.com/image.jpg"
 *       400:
 *         description: Missing data or problem with save request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

router.get('/getImg', authMiddleware, authController.getImg);
/**
 * @swagger
 * /auth/getImg:
 *   get:
 *     summary: Get user profile image
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: User image path retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "https://example.com/image.jpg"
 *       400:
 *         description: Missing data or problem with get request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing Data"
 *       401:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "missing token"
 *       403:
 *         description: Invalid authentication token
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
 *               example: "Couldnt find user"
 */

export default router;