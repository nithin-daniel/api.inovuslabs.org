
const express = require('express');
const router = express.Router();

const db = require('../../config/db');
const Role = require('../../models/roles');




// router.post('/', (req, res) => {
//     let role = new Role({
//         name: req.body.name,
//         description: req.body.description,
//         permissions: req.body.permissions
//     });

//     role.save()
//         .then(role => {
//             res.status(201).json({
//                 status: 201,
//                 message: 'Role created successfully',
//                 data: role
//             });
//         })
//         .catch(err => {
//             res.status(400).json({
//                 status: 400,
//                 message: 'Error creating role',
//                 error: err
//             });
//         });
// });



router.post('/seed', (req, res) => {
    let roles = [
        // {
        //     name: 'Super Admin',
        //     description: 'Super Admin Role',
        //     permissions: [
        //         'own.user.read',
        //         'own.user.write',
        //         'own.user.destroy',

        //         'org.user.read',
        //         'org.user.write',
        //         'org.user.destroy',

        //         'org.resource.read',
        //         'org.resource.write',
        //         'org.resource.destroy'
        //     ]
        // },
        // {
        //     name: 'General User',
        //     description: 'General User Role',
        //     permissions: [
        //         'own.user.read',
        //         'own.user.write',
        //         'own.user.destroy'
        //     ]
        // }

        {
            name: 'Stock Manager',
            description: 'Stock Manager Role',
            permissions: [
                'org.device.read',
                'org.device.write',
                'org.device.destroy',

                'org.stock_logs.read',
                'org.stock_logs.write',
                'org.stock_logs.approve',
                'org.stock_logs.destroy',

                'org.user_logs.read',
                'org.user_logs.write',
                'org.user_logs.destroy'
            ]
        }
    ];

    Role.insertMany(roles)
        .then(roles => {
            res.status(201).json({
                status: 201,
                message: 'Roles seeded successfully',
                data: roles
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error seeding roles',
                error: err
            });
        });
});


module.exports = router;