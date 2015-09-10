var app = angular.module('crisisApp.controllers', ['ngRoute', 'ngResource']);


app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {

	socket.on('allRooms', function(data){
		$scope.$apply(function(){
			$scope.allRooms = data;
		});
	});

	$scope.createRoom = function() {
		var teamPick;
		if (Math.random() > 0.5){
			teamPick = {onF: true, twF: false};
		} else {
			teamPick = {onF: false, twF: true};
		}
	  socket.emit('newRoom', teamPick);
	  console.log("emit new room; waiting...");
	  $location.url("/wait");
	}

	$scope.joinRoom = function(room) {
		console.log(room);
	  socket.emit('subscribe', room);
	  $location.url("/wait");
	}

	socket.on('positiveConfirmation', function (data){
		console.log("received positive confirmation");
		currentUser = data.user;
		clientScenario = data.scenario;
		startCrisis = data.startCrisis;
		$location.url("/crisis");
	});

	socket.on('negativeConfirmation', function(){
		console.log("received negative confirmation");
		$location.url("/sorry");
	});
}]);


app.controller('CrisisCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {

	$scope.playerName = currentUser.faction[0].leader;
	$scope.actionList = currentUser.faction[0].actions;

	$scope.leaveRoom = function(room) {
		// resign; update room to finished, set ending to "user.team resignation", give other user that screen
		// on server side, set room to users -= 1; if > 0, other user gets win message; if 0, delete room
		currentUser = null;
		clientScenario = null;
	  socket.emit('unsubscribe', room);
	  $location.url("/");
	}

	$scope.act = function(action){
		console.log(action.impact);
		socket.emit('action', {room: currentUser.room, impact: action.impact});
		// set action to done, unavailable
	}

	socket.on('intel', function(data){
		console.log("received intel");
		console.log(data);
		if (data.introOne && (currentUser.team == 'teamOne')){
			$scope.intel = data.introOne;
		} else if (data.introOne && (currentUser.team == 'teamTwo')){
			$scope.intel = data.introTwo;
		} else {
			$scope.$apply(function(){
				$scope.intel = data;
			});
		}
	});

	$scope.sendMessage = function(){
		console.log(currentUser);
		socket.emit('userMessage', {room: currentUser.room, message: {from: currentUser.faction[0].leader, content: $scope.msg}});
		$scope.msg = "";
	}

	socket.on('allMessages', function(data){
		$scope.$apply(function(){
			console.log(data);
			$scope.conversation = data;
		})
		if (!startCrisis){
			startCrisis = true;
		}
	});
}]);