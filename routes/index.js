
const express = require('express');
const router = express.Router();
const permissionValidator = require('../middleware/permission')

const api = require('./api');
const auth = require('./auth');


router.use('/api/v1', api);
router.use('/auth', auth);


router.get('/', permissionValidator,(req, res) => {
    res.json({
        status: 200,
        message: 'API is working properly'
    });
});


module.exports = router;