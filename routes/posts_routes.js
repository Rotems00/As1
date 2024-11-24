const Post = require("../controllers/posts_controller.js")
const express = require('express');
const router = express.Router();




router.post('/', Post.createPost)
router.get('/', Post.getAllPosts)
router.get('/:_id', Post.getPostByID)
router.put('/:_id',Post.changeContentOfPost )
  


module.exports = router;