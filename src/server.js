import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'
import initWebRouters from './route/web'
import connectDB from './config/connectDB'
import cors from 'cors'
const http = require("http")
let port = process.env.PORT || 8080
let app = express()
const server = http.createServer(app)
require('dotenv').config()

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    socket.emit("me", socket.id)
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})

app.use(cors({ credentials: true, origin: true }))

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// config
viewEngine(app)
initWebRouters(app)

// connect DB
connectDB()

server.listen(port, () => {
    console.log("Back end is running on the port ", port)
})