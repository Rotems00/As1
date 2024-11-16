const Post = require("../controllers/posts_controller.js")
const express = require('express');
const router = express.Router();




router.post('/', Post.createPost)
router.get('/', Post.getAllPosts)
router.get('/:_id', Post.getPostByID)
//router.get('/', Post.getPostsBySender)


module.exports = router;