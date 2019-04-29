"use strict"; 

let mysql = require ('mysql'); 

let con = mysql.createConnection({
	host: "mydbinstance.c6iimmll2gpn.us-east-1.rds.amazonaws.com", 
	database: "GameLS",
	user: "masteruser",
	password: "p455w0rd",
	port: "3306",
	debug: "true"
});

con.connect(function(err) {
	if(err) throw err; 

	console.log("connected!");
});

let express = require("express");
const app = express();
const fs = require ('fs'); 

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header",
		"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public')); 

app.get('/', function(req, res){
	res.header("Access-Control-Allow-Origin","*");

	let query = "select * from playerStats";
	con.query(query, function(err, result){
		if(err) throw err; 
		res.send(JSON.stringify(result));
	});
});

app.listen(3000);