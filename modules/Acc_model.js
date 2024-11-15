const mongoose = require("mongoose")


const Acc_Schema = new mongoose.Schema(
    {
        UserName:
        {
            type:String,
            required:true
        },
        Password:
        {
            type:String,
            required:true

        },
        isAdmin:
        {
            type:Boolean,
  
            default:false
        }
    }
)

const Accounts = mongoose.model("Accounts",Acc_Schema);
module.exports = Accounts

