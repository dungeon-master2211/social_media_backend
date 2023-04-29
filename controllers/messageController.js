const {catchAsyncError} = require('../utils/catchAsyncError')
const Message = require('../models/messageModel')
const ErrorHandler = require('../utils/errorHandler')

exports.getMessageById = catchAsyncError(async(req,res)=>{
    const {from,to} = req.body
    const getMessage = await Message.find({
        from:from,
        to:to
    }).sort('createdAt')

    const getMessage2 = await Message.find({
        from:to,
        to:from
    }).sort('createdAt')

    const resMessage = [...getMessage,...getMessage2].sort((a,b)=>a?.createdAt-b?.createdAt)

    return res.status(200).send({
        status:'success',
        messages:resMessage
    })
})