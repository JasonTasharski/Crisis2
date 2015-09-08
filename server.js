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
	socket.on('newRoom', function(room) {
    console.log('joining room', room);//seed room with scenario, seed scenario with teams and situation
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


