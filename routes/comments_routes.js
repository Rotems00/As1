const Comment = require("../controllers/comments_controller.js")
const express = require('express');
const comments = require("../modules/comments_model.js");
const router = express.Router();

router.post('/', Comment.createComment)
router.get('/:post_id',Comment.readAllCommentsOnSpecifiecPost)
router.put('/:_id',Comment.updateComment)
router.delete('/:_id',Comment.deleteComment)



router.delete('/delete/:_id', Comment.deleteComment);


router.get('/',Comment.readComments)
router.get('/:post_id',Comment.readComments)
router.put('/:_id',Comment.updateComment)

module.exports = router;