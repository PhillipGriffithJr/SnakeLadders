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
//  let mysql = require('mysql');

//  let con = mysql.createConnection({
//      host: "mydbinstance.c6iimmll2gpn.us-east-1.rds.amazonaws.com",
//      database: "GameLS",
//      user: "masteruser",
//      password: "p455w0rd",
//      debug: "true"
//  });

//  con.connect(function(err) {
//     if(err) throw err;
//     console.log("connected!");
//  });

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
     let playerID = req.body.playerID;
     let player = req.body.playerName;
     let moveNumber = req.body.moveNumber;
     let currentSpace = req.body.currentSpace;
     let rollResult = req.body.rollResult;
     let resultingSpace = req.body.resultingSpace;
     let didWarpMove = req.body.didWarpMove;
     let finalSpace = req.body.finalSpace;
     let rolled6 = req.body.rolled6;

     let insertQuery = "INSERT INTO Moves (playerID, player, moveNumber, currentSpace, rollResult, resultingSpace, didWarpMove, finalSpace, rolled6) VALUES (" + playerID + ", '" + player + "', " + moveNumber + ", " + currentSpace + ", " + rollResult + ", " + resultingSpace + ", " + didWarpMove + ", " + finalSpace + ", " + rolled6 + ")";

     //insert the move into the table
     con.query(insertQuery, function(err, result) {
        if(err) throw err;

        res.send("Move Insertion Complete");
     });
 });

 /**
  * Handles get requests from the client.
  * Will fetch data from the database to send to the client
  */
 app.get('/', function(req,res) {
    //Get Code Here
 });

 app.listen(3000);