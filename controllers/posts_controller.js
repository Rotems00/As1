const postsModel = require("../modules/posts_model.js")

const createPost = async (req, res) => {
    try {
        const newPost = await postsModel.create({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content
        })
        console.log("NEW POST CREATED")
        console.log(newPost)
        res.status(200).send(newPost)



    } catch (error) {
        res.status(400).send("NEW POST UNAVAILABLE")


    }

}

const getAllPosts = async (req, res) => {
    const authorFilter = req.query.author
    console.log(authorFilter)
    try {
        if(authorFilter){
            const authorPosts = await postsModel.find({author : authorFilter})
            if(authorPosts.length === 0){
                return res.status(209).send("this author has no posts")
            }
            else{
            console.log(authorPosts)
            return res.status(200).send(authorPosts)     }
        }
        else{
            const allPosts = await postsModel.find()
            if (allPosts.length === 0){ 
                return res.status(201).send("Database is empty")
            }
            else{
            console.log("Returning all posts")
            console.log(allPosts)
            return res.status(200).send(allPosts)
            }
    }

    } catch (error) {
        res.status(400).send("COULDNT GET ALL POST! DUE TO AN ERROR , THERES NO SUCH A POST!")
    }




}

const getPostByID = async (req, res) => {
    try {
        const askedID = req.params._id
        const singlePost = await postsModel.findById(askedID)
        console.log(singlePost)
        res.status(200).send(singlePost)



    } catch (error) {
        res.status(400).send("There is no such a post with that ID")
    }

}

const changeContentOfPost = async(req,res)=>{
const askerID = req.params._id
const newContent = req.body.content
try{
    const postToUpdate = await postsModel.findByIdAndUpdate(askerID,{content: newContent,new:true})
    console.log(postToUpdate)
    return res.status(200).send(postToUpdate) ;
}catch(error){
res.status(400).send("error while updating the post")
}









}








module.exports = {createPost,getAllPosts,changeContentOfPost,getPostByID}



