const mongoose = require('mongoose');
const { nanoid } = require('nanoid');


const UserSchema = new mongoose.Schema({
    user_id:{
        type:String,
        default: nanoid(),
        required: true,
        unique:true
    },
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
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
        unique:true
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
        default:["General User"]
    },
    password:{
        type:String,
        required:true,
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: false,
        default: Date.now
    }
})

// module.exports = mongoose.model('User', UserSchema);
var User = mongoose.model('User',UserSchema);
module.exports = {User};