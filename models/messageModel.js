const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'sender id is required']
    },
    msg:{
        type:String,
        required:[true,'msg is required']
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'sender id is required']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const messageModel = mongoose.model('message',messageSchema)
module.exports = messageModel