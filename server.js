const config = require('./config.js');
const express = require("express");
const app = express();
const port = 8000;
const server = require('http').createServer(app);  
server.listen(8004);
const io = require('socket.io')({}).listen(server);



// io.on('connection', function(socket){
//     console.log('a user connected');
//   });




app.use(express.static("./public"));

app.use(function (req, res, next) {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  
    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      console.log(origin + ' grrr');
      next();
    }
  })


const { Pool, Client } = require("pg");

const client = new Client(config.devDB);
client.connect();


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/getAllDevices", (req, res) => {
    client.query('SELECT * FROM "houseDB".devices', (err, response) => {
    console.log(response)
    res.send(response.rows)
    client.end()
    }
)
});
var socketClient = new Client(config.devDB)
socketClient.connect()
socketClient.query('LISTEN watchers')


io.on('connection', (socket) => {
    console.log('connected')
    socketClient.on('notification', function(data) {
        console.log('wat')
        console.log(data);
        socket.emit('updateDevice', JSON.parse(data.payload))
    });

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
