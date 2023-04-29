const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { catchAsyncError } = require('../utils/catchAsyncError')
exports.isAuthenticated = catchAsyncError( async(req,res,next)=>{
    const token = req.cookies.chatapp
    if(!token){
        return res.status(404).json({
            isAuthenticated:false,
            status:'fail',
            message:'Please login to continue!'
        })
    }
    const isVerified = await jwt.verify(token,process.env.JWT_SECRET)
    if(!isVerified) return res.status(404).json({
        message:'Please Login to continue',
        status:'fail'
    })
    const user = await User.findById({_id:isVerified.id})
    req.user = user
    next()
})