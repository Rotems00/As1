const { post } = require("../app.js")
const postsModel = require("../modules/posts_model.js")

const createPost = async(req,res)=>{
    try{
        const newPost = await postsModel.create({
            author : req.body.author,
            title:req.body.title,
            content : req.body.content
        })
        console.log(newPost)
       res.status(201).send(" NEW POST CREATED")




    }catch(error)
    {
       res.status(400).send("NEW POST UNAVAILABLE")


    }

}

const getAllPosts = async(req,res)=>{
    try{
        const allPosts = await postsModel.find()
        console.log(allPosts)
        res.status(201).send(" PLEASED TO GET YOU ALL POSTS")



    }catch(error)
    {
        res.status(400).send("COULDNT GET ALL POST! DUE TO AN ERROR")
    }




}

const changeContentOfPost = async(req,res)=>{
    try{
        const askerID = req.params._id;
        const newContent = req.body.content;
        const updatedPost = await postsModel.findByIdAndUpdate(
            askerID,
            {content:newContent},
            {new:true}
        )
        if(!updatedPost)
        {
          res.status(400).send("YOU FORGOT TO UPLOAD A NEW CONTENT")
        }
        res.status(200).send(updatedPost)
        
        

    }catch(error)
    {
        res.status(400).send("COULDNT CHANGE CONTENT! DUE TO AN ERROR")
    }
}

module.exports = {createPost,getAllPosts,changeContentOfPost}



