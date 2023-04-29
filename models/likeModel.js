const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})

const likeModel = mongoose.model('like',likeSchema)
module.exports = likeModel