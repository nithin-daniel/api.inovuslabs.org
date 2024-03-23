
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../../config/db');
const User = require('../../models/users');
const verifyToken = require('../../middleware/auth')
const jwt = require('jsonwebtoken');

/**
 * @route   POST /api/v1/register
 * @desc    Register a new user
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/register
**/

router.post('/register', async (req, res) => {
    try {

        let { first_name, last_name, mobile, email, password, dob, gender, department, batch, college } = req.body;
        let user = await User.findOne({ email: email });

        if (user) {
            return res.status(400).json({
                status: 400,
                message: 'This email is already registered'
            })
        } else {

            const salt = await bcrypt.genSalt(10)
            const salt_password = await bcrypt.hash(password, salt)

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                mobile: mobile,
                email: email,
                password: salt_password,
                dob: dob,
                gender: gender,
                department: department,
                batch: batch,
                college: college
            })

            await newUser.save()
            return res.status(200).json({ 
                status: 200,
                message: 'User created successfully'
            })

        }
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Error creating user',
            error: err
        })
    }
});



router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ error: 'Email not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return res.status(401).json({ error: 'Wrong Password' });
        }

        const token = jwt.sign({ email:email }, process.env.TOKEN_SECRET, {
            expiresIn: '1h',
            });
        //     res.cookie(
        //     "token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV !== 'development',
        //     sameSite: "strict",
        //     maxAge: jwtExpirySeconds * 1000
        // });
        res.status(200).json({ "Token":token });
    }catch (error) {
        res.status(500).json({ error:error.err });
    }
    // return res.status(200).json({ 
    //     status: 200,
    //     message: 'from sample header middleware checker'
    // })
})



module.exports = router;