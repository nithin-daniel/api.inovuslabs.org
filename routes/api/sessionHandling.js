
const express = require('express');
const router = express.Router();
const sessionHandling = require('../../models/sessionHandling');

router.get('/',async(req,res,next)=>{
    try{
        token = ""
        if (token){
            const newLogin = sessionHandling.findOne({token});
            const date = new Date();
            newLogin.lastLogin = date;
            await newLogin.save()
            next();
        }else{
            return res.status(500).json({status: 500,message: "Blocking from middleware the user is not authenticated"});
        }
    }catch(error){
        res.status(500).json({
            status: 500,
            message: 'Error',
            error: error.err
        });
    }
});





module.exports = router;