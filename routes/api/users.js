
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


        if (password.length < 8) {
            return res.status(400).json({
                status: 400,
                message: 'Password should be atleast 8 characters long'
            })
        } else if (password.search(/[a-z]/i) < 0) {
            return res.status(400).json({
                status: 400,
                message: 'Password should contain atleast one letter'
            })
        } else if (password.search(/[0-9]/) < 0) {
            return res.status(400).json({
                status: 400,
                message: 'Password should contain atleast one digit'
            })
        }


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



module.exports = router;