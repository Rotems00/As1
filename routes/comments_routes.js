const Comment = require("../controllers/comments_controller.js")
const express = require('express');
const comments = require("../modules/comments_model.js");
const router = express.Router();
router.get('/',async (req,res)=>{
    if(req.query.post_id)
    {
        return Comment.readAllCommentsOnSpecifiecPost(req,res)
    }
    else
    {
        return Comment.readAllComments(req,res)
    }
   
})
router.post('/', Comment.createComment)

router.put('/:_id',Comment.updateComment)
router.delete('/:_id',Comment.deleteComment)



module.exports = router;