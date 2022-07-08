require("dotenv").config();
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./router/user')

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

io.sockets.on('connection', (socket) => {
    console.log(`Socket connected : ${socket.id}`)

    socket.on('curRunning', (data) => {
        // console.log(data)
    })
  
    socket.on('disconnect', () => {
        console.log(`Socket disconnected : ${socket.id}`)
    })
})

app.get("/", (req, res) => {
    console.log("hello this is get api");
    // res.status(200).send({ hi: 1 });
});

app.use("/user", userRouter);

server.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
}) 