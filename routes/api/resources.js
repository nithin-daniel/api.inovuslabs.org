
const express = require('express');
const router = express.Router();

const Resource = require('../../models/resources');
const verifyToken = require('../../middleware/authentication');
const checkPermission = require('../../middleware/authorization');



/**
 * @route   GET /api/v1/resources
 * @desc    Get all resources with pagination
 * @access  Public
 * @params  page, limit, search
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/resources?page=1&limit=10&search=resource
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

    let totalResources = await Resource.countDocuments(query)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving resources',
                error: err
            });
        });

    let resources = await Resource.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving resources',
                error: err
            });
        });

    res.status(200).json({
        status: 200,
        message: 'Resources retrieved successfully',
        data: {
            resources: resources,
            meta: {
                page: page,
                limit: limit,
                pages: Math.ceil(totalResources / limit),
                total: totalResources,
                search: search
            }
        }
    });

});



/**
 * @route   POST /api/v1/resources
 * @desc    Create new resource
 * @access  Admin, Super Admin
 * @params  title, description, category, resources
 * @return  message, data
 * @error   400, { error }
 * @status  201, 400
 * 
 * @example /api/v1/resources
**/

router.post('/', verifyToken, checkPermission(['org.resource.write']), async (req, res) => {
    const newResource = new Resource({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        resources: req.body.resources
    });

    await newResource.save()
        .then(resource => {
            res.status(201).json({
                status: 201,
                message: 'Resource created successfully',
                // data: resource
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error creating resource',
                error: err
            });
        });
});



/**
 * @route   PATCH /api/v1/resources/:id
 * @desc    Update a resource by resource_id
 * @access  Admin, Super Admin
 * @params  title, description, category, resources
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/resources/123456
**/

router.patch('/:id', verifyToken, checkPermission(['org.resource.write']), async (req, res) => {
    const resourceId = req.params.id;

    await Resource.findOneAndUpdate({ resource_id: resourceId }, {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        resources: req.body.resources,
        updated_at: Date.now()
    })
        .then(resource => {
            res.status(200).json({
                status: 200,
                message: 'Resource updated successfully',
                // data: resource
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error updating resource',
                error: err
            });
        });
});



/**
 * @route   DELETE /api/v1/resources/:id
 * @desc    Delete a resource by resource_id
 * @access  Admin, Super Admin
 * @params  resource_id
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/resources/123456
**/

router.delete('/:id', verifyToken, checkPermission(['org.resource.destroy']), async (req, res) => {
    const resourceId = req.params.id;

    await Resource.findOneAndDelete({ resource_id: resourceId })
        .then(resource => {
            res.status(200).json({
                status: 200,
                message: 'Resource deleted successfully',
                // data: resource
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error deleting resource',
                error: err
            });
        });
});



module.exports = router;