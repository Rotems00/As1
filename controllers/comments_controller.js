const commentsModel = require("../modules/comments_model.js")

const createComment = async (req,res)=>{

try{
const comment = await commentsModel.create({


    comment_user:req.body.comment_user,
    title:req.body.title,
    comment_content : req.body.comment_content,
    post_id: req.body.post_id

})
res.status(200).send("COMMENT CREATED BY :" + req.body.comment_user)
    



}catch(error)
{
    res.status(400).send("COMMENT COULD NOT BE CREATED BY :" +req.body.comment_user )

}



}


module.exports = {createComment}