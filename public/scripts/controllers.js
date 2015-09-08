var app = angular.module('crisisApp.controllers', ['ngRoute', 'ngResource']);

app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
	$scope.createRoom = function(room) {
	  socket.emit('newRoom', room);
	  console.log("created a fuckin' room")
	  //main page will show room in list (no code for that here)
	  //redirect to crisis page; populate with data from room
	  $location.url("/crisis");
	}
	$scope.joinRoom = function(room) {
	  socket.emit('subscribe', room);
	  console.log("joined a fuckin' room")
	  //remove from list
	  $location.url("/crisis");
	}
}]);

app.controller('CrisisCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {
	// $scope.$route = $route;
	$scope.leaveRoom = function(room) {
	  socket.emit('unsubscribe', room);
	  console.log("left a fuckin' room")
	  //main page will show room in list (no code for that here)
	  //redirect to crisis page; populate with data from room
	  $location.url("/");
	}
	$scope.act = function(room, target, actionType){
		socket.emit('action', {room: 'roomOne', target: target, actionType: actionType});
		console.log("made an action!");
	}
	socket.on('intel', function(data){
		$scope.$apply(function(){
			$scope.intel = data.content;
		});
		console.log("received intel!");
		console.log(data.content);
	});
	$scope.sendMessage = function(room, from, content){
		socket.emit('userMessage', {room: 'roomOne', from: 'teamOne', content: $scope.msg});
		console.log("sent a message!");
		$scope.msg = "";
	}
	var conversation;
	socket.on('allMessages', function(data){
		conversation = data;
		console.log(conversation);

		//$scope.conversation
	});
}]);