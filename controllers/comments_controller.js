const commentsModel = require("../modules/comments_model.js")

const createComment = async (req,res)=>{

try{
const comment = await commentsModel.create({


    comment_user:req.body.comment_user,
    title:req.body.title,
    comment_content : req.body.comment_content,
    post_id: req.body.post_id

})
console.log(comment)
res.status(200).send("COMMENT CREATED BY :" + req.body.comment_user)

    



}catch(error)
{
    res.status(400).send("COMMENT COULD NOT BE CREATED BY :" +req.body.comment_user )

}



}


const readAllCommentsOnSpecifiecPost = async (req,res)=>{


    try{
        const postID = req.params.post_id;

        const findAllComments = await commentsModel.find({post_id:postID})
        if(!findAllComments)
        {
            res.status(400).send("CANT FIND THAT COMMENT")
        }
       console.log(findAllComments)
        res.status(200).json(findAllComments)








    }catch(error)
    {
        res.status(400).send("COUDLNT GET COMMENTS DUE TO AN ERROR")
    }
}

const updateComment = async(req,res)=>{
    const commentID = req.params._id
    const newContent = req.body.comment_content
    try{
        const commentToUpdate = await commentsModel.findByIdAndUpdate(commentID,{comment_content: newContent,new:true})
        if(!commentToUpdate)
        {
           return res.status(400).send("COULD NOT UPDATE COMMENT DUE TO AN ERROR IN MONGO, COULDNT FIND THE COMMENT!")
        }
        console.log(newContent)
        return res.status(200).send("CHANGED COMMENT!")
    
    
    
    
    }catch(error){
    res.status(400).send("COULD NOT UPDATE COMMENT DUE TO AN ERROR!, ARE YOU SURE U INPUTED THE CORRECT ID ?")
    
    
    }

}
    

module.exports = {createComment,readAllCommentsOnSpecifiecPost,updateComment}