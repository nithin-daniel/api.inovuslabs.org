const mongoose = require('mongoose');


const sessionHandlingSchema = new mongoose.Schema({
    ip:{
        type:String
    }
})

module.exports = mongoose.model('SessionHandle', sessionHandlingSchema);