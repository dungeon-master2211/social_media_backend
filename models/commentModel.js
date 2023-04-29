const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    text:{
        type:String,
        required:[true,'comment can not be empty']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const commentModel = mongoose.model('comment',commentSchema)
module.exports = commentModel