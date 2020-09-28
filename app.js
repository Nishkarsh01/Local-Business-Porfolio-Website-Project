//req packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mailgun = require("mailgun-js");
const mongoose = require('mongoose');
require('dotenv').config();

//setting app to use express
const app = express();

//setting up the view engine
app.set('view engine', 'ejs');

//setting up the public folder 
app.use(express.static("public"));

//allowing app to use bodyparser
app.use(bodyParser.urlencoded({
    extended: true
}));


var posts=[];
var id =0;

//get requests
app.get("/", (req, res)=>{
    res.render("index.ejs");
});


app.get("/thankyou", function (req, res) {
	res.send("Thank You, Your Message has been Sent.")

});
app.get("/failed", function (req, res) {
	res.send("So Failed to send your message. Sorry for the inconvenience, please do try again.");
	 
});

app.get("/gallery", function (req, res) {
	
res.render("gallery.ejs",{
	postArray: posts
});
	
});

app.get("/compose", function(req, res){
	res.render("compose.ejs");
} );


//post requests
app.post("/", (req, res)=>{
var name= req.body.name;
var email= req.body.email;
var message= req.body.message;
var number = req.body.number;

    
const mailgun = require("mailgun-js");
const DOMAIN = 'YOUR_DOMAIN_NAME';
const mg = mailgun({apiKey: process.env.MYAPIKEY, domain: process.env.DOMAIN});
const data = {
	from: email,
	to: 'workwebsitenaresh@gmail.com',
	subject: 'potiential customer',
	text: message+ " [Sent by: { "+" Name: "+ name+ ", Number: "+ number+", Email: " + email+" }]"
};
mg.messages().send(data, function (error, body) {
	if(!error){
		console.log(body);	
		name="";
		email="";
		message="";
		number="";
		res.redirect("/thankyou")
	}
	else{
		res.redirect("/failed");
	}

});



});

app.post("/compose", function(req, res){
	var heading=req.body.heading;
	var date=req.body.date;
	var client=req.body.client;
	var category=req.body.category;
	var link=req.body.link;
	var message=req.body.message;

	var newPost ={
		heading: heading,
		date: date,
		client: client,
		category: category,
		link: link,
		message: message,
		id: id++
	}

	posts.push(newPost);

	res.redirect("/gallery");


} );

//making app to listen to reqs on port 3000 or any port
app.listen(3000, ()=>{
    console.log("server running on port 3000");
})


