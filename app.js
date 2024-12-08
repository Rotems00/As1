const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

const promise = new Promise((resolve, reject) => {
    const db = mongoose.connection
    db.on('error', error => { console.error(error) })
    db.once('open', () => console.log("Connected to Database"))
mongoose.connect(process.env.DATABASE_URL)//,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {   
    console.log("pass Mongo connection")
    const app = express();
    app.use(express.json());
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    const postsRoutes = require("./routes/posts_routes.js")
    app.use('/Posts', postsRoutes);
    const commentsRoutes = require("./routes/comments_routes.js")
    app.use("/Comments", commentsRoutes);
    
   // app.get('/', (req, res) => {
    //    console.log("Welcome to the homepage")
      //  res.send("HEY ROTEM")

  //  });
    resolve(app);
})})

module.exports = promise;


