
const express = require('express');
const router = express.Router();

const resourcesRouter = require('./resources');
const userRouter = require('./users')

router.use('/resources', resourcesRouter);
router.use('/user', userRouter);

module.exports = router;