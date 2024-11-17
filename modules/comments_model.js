const mongoose = require("mongoose")


const comments_Schema = new mongoose.Schema(
    {
       comment_user:
        {
            type:String,
            required:true
        },
        title:
        {
            type:String,
            required:true
        },
        comment_content:
        {
            type:String,
            required:true

        },
        post_id:
        {
            type:String,
            required:true
        }
       
    }
)

const comments = mongoose.model("Comments",comments_Schema);
module.exports = comments