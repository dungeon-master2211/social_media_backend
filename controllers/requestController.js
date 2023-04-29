const {catchAsyncError} = require('../utils/catchAsyncError')
const Request = require('../models/requestModel')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
exports.sendRequest = catchAsyncError(async(req,res)=>{
    const from = req.user._id
    const to = req.params.id
    const alreadyExist = await User.findOne({_id:to})

    if(alreadyExist.friends.includes(from)) throw new ErrorHandler('Request Already Sent',404)
    const isrequests = await Request.find({
        to:to,
        from:from
    })
    console.log(isrequests)
    if(isrequests.length !== 0) throw new ErrorHandler('Request Already Sent',404)
    const newRequest = await Request.create({
        to:to,
        from:from
    })
    return res.status(200).json({
        status:'success',
        message:'Request Sent Successfully'
    })

})

exports.getRequestById = catchAsyncError(async(req,res)=>{
    const myid = req.params.id
    const myrequests = await Request.find({to:myid}).populate('from')
    return res.status(200).json({
        status:'success',
        requests:myrequests
    })
})

exports.deleteRequest = catchAsyncError(async(req,res)=>{
    const {friendId,myId} = req.body
    console.log(req.body)
    console.log(friendId,myId)
    if(!friendId || !myId) return res.status(404).json({
        status:'fail',
        message:'provide id'
    })

    await Request.findOneAndDelete({to:myId,from:friendId})
    return res.status(200).json({
        status:'success',
        message:'Request rejeted'
    })
})