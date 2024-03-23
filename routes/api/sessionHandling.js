
const express = require('express');
const router = express.Router();
const sessionHandling = require('../../models/sessionHandling');

router.get('/',async(req,res)=>{
    try{
        ip=req.ip
        ip = ip.split(':').slice(-1);
        // console.log(ip[0]);
        ip_final = ip[0]
        const newIp = new sessionHandling({
            ip:ip_final
        });
        await newIp.save()
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





module.exports = router;