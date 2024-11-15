const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
    res.send("Welcome HOME!")
});
module.exports = router;