const Comment = require("../controllers/comments_controller.js")
const express = require('express');
const router = express.Router();

router.post('/', Comment.createComment)
router.get('/:post_id',Comment.readAllCommentsOnSpecifiecPost)

module.exports = router;