
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const db = require('../../config/db');
const Role = require('../../models/roles');
const Permission = require('../../models/permissions');




router.post('/', (req, res) => {
    let role = new Role({
        name: req.body.name,
        description: req.body.description,
        permissions: req.body.permissions
    });

    role.save()
        .then(role => {
            res.status(201).json({
                status: 201,
                message: 'Role created successfully',
                data: role
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error creating role',
                error: err
            });
        });
});

module.exports = router;