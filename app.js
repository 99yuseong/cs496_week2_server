require("dotenv").config();
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const static = require('serve-static');

const userRouter = require('./router/user')
const runningRouter = require('./router/running')
const groupRouter = require('./router/group')
const User = require('./schema/User');
const { json } = require("express/lib/response");

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const { PORT, MONGO_URI } = process.env

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e))

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('uploads'));

app.use("/user", userRouter);
app.use("/running", runningRouter);
app.use("/group", groupRouter)

server.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
}) 


io.on('connection', (socket) => {
    console.log(`Socket connected : ${socket.id}`)

    socket.on('join', (room) => {
        socket.join(room)
    })

    socket.on('changeGroup', async (data)=> {
        let id = data[0]
        let prvGroup = data[1]
        let curGroup = data[2]
        console.log(id, prvGroup)
        io.to(prvGroup).emit("goOut", id)
        socket.emit("goOut", id)
        socket.leave(prvGroup)
        socket.join(curGroup)
    })

    socket.on('startRunning', async (id) => {
    })

    socket.on('curRunning', async (data) => {
        console.log(data)
        let jsonData = JSON.parse(data)
        let user = await User.findOne({ _id: jsonData._id })
        jsonData.imgUrl = user.imgUrl
        jsonData.name = user.name
        socket.join(jsonData.room)
        console.log(jsonData)
        io.to(jsonData.room).emit("message", JSON.stringify(jsonData))
    })

    socket.on('endRunning', async (_id) => {
        let user = await User.findById(_id)
        console.log(user)
        io.emit("endRun", JSON.stringify(user))
    })
  
    socket.on('disconnect', () => {
        console.log(`Socket disconnected : ${socket.id}`)
    })
})


module.exports = io