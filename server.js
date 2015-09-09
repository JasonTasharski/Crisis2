var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),  // for data from the request body
    mongoose = require('mongoose'),
    Situation = require('./models/situation.js'),
    Action = require('./models/action.js'),
    Intel = require('./models/intel.js'),
    Team = require('./models/team.js'),
    Scenario = require('./models/scenario.js'),
    Room = require('./models/room.js'),
    User = require('./models/user.js'),
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

var usa = new Team({title: "USA", leader: "Barack Obama", regimeType: "democratic", strength: 9, baseApproval: 4, baseInfluence: 8});
var russia = new Team({title: "Russia", leader: "Vladimir Putin", regimeType: "autocratic", strength: 6, baseApproval: 7, baseInfluence: 5});
var prc = new Team({title: "China", leader: "Xi Jinping", regimeType: "autocratic", strength: 7, baseApproval: 5, baseInfluence: 6}); //context for other values

var ukraine = new Scenario({title: "Ukrainian Civil War", teamOne: usa, teamTwo: russia, introOne: "Heavily armed separatists have seized control of cities in Eastern Ukraine. We believe they are backed by the Russian government. We have to do something to prevent this country from being torn apart! The Ukrainian government is commencing an anti-terrorist operation.", introTwo: "The CIA has overthrown the Ukrainian government! We must act to protect the Russians in the east of the country before they're crushed by the coup leaders. After all, Ukraine was historically part of Russia anyway.", startParameters: new Situation({active: false, escalation: 3, balance: 5, momentumOne: 2, momentumTwo: 1.5, approvalOne: usa.baseApproval, approvalTwo: russia.baseApproval, influenceOne: usa.baseInfluence, influenceTwo: russia.baseApproval}), strengthOne: usa.strength, strengthTwo: russia.strength});

var checkResults = function(situation){
	// assume Ukraine.
	// on action, check for particular combinations of values in the situation (after the action is implemented) that fulfill victory or defeat conditions for either side. For instance, if Russia's influence is at any point higher than (equal to?) US influence, Putin smirks. If Russian approval ever reaches zero, Putin is overthrown (if US influence is high, Russia gains a new democratic government; if low, Russia falls into chaos). If escalation ever reaches zero, there's peace in Ukraine, and no one loses. If escalation ever exceeds ten, there's an accidental nuclear launch and everyone dies. If the balance ever reaches zero or ten, one side or the other wins the war completely, making their backer happy. Every action MUST have a timer, otherwise spam-to-victory is possible (timer is shorter when influence and approval are high, and longer when influence and approval are low)
};

io = require('socket.io').listen(arbitrary);
io.on('connection', function(socket){
  console.log("user connected"); //log
  //emit rooms
  // socket.emit('allRooms', db.rooms);
  // socket.join('roomOne'); // joins a specfic room; use a variable so that the user is joining a specific room
  socket.on('disconnect', function(){ //logs disconnect; sockets leave room automatically on disconnect; on disconnect
    console.log('user disconnected');//send message to other user in room
  });
	socket.on('subscribe', function(room) {
    console.log('joining room', room);
    socket.join(room); //room comes from button; room users +=1
    console.log(io.sockets);//assign free team, scenario
    //pos/neg confirmation
    //timer associated, eventually
    //set room start to true; switch started/finished to situation
	});
	socket.on('newRoom', function(data) {
    console.log("new room!");
    var newRoom = new Room({users: 1, scenario: ukraine, situation: new Situation(ukraine.startParameters), oneFill: data.onF, twoFill: data.twF, started: false, finished: false});
    // db.rooms.save(newRoom);
    // no rush on server-side timer; non-MVP
    socket.join(newRoom.id);
    var thisUser;
    if (data.onF){
    	thisUser = new User({room: newRoom.id, team: 'teamOne', faction: usa});
    	console.log("assigned user Team USA");
    } else if (data.twF){
    	thisUser = new User({room: newRoom.id, team: 'teamTwo', faction: russia});
    	console.log("assigned user Team RUS");
    }
    console.log(socket);
    //console.log(io.sockets);
    if (newRoom) {
 	  	socket.emit('positiveConfirmation', {scenario: newRoom.scenario, user: thisUser});
 	  	console.log("emit positive confirmation");	
 	  } else {
 	  	socket.emit('negativeConfirmation');
 	  	console.log("emit negative confirmation");
 	  }
 	  //
	});
	socket.on('action', function(data){ //on action, update situation; when situation is done updating, emit updated situation and let the other stuff work itself out client-side
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
    // update room users -= 1;
    // if rooms 
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