const mongoose = require('mongoose');


const sessionHandlingSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    lastLogin:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('SessionHandle', sessionHandlingSchema);