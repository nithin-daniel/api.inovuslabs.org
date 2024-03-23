const express = require('express');
const router = express.Router();

const { User } = require('../../models/users');


router.post('/register',async(req,res)=>{
    try{
        const { firstName,lastName,mobile,email,dob,gender,department,batch,college } = req.body;

        let user = await User.findOne({ email: email});
        if (user){
            return res.status(400).json({ message: 'This email id already used' })
        }else{
            const newUser = new User({
                firstName:firstName,
                lastName:lastName,
                mobile:mobile,
                email:email,
                dob:dob,
                gender:gender,
                department:department,
                batch:batch,
                college:college
            })
            await newUser.save()
            return res.status(200).json({ message: 'User created' });
    }
    }catch (err){
        return res.status(400).json({ message: err.message })
    }

})



module.exports = router;