const User = require('../models/userModel')
const Request = require('../models/requestModel')
const {catchAsyncError} = require('../utils/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const { generateToken } = require('../utils/generateToken')

const {uploadImage}  = require('../utils/uploadImage')
exports.registerUser = catchAsyncError(async(req,res)=>{
    
    const {name,email,password,confirmPassword} = req.body
    console.log(req.body,'req body')
    
    if(!name || !email || !password || !confirmPassword)  throw new ErrorHandler('All credentials are required',404)
    if(password!==confirmPassword) throw new ErrorHandler('Password not matched',400)
    let isImg = false
    let avatarUrl = ''
    if(req.file){
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    // console.log(dataURI,'file')
    const imgUrl = await uploadImage(dataURI)
    avatarUrl = await imgUrl
    isImg=true
    }
    
    const newUser = new User({
        name,
        email,
        password,
        profilePicUrl:avatarUrl
    })

    await newUser.save()
    
    return res.status(200).json({
        status:'success',
        message:'User created Successfully',
        user:newUser,
    })

})


exports.loginUser = catchAsyncError(async(req,res)=>{
    const {email,password} = req.body
    console.log(req.body)
    if(!email || !password) throw new ErrorHandler('Fill all the credentials',404)
    const user = await User.findOne({email:email})
    if(!user) throw new ErrorHandler('User does not exist!',404)
    const isMatch = await user.comparePassword(password,user.password)
    if(!isMatch) throw new ErrorHandler('Incorrect Email or Password',404)
    const cookieToken = await generateToken(user._id)
    // console.log(cookieToken)
    res.cookie('chatapp',cookieToken,{
        secure: true,
        httpOnly: true,
        domain:'.netlify.app'
    })
    return res.status(200).send({
        status:'success',
        message:'Login Successfully',
        user,
        token:cookieToken
    })
})
exports.logout = catchAsyncError(async(req,res)=>{
    return res.clearCookie('chatapp').status(200).json({
        status:'success',
        message:'Logged Out!'
    })
})
exports.getProfile = catchAsyncError(async(req,res)=>{
    return res.status(200).json({
        user:req.user,
        status:'success'
    })
})


exports.getUsers = catchAsyncError(async(req,res)=>{
    const {people} =  req.query
    let query = User
    if(people){
        query = query.find({name:{$regex:people,$options:'i'}})
    }else{
        query = query.find({})
    }
    const users = await query
    
    return res.status(200).json({
        status:'success',
        total:users.length,
        users
    })
})

exports.addFriend = catchAsyncError(async(req,res)=>{
    const {friendId,myId} = req.body
    if(!friendId || !myId) return res.status(404).json({
        status:'fail',
        message:'provide id'
    })

    const user = await User.findById(myId)
    await user.friends.push(friendId)
    await user.save()

    const friend_user = await User.findById(friendId)
    await friend_user.friends.push(myId)
    await friend_user.save()

    await Request.findOneAndDelete({to:myId,from:friendId})
    return res.status(200).json({
        status:'success',
        user
    })

})

exports.removeFriend = catchAsyncError(async(req,res)=>{
    const myId = req.user._id
    const friendId = req.params.fid
    const me = await User.findById(myId)
    const index = me.friends.indexOf(friendId)
    if (index==-1) throw new ErrorHandler('No friends with this id exist',404)
    me.friends.splice(index)
    await me.save()

    const friend = await User.findById(friendId)
    const myindex = friend.friends.indexOf(myId)
    if (myindex==-1) throw new ErrorHandler('No friends with this id exist',404)
    friend.friends.splice(index)
    await friend.save()

    return res.status(200).json({
        status:'success',
        message:'Unfriend successfully!',
        user:me
    })
})



exports.getUserById = catchAsyncError(async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    if(!user) throw new ErrorHandler('User not Found',404)
    await user.populate('friends')
    return res.status(200).send({
        'status':'success',
        user
    })
})

exports.deleteUserById = catchAsyncError(async(req,res)=>{
    const {id} = req.params
    if(!id) throw new ErrorHandler('Provide Id to delete',400)
    const user = await User.findByIdAndDelete(id)
    if(!user) throw new ErrorHandler('User not Found',404)
    return res.status(200).json({
        status:'success',
        message:'User deleted successfully'
    })
})