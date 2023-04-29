const Post = require('../models/postModel')
const Like = require('../models/likeModel')
const Comment = require('../models/commentModel')
const {catchAsyncError} = require('../utils/catchAsyncError')
const { uploadImage } = require('../utils/uploadImage')
const ErrorHandler = require('../utils/errorHandler')
exports.getAllPost = catchAsyncError(async(req,res)=>{
    const posts = await Post.find({}).sort('-createdAt').populate('author')
    return res.status(200).json({
        status:'success',
        posts:posts,
        user:req.user
    })
})

exports.getPostForId = catchAsyncError(async(req,res)=>{
    const id = req.user._id
    const myPosts = await Post.find({author:id}).sort('-createdAt')
    return res.status(200).send({
        status:'success',
        posts:myPosts
    })
})

exports.createPost = catchAsyncError(async(req,res)=>{
    const {author,post_text} = req.body
    let isImg = false
    let postUrl = ''
    if(req.file){
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    // console.log(dataURI,'file')
    const imgUrl = await uploadImage(dataURI)
    postUrl = await imgUrl
    isImg=true
    }
    const savedPost = await Post.create({
        author:author,
        post_text:post_text,
        post_img:postUrl?postUrl:''
    })
    const currentPost = await savedPost.populate('author')
    return res.status(200).json({
        status:'success',
        message:'Post added to the wall!',
        post:currentPost
    })
})

exports.deletePostById = catchAsyncError(async(req,res)=>{
    const pid = req.params.pid
    const post = await Post.findById(pid)
    if(!post) throw new ErrorHandler('No post with this id found!',404)
    const deletedPost = await Post.findByIdAndDelete(pid)
    return res.status(203).send({
        status:'success',
        message:'Post deleted successfully!'
    })
})

exports.editPostById = catchAsyncError(async(req,res)=>{
    const postid = req.params.pid
    const postExist = await Post.findById(postid)
    if(!postExist) throw new ErrorHandler('This post does not exist',404)
    const newBody = req.body.postText
    postExist.post_text = newBody
    await postExist.save()
    return res.status(200).json({
        message:'Post edited successfully',
        status:'success'
    })
})

exports.likePost = catchAsyncError(async(req,res)=>{
    const {post_id,user_id} = req.body
    const addLike = await Like.create({
        post_id,user_id
    })
    return res.status(200).send({
        status:'success',
        message:'Like added'
    })
})

exports.noOfLikes = catchAsyncError(async(req,res)=>{
    const postid = req.params.pid
    const allLikes = await Like.find({post_id:postid}).select('user_id -_id')
    if(!allLikes) return res.status(200).send({
        status:'success',
        likes:0,
        allUsers:[]
    })
    return res.status(200).send({
        status:'success',
        likes:allLikes.length,
        allUsers:allLikes.map(item=>item.user_id)
    })
})

exports.unlikePost = catchAsyncError(async(req,res)=>{
    const postid = req.params.pid
    const userid = req.params.uid
    const unlike = await Like.findOneAndDelete({post_id:postid,user_id:userid})
    const allUsers = await Like.find({post_id:postid}).select('user_id -_id')
    return res.status(200).send({
        status:'success',
        message:'unliked',
        allUsers:allUsers.map(item=>item.user_id)
    })
    
})

exports.comment = catchAsyncError(async(req,res)=>{
    const {postid,userid,text} = req.body
    if(!postid || !userid || !text) throw new ErrorHandler('Provide all body',404)
    const newComment = await Comment.create({
        post_id:postid,
        user_id:userid,
        text:text
    })

    return res.status(203).send({
        status:'success',
        message:'comment added successfully!'
    })

})

exports.viewComment = catchAsyncError(async(req,res)=>{
    const postid = req.params.pid
    const allComments = await Comment.find({post_id:postid}).populate('user_id')
    if(!allComments) return res.status(200).send({
        status:'success',
        comments:[]
    })

    return res.status(200).send({
        status:'success',
        comments:allComments
    })

})