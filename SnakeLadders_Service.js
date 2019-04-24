/*
 * Phillip Griffith Jr
 * Snakes and Ladders Game
 * SnakeLadders_Service.js
 * CS 346 
 */

 "use strict";

 //The following code sets up the service to connect to the database
 //and for it to accept requests from the client and complete requests
 //on behalf of the client
 let mysql = require('mysql');

 let con = mysql.createConnection({
     host: "mydbinstance.c6iimmll2gpn.us-east-1.rds.amazonaws.com",
     database: "GameLS",
     user: "masteruser",
     password: "p455w0rd",
     debug: "true"
 });

 con.connect(function(err) {
    if(err) throw err;
    console.log("connected!");
 });

 let express = require("express");
 const app = express();
 const fs = require('fs');

 const bodyParser = require('body-parser');
 const jsonParser = bodyParser.json();

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

 app.use(express.static('public'));


//--------------------------------------------------------
//Server code to handle queries and parts of the game logic (i.e figure out who the turn player is)

//Set up the server for multiplayer connections
const WebSocket = require('ws');
const WebSocketServer = new WebSocket.Server({port: 8080});
let conNum = 0;
let connections = [];

WebSocketServer.on('connection', client => {
   connections.push(client);
   client.send(conNum);
   conNum++;
   client.on('message', message => {
        let msg = JSON.parse(message);
        console.log("received a message from client " + msg.cid);
        if(msg.cid == "0") {
            connections[1].send(JSON.stringify(msg));
        } 
        else {
            connections[0].send(JSON.stringify(msg));
        }
   });
});

 /**
  * Handles post requests from the client.
  * Will send data to the database for storage
  */
 app.post('/', jsonParser, function(req,res) {
     let name = req.body.player;
     let result = req.body.win;
     let moves = req.body.numMoves;
     let insert = null;

     console.log(name);

     //the player won
     if(result == true) {
         insert = "INSERT INTO playerStats (playerName, gamesWon, gamesPlayed, lastTimePlayed, moveHS) VALUES ('" + name + "', 1, 1, CURDATE(), " + moves + ") ON DUPLICATE KEY UPDATE gamesWon = gamesWon + 1, gamesPlayed = gamesPlayed + 1, lastTimePlayed = CURDATE(), moveHS = IF(" + moves + " < moveHS, " + moves + ", moveHS)";
     }
     else {
         insert = "INSERT INTO playerStats (playerName, gamesWon, gamesPlayed, lastTimePlayed) VALUES ('" + name + "', " + "0, 1, CURDATE()) ON DUPLICATE KEY UPDATE gamesPlayed = gamesPlayed + 1";
     }

     //insert the result into the table
     con.query(insert, function(err, result) {
        if(err) throw err;

        res.send("Move Insertion Complete");
     });
 });

 app.listen(3000);