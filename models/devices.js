
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const DeviceSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid()
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    qty_available: {
        type: Number,
        required: true,
    },
    qty_purchased: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    date_of_purchase: {
        type: Date,
        required: false
    },
    vendor: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
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

module.exports = mongoose.model('Device', DeviceSchema);