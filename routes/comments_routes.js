const Comment = require("../controllers/comments_controller.js")
const express = require('express');
const router = express.Router();

router.post('/', Comment.createComment)

module.exports = router;