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

const readAllComments = async(req,res)=>
{
    try
    {
        const allCommentsOnDB = await commentsModel.find()
        if(!allCommentsOnDB)
        {
            return res.status(400).send("THERE ARE NO COMMENTS AT ALL")
        }
        console.log(allCommentsOnDB)
        return res.status(200).send("ALL COMMENTS :"+ allCommentsOnDB)



    }catch(error)
    {
        return res.status(400).send("ERROR")



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
               return res.status(400).send("THERES NO SUCH A COMMENT IN MY DB, WRONG COMMENT")
            }

            console.log("DELETED THE COMMENT")
            return res.status(200).send("COMMENT HAS BEEN DELETED BY YOUR REQUEST!, ID: "+ commentID + theComment.comment_content)


    }catch(error)
    {
        return res.status(400).send("ERROR")
    }
}
    

module.exports = {createComment,readAllCommentsOnSpecifiecPost,updateComment,deleteComment,readAllComments}