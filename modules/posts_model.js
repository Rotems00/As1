const mongoose = require("mongoose")


const post_Schema = new mongoose.Schema(
    {
       author:
        {
            type:String,
            required:true
        },
        title:
        {
            type:String,
            required:true
        },
        content:
        {
            type:String,
            required:true

        },
       
    }
)

const posts = mongoose.model("Posts",post_Schema);
module.exports = posts