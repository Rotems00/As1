const Post = require("../controllers/posts_controller.js")
const express = require('express');
const router = express.Router();




router.post('/', Post.createPost)
router.get('/', Post.getAllPosts)
   


module.exports = router;