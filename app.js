const express = require('express')
const {createServer} = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const { errorMiddleware } = require('./middlewares/errorMiddleware')
const Message = require('./models/messageModel')
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')
const mongoose= require('mongoose')
const dotenv = require('dotenv').config({path:'./config.env'})
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { toASCII } = require('punycode')
const app = express()
app.use(cors({
    origin:process.env.frontend_url, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    
 }))
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","*")
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
 });
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cookieParser());
const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:process.env.frontend_url
    }
})

const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    return res.status(200).send({
        message:'working'
    })
})
app.use('/api/v1',userRouter)
app.use('/api/v1',postRouter)

const connectedUsers = {}
io.on('connection',(socket)=>{
    const userId = socket.handshake.auth
    console.log('user connected',socket.id,userId)
    connectedUsers[userId?.myId] = socket.id
    console.log(connectedUsers)
    socket.on('private message',(data)=>{
        console.log(data,'sent data')
        const sendTo = data?.to
        const msg = data?.msg
        const sentFrom = data?.from
        const Receiver = connectedUsers[sendTo]
        console.log(Receiver,'receiver')
        Receiver? sendAndSave(Receiver,{
            from:sentFrom,
            msg:msg,
            createdAt:new Date(Date.now())
        },data)
        : saveMessageToDB({
            ...data,createdAt:new Date(Date.now())
        })

        
            
        
    })

    socket.on('typing',(data)=>{
        const {from,to} = data
        console.log('typing',from,to)
        const Receiver = connectedUsers[to]
        Receiver?socket.to(Receiver).emit('typing',from):''
    })
    socket.on('stoppedtyping',(data)=>{
        const {from,to} = data
        console.log('stop typing',from,to)
        const Receiver = connectedUsers[to]
        Receiver?socket.to(Receiver).emit('stoppedtyping',from):''
    })

    async function sendAndSave(rec,msgToSend,msgToSave){
        socket.to(rec).emit('private message',msgToSend)
        const createMessage = await Message.create(msgToSave)
    }
    async function saveMessageToDB(msgToSave){
        console.log('receiver not online')
        const createMessage = await Message.create(msgToSave)
    }
    socket.on('disconnect',()=>{
        
        const idTodelete = socket.handshake.auth?.myId
        delete connectedUsers[idTodelete]
        
    })


})

app.use(errorMiddleware)

const db = mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('db connected')
}).catch(e=>{
    console.log('Error connecting DB\n',e)
})
httpServer.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT} `)
})
