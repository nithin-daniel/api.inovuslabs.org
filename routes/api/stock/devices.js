
const express = require('express');
const router = express.Router();

const Device = require('../../../models/devices');
const verifyToken = require('../../../middleware/auth');



/**
 * @route   GET /api/v1/stock/devices
 * @desc    Get all devices in stock with pagination
 * @access  Public
 * @params  page, limit, search
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/devices?page=1&limit=10&search=resource
 * 
 * @todo    Add search
 * @todo    Add filter by category
**/

router.get('/', async (req, res) => {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || null;

    let query = {};
    if (search) {
        query = { $text: { $search: search } };
    }

    let totalDevices = await Device.countDocuments(query)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving devices',
                error: err
            });
        });

    let devices = await Device.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving devices',
                error: err
            });
        });

    res.status(200).json({
        status: 200,
        message: 'Devices retrieved successfully',
        data: {
            devices: devices,
            meta: {
                page: page,
                limit: limit,
                pages: Math.ceil(totalDevices / limit),
                total: totalDevices,
                search: search
            }
        }
    });

});



/**
 * @route   POST /api/v1/stock/device
 * @desc    Create a new device
 * @access  Private
 * @params  name, type, qty_purchased, price, description, image, date_of_purchase, vendor, remarks
 * @return  message, data
 * @error   400, { error }
 * @status  201, 400
 * 
 * @example /api/v1/stock/devices
**/

router.post('/', verifyToken, async (req, res) => {

    let { name, type, qty_available, qty_purchased } = req.body;

    let newDevice = new Device({
        name: name,
        type: type,
        qty_available: qty_available,
        qty_purchased: qty_purchased
    });

    let device = await newDevice.save()
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error inserting device',
                error: err
            });
        });

    res.status(201).json({
        status: 201,
        message: 'Device inserted successfully',
        // data: device
    });

});



module.exports = router;