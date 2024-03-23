const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../../models/users');


router.post('/register',async(req,res)=>{
    try{
        const { firstName,lastName,mobile,email,password,dob,gender,department,batch,college } = req.body;

        let user = await User.findOne({ email: email});
        if (user){
            return res.status(400).json({ message: 'This email id already used' })
        }else{
            const salt = await bcrypt.genSalt(10)
            const salt_password = await bcrypt.hash(password, salt)
            const newUser = new User({
                firstName:firstName,
                lastName:lastName,
                mobile:mobile,
                email:email,
                password:salt_password,
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

});

router.post('/login',async(req,res)=>{

})



module.exports = router;