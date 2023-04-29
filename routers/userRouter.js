const express = require('express')
const { registerUser, getUsers, addFriend, getUserById, deleteUserById, loginUser, getProfile, logout, removeFriend } = require('../controllers/userController')
const {isAuthenticated} = require('../middlewares/isAuthenticated')
const { sendRequest, getRequestById, deleteRequest } = require('../controllers/requestController')
const router = express.Router()
const multer = require('multer')
const { getMessageById } = require('../controllers/messageController')

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

router.get('/getUsers',isAuthenticated,getUsers)
router.get('/getUserById/:id',getUserById)
router.post('/register',upload.single('profilePicUrl'),registerUser)
router.get('/profile',isAuthenticated,getProfile)
router.post('/login',loginUser)
router.post('/addFriend',addFriend)
router.get('/deleteUser/:id',deleteUserById)
router.get('/logout',logout)
router.get('/remove/:fid',isAuthenticated,removeFriend)

// Request 
router.post('/sendrequest/:id',isAuthenticated,sendRequest)
router.get('/getrequests/:id',isAuthenticated,getRequestById)
router.post('/deleterequest',deleteRequest)

router.post('/getmessagebyid',isAuthenticated,getMessageById)
module.exports = router