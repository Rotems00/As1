const postsModel = require("../modules/posts_model.js")

const createPost = async (req, res) => {
    try {
        const newPost = await postsModel.create({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content
        })
        console.log(newPost)
        res.status(201).send(" NEW POST CREATED")




    } catch (error) {
        res.status(400).send("NEW POST UNAVAILABLE")


    }

}

const getAllPosts = async (req, res) => {
    const authorFilter = req.query
    console.log(authorFilter)
    try {
        if(authorFilter){
            const authorPosts = await postsModel.find({author : authorFilter.author})
            console.log(authorPosts)
            return res.send(authorPosts)
        }
        else{
            const allPosts = await postsModel.find()
            console.log(allPosts)
            return res.status(201).send(allPosts)
        }

    } catch (error) {
        res.status(400).send("COULDNT GET ALL POST! DUE TO AN ERROR")
    }




}

const getPostByID = async (req, res) => {
    try {
        const askedID = req.params._id
        const singlePost = await postsModel.findById(askedID)
        console.log(singlePost)
        res.status(201).send(" Happy TO GET Specific ALL POSTS")



    } catch (error) {
        res.status(400).send("COULDNT GET ALL POST! DUE TO AN ERROR")
    }

}


module.exports = {
    createPost, getAllPosts, getPostByID
}




