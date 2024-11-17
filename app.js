const express = require('express');

const app = express();
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open', ()=> console.log("CONNECTED TO MONGODB"))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))




const port = process.env.PORT;
const postsRoutes = require("./routes/posts_routes.js")
const Posts = require("./modules/posts_model.js")
const commentsRoutes = require("./routes/comments_routes.js")
const Comments = require("./modules/comments_model.js")




app.get('/',(req,res)=>{
    res.send("HEY ROTEM")}


);


app.use('/Posts', postsRoutes);
app.use("/Comments", commentsRoutes);




app.listen(port,()=>{
    console.log("LISTENING IS HAPPENING !")

}
);



module.exports = app;


