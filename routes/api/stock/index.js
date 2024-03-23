
const express = require('express');
const router = express.Router();


const deviceRouter = require('./devices');


router.use('/device', deviceRouter);


module.exports = router;
