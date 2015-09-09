var app = angular.module('crisisApp.controllers', ['ngRoute', 'ngResource']);

app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
	$scope.createRoom = function() {
		var teamPick;
		if (Math.random() > 0.5){
			currentUser.team = "teamOne";
			teamPick = {onF: true, twF: false};
		} else {
			currentUser.team = "teamTwo";
			onF = false;
			twF = true;
		}
	  socket.emit('newRoom', teamPick);
	  //main page will show room in list (no code for that here)
	  //redirect to crisis page; populate with data from room
	  $location.url("/wait");
	}
	$scope.joinRoom = function(room) {
	  socket.emit('subscribe', room);
	  //remove from list
	  $location.url("/wait");
	}
	$scope.positiveConfirmation = function(room) {
		$location.url("/crisis");
	}
	$scope.negativeConfirmation = function(){
		$location.url("/sorry");
	}
}]);

app.controller('CrisisCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {
	// $scope.$route = $route;
	$scope.leaveRoom = function(room) {
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