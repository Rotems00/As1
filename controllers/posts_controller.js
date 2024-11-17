const postsModel = require("../modules/posts_model.js")

const createPost = async (req, res) => {
    try {
        const newPost = await postsModel.create({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content
        })
        console.log("NEW POST CREATED")
        console.log(req.body)
        res.status(201).send(" NEW POST CREATED : author : " + newPost.author )



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
            console.log(authorPosts)
            return res.status(200).send(authorPosts)
        }
        else{
            const allPosts = await postsModel.find()
            console.log("CATCH ME ")
            console.log(allPosts)
            return res.status(201).send(allPosts)
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
        res.status(201).send("Specific POST by " +  singlePost.author)



    } catch (error) {
        res.status(400).send("COULDNT GET ALL POST! DUE TO AN ERROR")
    }

}

const changeContentOfPost = async(req,res)=>{
const askerID = req.params._id
const newContent = req.body.content
try{
    const postToUpdate = await postsModel.findByIdAndUpdate(askerID,{content: newContent,new:true})
    if(!postToUpdate)
    {
       return res.status(400).send("COULD NOT UPDATE POST DUE TO AN ERROR IN MONGO, COULDNT FIND THE POST!")
    }
    console.log(postToUpdate)
    return res.status(200).send("CHANGED POST!")




}catch(error){
res.status(400).send("COULD NOT UPDATE POST DUE TO AN ERROR!")


}









}








module.exports = {createPost,getAllPosts,changeContentOfPost,getPostByID}



