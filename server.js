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

io = require('socket.io').listen(arbitrary);

var pressureCeasefireU = new Action({available: true, done: false, text: "Push for Ceasefire!", details: "Pressure the friendly Ukrainian Government to enforce a ceasefire. Conflict will deescalate, but friendly forces will be vulnerable to a surprise attack.", impact: {influenceOne: -0.2, momentumOne: -0.5, escalation: -0.1}});
var pressureCeasefireR = new Action({available: true, done: false, text: "Push for Ceasefire!", details: "Pressure the friendly Separatist Republics to enforce a ceasefire. Conflict will deescalate, but friendly forces will be vulnerable to a surprise attack.", impact: {influenceTwo: -0.2, momentumTwo: -0.5, escalation: -0.1}});
var armUkraine = new Action({available: true, done: false, text: "Arm Ukraine!", details: "Send weapons to help the friendly Ukrainian Government win the war. Friendly forces will make more progress, but the conflict will escalate.", impact: {influenceOne: 0.2, momentumOne: 1, escalation: 0.2}});
var armSeparatists = new Action({available: true, done: false, text: "Arm Separatists!", details: "Send weapons to help the friendly Separatist Republics win the war. Friendly forces will make more progress, but the conflict will escalate.", impact: {influenceTwo: 0.2, momentumTwo: 1, escalation: 0.2}});
var condemnRussia = new Action({available: true, done: false, text: "Condemn Russia!", details: "Accuse Russia of bad things at the UN. Your influence will rise, but conflict will escalate.", impact: {influenceOne: 0.5, escalation: 0.1}});
var condemnUS = new Action({available: true, done: false, text: "Condemn USA!", details: "Accuse the United States of bad things at the UN. Your influence will rise, but conflict will escalate.", impact: {influenceTwo: 0.5, escalation: 0.1}});
var sendTroopsU = new Action({available: true, done: false, text: "Launch Airstrikes!", details: "Directly attack Separatist forces. Friendly troops will make more progress, but the war will escalate greatly.", impact: {influenceOne: 0.5, momentumOne: 2, escalation: 0.5}});
var sendTroopsR = new Action({available: true, done: false, text: "Send Tanks!", details: "Directly attack Ukrainian forces. Friendly troops will make more progress, but the war will escalate greatly.", impact: {influenceTwo: 0.5, momentumTwo: 2, escalation: 0.5}});

var usa = new Team({title: "USA", leader: "Barack Obama", regimeType: "democratic", strength: 9, baseApproval: 4, baseInfluence: 8, actions: [pressureCeasefireU, armUkraine, condemnRussia, sendTroopsU]});
var russia = new Team({title: "Russia", leader: "Vladimir Putin", regimeType: "autocratic", strength: 6, baseApproval: 7, baseInfluence: 5, actions: [pressureCeasefireR, armSeparatists, condemnUS, sendTroopsR]});
//var prc = new Team({title: "China", leader: "Xi Jinping", regimeType: "autocratic", strength: 7, baseApproval: 5, baseInfluence: 6}); //context for other values


var ukraine = new Scenario({title: "Ukrainian Civil War", teamOne: usa, teamTwo: russia, introOne: "Heavily armed separatists have seized control of cities in Eastern Ukraine. We believe they are backed by the Russian government. We have to do something to prevent this country from being torn apart! The Ukrainian government is commencing an anti-terrorist operation.", introTwo: "The CIA has overthrown the Ukrainian government! We must act to protect the Russians in the east of the country before they're crushed by the coup leaders. After all, Ukraine was historically part of Russia anyway.", startParameters: new Situation({active: false, escalation: 0.3, balance: 5, momentumOne: 2, momentumTwo: 1.5, approvalOne: usa.baseApproval, approvalTwo: russia.baseApproval, influenceOne: usa.baseInfluence, influenceTwo: russia.baseInfluence}), strengthOne: usa.strength, strengthTwo: russia.strength});

var updateSituation = function(target, impact, callback){
	target.momentumOne += impact.momentumOne;
	target.momentumTwo += impact.momentumTwo;
	target.escalation += impact.escalation;
	target.influenceOne += impact.influenceOne;
	target.influenceTwo += impact.influenceTwo;
	callback();
}

var checkResults = function(scenario, situation, callback){
	if (scenario.title == "Ukrainian Civil War"){
		if (situation.balance >= 10){
			//Ukraine has suppressed the Russian-backed separatists
		} else if (situation.balance <= 0){
			//The separatatists have reached Kiev and overthrown the fascist junta
		} else if (situation.escalation >= 2){
			//ww3
		}
	}
	// on action, check for particular combinations of values in the situation (after the action is implemented) that fulfill victory or defeat conditions for either side. For instance, if Russia's influence is at any point higher than (equal to?) US influence, Putin smirks. If Russian approval ever reaches zero, Putin is overthrown (if US influence is high, Russia gains a new democratic government; if low, Russia falls into chaos). If escalation ever reaches zero, there's peace in Ukraine, and no one loses. If escalation ever exceeds ten, there's an accidental nuclear launch and everyone dies. If the balance ever reaches zero or ten, one side or the other wins the war completely, making their backer happy. Every action MUST have a timer, otherwise spam-to-victory is possible (timer is shorter when influence and approval are high, and longer when influence and approval are low)
};

io.on('connection', function(socket){

  console.log("user connected");
  Room.find(function(err, rooms){
  	socket.emit('allRooms', rooms);
  });

  socket.on('disconnect', function(){ //logs disconnect; sockets leave room automatically on disconnect; on disconnect
		// find rooms where user is connected; set teams to "" if they match socket.id
		console.log("disconnect initiated!");
  	Room.findOne({oneFill: socket.id}, function(err, foundRoom){
  		if (foundRoom){
  			foundRoom.oneFill = "";
  			foundRoom.users--;
  			foundRoom.save();
  			if (foundRoom.users == 0){
  				foundRoom.remove();
  				console.log("room deleted");
  			}
  		}
  	});
  	Room.findOne({twoFill: socket.id}, function(err, foundRoom){
  		if (foundRoom){
  			foundRoom.twoFill = "";
  			foundRoom.users--;
  			foundRoom.save();
  			if (foundRoom.users == 0){
  				foundRoom.remove();
  				console.log("room deleted");
  			}
  		}
  	});
    console.log('user disconnected');//send message to other user in room
  });

	socket.on('subscribe', function(room) {
    console.log('seeking room: ' + room);
    Room.findOne({_id: room}, function(err, foundRoom){
    	if (foundRoom.users == 1){
  		  console.log('joining room: ' + room);
  		  socket.join(room);
  		  foundRoom.users++;
  		  if (foundRoom.oneFill && !foundRoom.twoFill){
  		  	thisUser = new User({room: foundRoom._id, team: 'teamTwo', faction: russia});
    			console.log("assigned user Team RUS");
    			foundRoom.twoFill = socket.id;
  		  } else if (foundRoom.twoFill && !foundRoom.oneFill){
  		  	thisUser = new User({room: foundRoom._id, team: 'teamOne', faction: usa});
    			console.log("assigned user Team USA");
    			foundRoom.oneFill = socket.id;
    		} else {
    			console.log(foundRoom);
    			console.log("else happened");
    		}
	 	  	socket.emit('positiveConfirmation', {scenario: foundRoom.scenario, user: thisUser});
	 	  	console.log("emit positive confirmation");
    	} else {
    		socket.emit('negativeConfirmation');
 	  		console.log("emit negative confirmation");
 	  		socket.leave(room)
    	}
    	foundRoom.save();//callback error handling later
    })
    socket.join(room); //room comes from button; room users +=1
    
    //assign free team, scenario
    //pos/neg confirmation
    //timer associated, eventually
    //set room start to true; switch started/finished to situation
	});

	socket.on('newRoom', function(data) {
    console.log("new room!");
    var newRoom = new Room({users: 1, scenario: ukraine, situation: new Situation(ukraine.startParameters), oneFill: data.onF ? socket.id : "", twoFill: data.twF ? socket.id : "", started: false, finished: false});
    newRoom.save();
    // no rush on server-side timer; non-MVP
    socket.join(newRoom._id);
    var thisUser;
    if (data.onF){
    	thisUser = new User({room: newRoom._id, team: 'teamOne', faction: usa});
    	console.log("assigned user Team USA");
    } else if (data.twF){
    	thisUser = new User({room: newRoom._id, team: 'teamTwo', faction: russia});
    	console.log("assigned user Team RUS");
    }
    if (newRoom) {
 	  	socket.emit('positiveConfirmation', {scenario: newRoom.scenario, user: thisUser});
 	  	console.log("emit positive confirmation");	
 	  } else {
 	  	socket.emit('negativeConfirmation');
 	  	console.log("emit negative confirmation");
 	  	socket.leave(newRoom._id);
 	  }
 	  //
	});

	socket.on('action', function(data){
    Room.findOne({_id: data.room}, function(err, foundRoom){
    	console.log(foundRoom.situation[0]);
    	updateSituation(foundRoom.situation[0], data.impact, function(){
    		foundRoom.save(function(){
    			io.to(data.room).emit('intel', foundRoom.situation[0]);
    		});
    	});
    });
	});

	socket.on('unsubscribe', function(room) {
    console.log('leaving room');
    console.log(socket.id);
    socket.leave(room);
    Room.findOne({oneFill: socket.id}, function(err, foundRoom){
  		if (foundRoom.users < 2){
				foundRoom.remove();
				console.log("room deleted");
			} else if (foundRoom){
  			foundRoom.oneFill = "";
  			foundRoom.users--;
  			foundRoom.save();
  		}
  	});
  	Room.findOne({twoFill: socket.id}, function(err, foundRoom){
  		if (foundRoom.users < 2){
				foundRoom.remove();
				console.log("room deleted");
			} else if (foundRoom){
  			foundRoom.twoFill = "";
  			foundRoom.users--;
  			foundRoom.save();
  		}
  	});
	});

	socket.on('userMessage', function(data) {
  	console.log(data);
  	Room.findOne({_id: data.room}, function(err, foundRoom){
  		foundRoom.messages.push(new Message(data.message));
  		foundRoom.save();
  		console.log(foundRoom.messages);
  		io.to(data.room).emit('allMessages', foundRoom.messages);
  	})
	});
});
console.log("server started");