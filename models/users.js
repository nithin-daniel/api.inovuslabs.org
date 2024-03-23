const mongoose = require('mongoose');
import { nanoid } from 'nanoid'

const UserSchema = new mongoose.Schema({
    userId:{
        type:nanoid(10),
        required: true,
        unique:true
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
        required:true,
        default:Date.now
    },
    gender:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true
    },
    batch:{
        type:String,
        required:true,
    },
    college:{
        type:String,
        required:true,
    },
    roles:{
        type:Array,
        required:true,
        default:["user"]
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now
    }
})