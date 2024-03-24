
const express = require('express');
const router = express.Router();
const sessionHandling = require('../../models/sessionHandling');
// const permissionValidator = require('../')

router.get('/',sessionHandling,async(req,res)=>{
    try{
        
        // const newIp = new sessionHandling({
        //     ip:ip_final
        // });
        // await newIp.save()
        // var os = require("os");
        // os.hostname();
        // console.log(os.hostname());
        return res.status(200).json({status: 200,message: req.method})

    }catch(error){
        res.status(500).json({
            status: 500,
            message: 'Error',
            error: error.err
        });
    }
})
router.get('/check',async(req,res)=>{
    try{

    }catch(error){
        res.status(500).json({
            status: 500,
            message: 'Error',
            error: error.err
        });
    }
});




module.exports = router;