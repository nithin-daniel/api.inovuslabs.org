
const express = require('express');
const router = express.Router();

const resourcesRouter = require('./resources');

router.use('/resources', resourcesRouter);

module.exports = router;