const config = require('./config.js');
const express = require("express");
const app = express();
const port = 8000;
const server = require('http').createServer(app);  
const io = require('socket.io').listen(server);

app.use(express.static("./public"));


const { Pool, Client } = require("pg");

const client = new Client(config.devDB);
client.connect();
// client.query("LISTEN watchers");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

var socketClient = new Client(config.devDB)
socketClient.connect()
socketClient.query('LISTEN watchers')
socketClient.on('notification', function(data) {
    console.log('wat')
    console.log(data.payload);
});

    // io.on('notification', function (socket) {
    //     console.log('notify')
    //     socket.on('watchers', function (data) {
    //       console.log(data);
    //     });
    //   });

    //   io.sockets.on('connection', function (socket) {
    //     socket.emit('connected', { connected: true });
    
    //     socket.on('notification', function (data) {
    //         client.on('watchers', function(title) {
    //             socket.emit('update', { message: title });
    //         });
    //     });
    // });
    


app.listen(port, () => console.log("Listening on port " + port));
