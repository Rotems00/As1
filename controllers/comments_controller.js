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
const deleteComment = async (req, res) => {
    try {
      const  id = req.params; // Extract the ID from the URL
      const deletedComment = await commentsModel.findByIdAndDelete({id}); // Delete the object by ID
  
      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.status(200).json({ message: 'Comment deleted successfully', deletedComment });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
}
        
const readComments = async (req, res) => {

    const postFilter = req.query.post_id
    console.log(postFilter)
    try {
        if(postFilter){
            const postComments = await commentsModel.find({ post_id : postFilter})
            if (postComments.length === 0) {
                console.log('there are no comments for this post')
            return res.status(200).send('no comments found')
            } 
            console.log('specific post:'+ postComments)
            return res.status(200).send(postComments)
        }
        else{
            const allcomments = await commentsModel.find()
            console.log("All comments: ")
            console.log(allcomments)
            return res.status(201).send(allcomments)
        }

    } catch (error) {
        res.status(400).send("Couldnt print all comments")
    }

}    
        
const updateComment = async (req, res) => {

    const comment_id = req.params._id
    const newContent = req.body.content


    try {
        const commentToUpdate = await commentsModel.findByIdAndUpdate(
            comment_id,
            { comment_content: newContent }, // Set new content
            { new: true } // Return the updated document
        );       
            if (commentToUpdate.length === 0) {
                console.log('there are no comments exist for the comment_id')
            return res.status(200).send('here are no comments exist for the comment_id')
            } 
            console.log('updated comment:'+ commentToUpdate)
            return res.status(200).send(commentToUpdate)
        }
     
           
    
    catch (error) {
        res.status(400).send("problem updating post")
    }

}    

       
module.exports = {createComment,deleteComment,readComments,updateComment}

