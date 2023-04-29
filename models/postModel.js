const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post_text:{
        type:String,
        required:[true,'Empty post is not allowed!']
    },
    post_img:{
        type:String,
        default:''
    },
    likes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const postModel = mongoose.model('post',postSchema)
module.exports = postModel