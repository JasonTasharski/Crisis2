var app = angular.module('crisisApp.controllers', ['ngRoute', 'ngResource']);

app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
	// $scope.allRooms;
	socket.on('allRooms', function(data){
		$scope.$apply(function(){
			$scope.allRooms = data;
			console.log($scope.allRooms);			
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
	  //main page will show room in list (no code for that here)
	  //redirect to crisis page; populate with data from room
	  console.log("emit new room; waiting...");
	  $location.url("/wait");
	}
	$scope.joinRoom = function(room) {
		console.log(room);
	  socket.emit('subscribe', room);
	  //remove from list
	  $location.url("/wait");
	}
	socket.on('positiveConfirmation', function (data){
		console.log("received positive confirmation");
		currentUser = data.user;
		clientScenario = data.scenario;
		$location.url("/crisis");// test $apply TODO TODO TODO TODO!!!!!
	});
	socket.on('negativeConfirmation', function(){
		console.log("received negative confirmation");
		$location.url("/sorry");
	});
}]);

app.controller('CrisisCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {
	// $scope.$route = $route;
	$scope.leaveRoom = function(room) {
		// resign; update room to finished, set ending to "user.team resignation", give other user that screen
		// on server side, set room to users -= 1; if > 0, other user gets win message; if 0, delete room
		currentUser = null;
		clientScenario = null;
	  socket.emit('unsubscribe', room);
	  //main page will show room in list (no code for that here)
	  //redirect to crisis page; populate with data from room
	  $location.url("/");
	}
	$scope.act = function(room, target, actionType){
		socket.emit('action', {room: 'roomOne', target: target, actionType: actionType});
	}
	socket.on('intel', function(data){
		$scope.$apply(function(){
			$scope.intel = data.content;
		});
	});
	$scope.sendMessage = function(room, from, content){
		socket.emit('userMessage', {room: 'roomOne', from: 'teamOne', content: $scope.msg});
		$scope.msg = "";
	}
	socket.on('allMessages', function(data){
		$scope.$apply(function(){
			$scope.conversation = data;
		})
	});
}]);