

const User = require('../models/users');
const Role = require('../models/roles');


const checkPermission = (permissions, mode = 'any') => async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email: email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'User not found'
            });
        }

        // Check if user has permission
        const roles = user.roles;
        const rolePermissions = await Role.find({ name: { $in: roles } });

        let hasPermission = false;
        rolePermissions.forEach(role => {
            role.permissions.forEach(permission => {
                if (permissions.includes(permission)) {
                    hasPermission = true;
                }
            });
        });

        // Check if user has all permissions or any permission
        if (mode === 'all') {
            hasPermission = permissions.every(permission => rolePermissions.some(role => role.permissions.includes(permission)));
        } else if (mode === 'any') {
            hasPermission = permissions.some(permission => rolePermissions.some(role => role.permissions.includes(permission)));
        } else {
            return res.status(400).json({
                status: 400,
                message: 'Invalid permission mode'
            });
        }

        // If user has permission, continue
        if (hasPermission) {
            return next();
        }
        
        // If user does not have permission, return unauthorized
        return res.status(401).json({
            status: 401,
            message: 'You do not have permission to perform this action'
        });
    }
    catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Error checking permissions',
            error: err
        });
    }
}


module.exports = checkPermission;
