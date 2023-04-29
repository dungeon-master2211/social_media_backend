const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'A request should have a receiver!']
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'A request should have a receiver!']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const requestModel = mongoose.model('request',requestSchema)
module.exports = requestModel