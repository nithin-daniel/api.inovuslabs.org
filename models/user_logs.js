
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const UserLogSchema = new mongoose.Schema({
    userlog_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    user_id: {
        type: String,
        required: true
    },
    components: [
        {
            device_id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            // approver_id: {
            //     type: String,
            //     required: true
            // },
            approver_id: [
                {
                    type: String,
                    required: true
                }
            ],
            status: {
                type: String,
                required: true,
                default: 'entry.pending',
                enum: ['entry.pending', 'entry.approved', 'exit.pending', 'exit.approved']
            },
            created_at: {
                type: Date,
                required: true
            },
            updated_at: {
                type: Date,
                required: true
            }
        }
    ],
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('UserLog', UserLogSchema);