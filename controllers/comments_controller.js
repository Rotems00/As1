const commentsModel = require("../modules/comments_model.js")

const createComment = async (req,res)=>{
try{
const comment = await commentsModel.create({
    comment_user:req.body.comment_user,
    title:req.body.title,
    comment_content : req.body.comment_content,
    post_id: req.body.post_id

})
res.status(200).send(comment)
}catch(error)
{
    res.status(400).send("Unvalid comment")
}
}


const readAllCommentsOnSpecifiecPost = async (req,res)=>{
    try{
        const postID = req.params.post_id;
        
        const findAllComments = await commentsModel.find({post_id:postID})
        if(findAllComments.length === 0)
        {
            res.status(400).send("cant find any comments on this postId")
        }
        else{
       console.log(findAllComments)
        res.status(200).json(findAllComments)
        }   
    }catch(error)
    {
        res.status(400).send("COUDLNT GET COMMENTS DUE TO AN ERROR")
    }
}
const mongoose = require("mongoose");

const updateComment = async (req, res) => {
    const commentID = req.params._id;
    const newContent = req.body.comment_content;
    if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).send("Invalid ID format.");}
    try {
        const commentToUpdate = await commentsModel.findByIdAndUpdate(
            commentID,
            { comment_content: newContent },
            { new: true } // Ensure the updated document is returned
        );

        if (!commentToUpdate) {
            return res.status(400).send("COULD NOT UPDATE COMMENT DUE TO AN ERROR IN MONGO, COULDNT FIND THE COMMENT!");
        }

        //console.log(newContent);
        return res.status(200).send(commentToUpdate);

    } catch (error) {
        console.error(error);
    }
};


const readAllComments = async(req,res)=>
{
    try
    {
        const allCommentsOnDB = await commentsModel.find()
        if(allCommentsOnDB.length === 0)
        {
            return res.status(401).send("Comments DB is empty")
        }   
        else{   
            console.log("Returning all comments")
            return res.status(200).send(allCommentsOnDB)
        }
    }catch(error)
    {
        return res.status(400).send("Error while getting all comments")

    }

}


const deleteComment = async(req,res)=>
{
    const commentID = req.params._id;

    try
    {
        const theComment = await commentsModel.findByIdAndDelete({_id:commentID})
        if(!theComment)
            {
               return res.status(400).send("There is no such a comment with that ID")
            }

            console.log("Comment has been deleted")
            return res.status(200).send(theComment)


    }catch(error)
    {
        return res.status(400).send("ERROR")
    }
}
    

module.exports = {createComment,readAllCommentsOnSpecifiecPost,updateComment,deleteComment,readAllComments}