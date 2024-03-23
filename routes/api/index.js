
const express = require('express');
const router = express.Router();


const resourcesRouter = require('./resources');
const permissionsRouter = require('./permissions');
const rolesRouter = require('./roles');
const stockRouter = require('./stock');


router.use('/resources', resourcesRouter);
router.use('/permissions', permissionsRouter);
router.use('/roles', rolesRouter);
router.use('/stock', stockRouter);


module.exports = router;
