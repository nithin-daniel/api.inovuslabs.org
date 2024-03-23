
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const db = require('../../config/db');
const Permission = require('../../models/permissions');



let samplePermissions = [
    {
        name: 'own.user.read',
        description: 'Read own user data'
    }, {
        name: 'own.user.write',
        description: 'Update own user data'
    }, {
        name: 'own.user.destroy',
        description: 'Delete own user data'
    },

    {
        name: 'org.user.read',
        description: 'Read all user data'
    }, {
        name: 'org.user.write',
        description: 'Update all user data'
    }, {
        name: 'org.user.destroy',
        description: 'Delete all user data'
    },

    {
        name: 'org.resource.read',
        description: 'Read all resource data'
    }, {
        name: 'org.resource.write',
        description: 'Create or update all resource data'
    }, {
        name: 'org.resource.destroy',
        description: 'Delete all resource data'
    }
]



router.post('/', (req, res) => {
    let permission = new Permission({
        name: req.body.name,
        description: req.body.description
    });

    permission.save()
        .then(permission => {
            res.status(201).json({
                status: 201,
                message: 'Permission created successfully',
                data: permission
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error creating permission',
                error: err
            });
        });
});



router.post('/seed', (req, res) => {

    Permission.insertMany(samplePermissions)
        .then(permissions => {
            res.status(201).json({
                status: 201,
                message: 'Permissions created successfully',
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error creating permissions',
                error: err
            });
        });

});



module.exports = router;