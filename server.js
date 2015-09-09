var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),  // for data from the request body
    mongoose = require('mongoose'),
    Situation = require('./models/situation.js'),
    Action = require('./models/action.js'),
    Intel = require('./models/intel.js'),
    Team = require('./models/team.js'),
    Scenario = require('./models/scenario.js'),
    Message = require('./models/message.js');  // to interact with our db

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/test'
);

// configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set location for static files
app.use(express.static(__dirname + '/public'));

// load public/index.html file (angular app)
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

var arbitrary = app.listen(process.env.PORT || 8080, function(){
  console.log("server listening ");
});

var usa = new Team(text: "USA", leader: "Barack Obama", regimeType: "democratic", strength: 9, baseApproval: 4, baseInfluence: 8);
var russia = new Team(text: "Russia", leader: "Vladimir Putin", regimeType: "autocratic", strength: 6, baseApproval: 7, baseInfluence: 5);
var prc = new Team(text: "China", leader: "Xi Jinping", regimeType: "autocratic", strength: 7, baseApproval: 5, baseInfluence: 6); //context for other values

var ukraine = new Scenario(title: "Ukrainian Civil War", teamOne: usa, teamTwo: russia, introOne: "Heavily armed separatists have seized control of cities in Eastern Ukraine. We believe they are backed by the Russian government. We have to do something to prevent this country from being torn apart! The Ukrainian government is commencing an anti-terrorist operation.", introTwo: "The CIA has overthrown the Ukrainian government! We must act to protect the Russians in the east of the country before they're crushed by the coup leaders. After all, Ukraine was historically part of Russia anyway.", startParameters: new Situation(active: false, escalation: 3, balance: 5, momentumOne: 2, momentumTwo: 1.5, approvalOne: usa.baseApproval, approvalTwo: russia.baseApproval, influenceOne: usa.baseInfluence, influenceTwo: russia.baseApproval), strengthOne: usa.strength, strengthTwo: russia.strength);

io = require('socket.io').listen(arbitrary);
io.on('connection', function(socket){
  console.log("user connected"); //log
  // socket.join('roomOne'); // joins a specfic room; use a variable so that the user is joining a specific room
  socket.on('disconnect', function(){ //logs disconnect; sockets leave room automatically on disconnect
    console.log('user disconnected');
  });
	socket.on('subscribe', function(room) {
    console.log('joining room', room);
    socket.join(room);
    console.log(io.sockets);
	});
	socket.on('newRoom', function(data) {
    new Room(users: 1, scenario: ukraine, situation: new Situation(ukraine.startParameters), oneFill: data.onF, twoFill: data.twF, started: false, finished: false);
    socket.join(room);
    console.log(io.sockets);
    
	});
	socket.on('action', function(data){
		console.log("received action");
		if (data.actionType == "condemn") {
			if (data.target == "teamTwo") {
				io.to(data.room).emit('intel', {content: "Obama: 'Fuck you, Putin!' "});
				console.log("emit intel");
			} else if (data.target == "proxTwo") {
				io.to(data.room).emit('intel', {content: "Obama: 'Fuck you, Separatists!' "});
				console.log("emit intel");
			}
		} else if (data.actionType == "praise"){
			if (data.target == "proxOne"){
				io.to(data.room).emit('intel', {content: "Obama: 'You rock, Ukrainians!' "});
				console.log("emit intel");
			}
		}
	});
	socket.on('unsubscribe', function(room) {
    console.log('leaving room', room);
    socket.leave(room);
	});
	var allMessages = [];
	socket.on('userMessage', function(data) {
  	console.log(data);
  	allMessages.push(new Message(data));
  	console.log(allMessages);
    io.to(data.room).emit('allMessages', allMessages);
	});
});
console.log("server started");
// nichts unter! nichts! NICHTS! NEIN NEIN NEIN NEIN NEIN NEIN NEIN NEIN NEIn


// NOTES NOTES NOTES NOTES NOTES
// client - createRoom()
	// emit newRoom
	//server on newR
	//	create room in db
	// room id
	//emit roomcreated+id

	//splash!
	//join this.id(ngclick = joinR(room_id))