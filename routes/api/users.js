
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../../config/db');
const User = require('../../models/users');
const sessionHandle = require('../../models/sessionHandling')
const verifyToken = require('../../middleware/auth')
const sessionVerify = require('../../middleware/session')
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



/**
 * @route   POST /api/v1/login
 * @desc    Login a user
 * @access  Public
 * @return  message
 * @error   400, { error }
 * @status  200, 401, 500
 * 
 * @example /api/v1/register
**/

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: 401,
                error: 'User not found'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid password'
            });
        }

        const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
            expiresIn: '24h'
        });
        // const newSession = new User({
        //     token:token,
        //     author:email,
        //     verified:true
        // });
        // await newSession.save()
        res.cookie('authcookie', token, { maxAge: 86400000, httpOnly: true })
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            token: token
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error logging in user',
            error: error.err
        });
    }
})

router.get('/me',sessionVerify,async(req,res)=>{
    // const newSession = new sessionHandle({
    // token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5pdGhpbmRhbmllbDIwMThAZ21haWwuY29tIiwiaWF0IjoxNzExMjQ2ODUxLCJleHAiOjE3MTEzMzMyNTF9.a4b1lmH2f2LyLNcQ_z_tkCBci-0986c5h_A5jppBkk0",
    // author:"nithindaniel2018@gmail.com",
    // verified:true
    // });
    // await newSession.save()
    res.sendStatus(200)
})

module.exports = router;