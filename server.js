const config = require('./config.js');
const express = require("express");
const app = express();
const port = 8000;


const { Pool, Client } = require("pg");

const client = new Client(config.devDB);
client.connect();

app.get("/", (req, res) => {
  client.query("SELECT NOW()", (err, response) => {
    console.log(err, response);
    res.send(response.rows[0]);
    client.end();
  });
});

app.listen(port, () => console.log("Listening on port " + port));
