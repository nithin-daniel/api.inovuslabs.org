
const express = require('express');
const router = express.Router();

const StockLog = require('../../../models/stock_logs');
const UserLog = require('../../../models/user_logs');
const verifyToken = require('../../../middleware/auth');



/**
 * @route   GET /api/v1/stock/stock_logs
 * @desc    Get all stock logs with pagination
 * @access  Public
 * @params  page, limit, search
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/stock_logs?page=1&limit=10&search=resource
 * 
 * @todo    Add search
 * @todo    Add filter by category
**/

router.get('/', verifyToken, async (req, res) => {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || null;

    let query = {};
    if (search) {
        query = { $text: { $search: search } };
    }

    let totalStockLogs = await StockLog.countDocuments(query)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving stock logs',
                error: err
            });
        });

    let stock_logs = await StockLog.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error retrieving stock logs',
                error: err
            });
        });

    res.status(200).json({
        status: 200,
        message: 'Stock logs retrieved successfully',
        data: {
            stock_logs: stock_logs,
            meta: {
                page: page,
                limit: limit,
                pages: Math.ceil(totalStockLogs / limit),
                total: totalStockLogs,
                search: search
            }
        }
    });

});



/**
 * @route   POST /api/v1/stock/stock_logs
 * @desc    Add new stock log
 * @access  Private
 * @params  stock_id, quantity, action
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/stock_logs
**/

router.post('/', async (req, res) => {

    let stockLog = new StockLog({
        user_id: req.body.user_id,
        components: req.body.components,
        mode: req.body.mode
    });

    if (stockLog.mode === 'stock_return') {
        stockLog.status = 'exit.pending';
    }

    stockLog.save()
        .then(data => {
            res.status(200).json({
                status: 200,
                message: 'Stock log added successfully',
                // data: data
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error adding stock log',
                error: err
            });
        });

});



/**
 * @route   PATCH /api/v1/stock/stock_logs/:stocklog_id
 * @desc    Update a stock log
 * @access  Private
 * @params  stocklog_id
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/stock_logs/60b1e6e7f6d2b4e6e8f4b8e2
**/

router.patch('/:stocklog_id', verifyToken, async (req, res) => {

    await StockLog.findOneAndUpdate({ stocklog_id: req.params.stocklog_id }, {

        user_id: req.body.user_id,
        components: req.body.components,
        mode: req.body.mode,
        updated_at: Date.now()

    }, { new: true })
        .then(data => {
            res.status(200).json({
                status: 200,
                message: 'Stock log updated successfully',
                // data: data
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error updating stock log',
                error: err
            });
        });

});



/**
 * @route   DELETE /api/v1/stock/stock_logs/:stocklog_id
 * @desc    Delete a stock log
 * @access  Private
 * @params  stocklog_id
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/stock_logs/60b1e6e7f6d2b4e6e8f4b8e2
**/

router.delete('/:stocklog_id', verifyToken, async (req, res) => {

    await StockLog.findOneAndDelete({ stocklog_id: req.params.stocklog_id })
        .then(data => {
            res.status(200).json({
                status: 200,
                message: 'Stock log deleted successfully',
                // data: data
            });
        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error deleting stock log',
                error: err
            });
        });

});



/**
 * @route   PATCH /api/v1/stock/stock_logs/:status/:stocklog_id
 * @desc    Stock log approval
 * @access  Public
 * @params  status, stocklog_id
 * @return  message, data
 * @error   400, { error }
 * @status  200, 400
 * 
 * @example /api/v1/stock/stock_logs/approve/60b1e6e7f6d2b4e6e8f4b8e2   (approve)
 * @example /api/v1/stock/stock_logs/reject/60b1e6e7f6d2b4e6e8f4b8e2   (reject)
**/

router.patch('/approve/:stocklog_id', async (req, res) => {

    let approver_id = req.body.approver_id;
    let mode = req.body.mode;
    let stocklog_id = req.params.stocklog_id;

    let query = {
        mode: mode,
        status: mode === 'stock_return' ? 'exit.approved' : 'entry.approved',
        approver_id: approver_id,
        updated_at: Date.now()
    };
    
    await StockLog.findOneAndUpdate({ stocklog_id: stocklog_id }, query)
        .then(async data => {

            let mode = data.mode;
            mode === 'stock_return' ? query.status = 'exit.approved' : query.status = 'entry.approved';

            await UserLog.findOne({ user_id: data.user_id })
                .then(async userLog => {

                    // if user log not found, create new user log
                    if (!userLog) {
                        userLog = new UserLog({
                            user_id: data.user_id,
                            components: [],
                            created_at: Date.now(),
                            updated_at: Date.now()
                        });
                    } else {
                        userLog.updated_at = Date.now();
                    }

                    // add components to user log
                    data.components.forEach(component => {

                        // check if component already exists in user log
                        // if exists, update qty. else, add new component
                        let componentIndex = userLog.components.findIndex(c => c.device_id === component.device_id);

                        if (componentIndex !== -1) {

                            if(mode === 'stock_return') {
                                userLog.components[componentIndex].qty -= component.qty;
                            } else {
                                userLog.components[componentIndex].qty += component.qty;
                            }
                            
                            if (userLog.components[componentIndex].qty <= 0) {
                                userLog.components.splice(componentIndex, 1);
                            } else {
                                userLog.components[componentIndex].updated_at = data.updated_at;
                                userLog.components[componentIndex].approver.push({
                                    approver_id: approver_id,
                                    action: query.status
                                });
                            }

                        } else {
                            let newComponent = {
                                device_id: component.device_id,
                                name: component.name,
                                qty: component.qty,
                                created_at: data.updated_at,
                                updated_at: data.updated_at,
                                approver: [
                                    {
                                        approver_id: approver_id,
                                        action: query.status
                                    }
                                ]
                            };
                            userLog.components.push(newComponent);
                        }

                    });


                    // if no more components in user log, delete user log
                    if (userLog.components.length == 0) {

                        // delete user log
                        await UserLog.findOneAndDelete({ user_id: data.user_id })
                            .then(data => {
                                res.status(200).json({
                                    status: 200,
                                    message: 'User log deleted successfully',
                                    // data: data
                                });
                            })
                            .catch(err => {
                                res.status(400).json({
                                    status: 400,
                                    message: 'Error deleting user log',
                                    error: err
                                });
                            });
                        
                    } else {

                        // save user log
                        await userLog.save()
                            .then(data => {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Stock log approved successfully',
                                    // data: data
                                });
                            })
                            .catch(err => {
                                res.status(400).json({
                                    status: 400,
                                    message: 'Error approving stock log',
                                    error: err
                                });
                            });

                    }

                })
                .catch(err => {
                    res.status(400).json({
                        status: 400,
                        message: 'Error retrieving user log',
                        error: err
                    });
                });
            
            // if data.mode === 'stock_in', add those components to user log
            // if data.mode === 'stock_out', remove those components from user log
            // if no more components in user log, delete user log

        })
        .catch(err => {
            res.status(400).json({
                status: 400,
                message: 'Error approving stock log',
                error: err
            });
        });

});



module.exports = router;