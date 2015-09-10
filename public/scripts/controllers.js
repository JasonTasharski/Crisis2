var app = angular.module('crisisApp.controllers', ['ngRoute', 'ngResource']);

app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
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
	  console.log("emit new room; waiting...");
	  $scope.$apply(function(){
		  $location.url("/wait");
		});
	}
	$scope.joinRoom = function(room) {
		console.log(room);
	  socket.emit('subscribe', room);
	  $scope.$apply(function(){
		  $location.url("/wait");
		});
	}
	socket.on('positiveConfirmation', function (data){
		console.log("received positive confirmation");
		currentUser = data.user;
		clientScenario = data.scenario;
		$scope.$apply(function(){
			$location.url("/crisis");
		});
	});
	socket.on('negativeConfirmation', function(){
		console.log("received negative confirmation");
		$scope.$apply(function(){
			$location.url("/sorry");
		});
	});
}]);

app.controller('CrisisCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {
	$scope.leaveRoom = function(room) {
		// resign; update room to finished, set ending to "user.team resignation", give other user that screen
		// on server side, set room to users -= 1; if > 0, other user gets win message; if 0, delete room
		currentUser = null;
		clientScenario = null;
	  socket.emit('unsubscribe', room);
	  $scope.$apply(function(){
		  $location.url("/");
		});
	}
	$scope.act = function(room, target, actionType){
		socket.emit('action', {room: 'roomOne', target: target, actionType: actionType});
	}
	socket.on('intel', function(data){
		$scope.$apply(function(){
			$scope.intel = data.content;
		});
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
	});
}]);