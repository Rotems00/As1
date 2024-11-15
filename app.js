const express = require('express');

const app = express();
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open', ()=> console.log("CONNECTED TO MONGODB"))
app.use(express.json());



const port = process.env.PORT;
const homeroutes = require("./routes/home_routes.js")
const Accounts = require("./modules/Acc_model.js")



app.get('/',(req,res)=>{
    res.send("HEY ROTEM")}


);
app.use('/Home', homeroutes);





app.listen(port,()=>{
    console.log("LISTENING IS HAPPENING !")

}
);

module.exports = app;


