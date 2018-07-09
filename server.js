const config = require("./config.js");
const express = require("express");
const bodyParser = require('body-parser')
var request = require('request');
const app = express();
const port = 8000;
const server = require("http").createServer(app);
server.listen(8004);
const io = require("socket.io")({}).listen(server);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static("./public"));

app.use(function(req, res, next) {
  const origin = req.get("origin");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );

  // intercept OPTIONS method
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    console.log(origin + " grrr");
    next();
  }
});

const { Pool, Client } = require("pg");

const client = new Client(config.devDB);
client.connect();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Grabs all devices for initial rendered in React.
app.post("/logDeviceStatus", (req, res) => {
    console.log('status here!')
     console.log(req.body)
    res.send('got it!')
});

app.post("/getAllDevices", (req, res) => {
    client.query('SELECT * FROM "houseDB".devices', (err, response) => {
      res.send(response.rows);
    });
  });
//Takes the commands for shutter devices.
app.post("/shutters", (req, res) => {
   
    //The command will be added to the end of the request URL.
    let command = req.query.command

    //The device ID is sent from the front end and used to query the Database to grab the device IP.
   const query = {
    text: 'SELECT "ipAddress" FROM "houseDB".devices WHERE "deviceID" = $1',
    values: [req.query.deviceID]
  };

  client.query(query, (err, response) => {
    let targetDeviceIP = response.rows[0].ipAddress.trim();

    //The IP and command are combined in a URL string. This talks to the server on the device.
    //The device does not respond directly to this request, sends it's new state to be written to
    //the database. This change is then emitted via socket.io to all clients.
    shutterCommand(targetDeviceIP, command)
    res.send('success!')
  });
});

var socketClient = new Client(config.devDB);
socketClient.connect();
socketClient.query("LISTEN watchers");

io.on("connection", socket => {
  console.log("connected");
  socketClient.on("notification", function(data) {
    console.log("waat");
    console.log(data);
    socket.emit("updateDevice", JSON.parse(data.payload));
  });
});

app.listen(port, () => console.log("Listening on port " + port));


function shutterCommand(targetIP,command){
    let targetString = ('http://' + targetIP + '/' + command)
    console.log(targetString)
request(targetString, function (error, response, body) {
  console.log('error:', error); 
  console.log('statusCode:', response && response.statusCode); 
  console.log('body:', body); 
});

}
