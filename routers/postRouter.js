const express = require('express')
const { getAllPost, createPost, getPostForId, deletePostById, editPostById, likePost, noOfLikes, unlikePost, comment, viewComment } = require('../controllers/postController')
const {isAuthenticated} = require('../middlewares/isAuthenticated')
const router = express.Router()

const multer = require('multer')
const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

router.get('/getpost',isAuthenticated,getAllPost)
router.post('/createpost',upload.single('post_img'),isAuthenticated,createPost)
router.get('/myposts',isAuthenticated,getPostForId)
router.get('/deletePost/:pid',isAuthenticated,deletePostById)
router.post('/editPost/:pid',isAuthenticated,editPostById)

router.post('/likepost',isAuthenticated,likePost)
router.get('/nooflikes/:pid',isAuthenticated,noOfLikes)
router.get('/unlikepost/:pid/:uid',isAuthenticated,unlikePost)

router.post('/comment',isAuthenticated,comment)
router.get('/viewcomment/:pid',isAuthenticated,viewComment)
module.exports = router