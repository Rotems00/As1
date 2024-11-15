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

module.exports = {createPost,getAllPosts}




