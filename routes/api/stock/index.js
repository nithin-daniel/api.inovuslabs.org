
const express = require('express');
const router = express.Router();


const deviceRouter = require('./devices');
const stockLogRouter = require('./stock_logs');


router.use('/device', deviceRouter);
router.use('/stock_log', stockLogRouter);


module.exports = router;
