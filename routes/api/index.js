
const express = require('express');
const router = express.Router();


const resourcesRouter = require('./resources');
const permissionsRouter = require('./permissions');
const rolesRouter = require('./roles');


router.use('/resources', resourcesRouter);
router.use('/permissions', permissionsRouter);
router.use('/roles', rolesRouter);


module.exports = router;
