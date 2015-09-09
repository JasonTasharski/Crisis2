
var app = angular.module('crisisApp', ['ngRoute', 'ngResource','crisisApp.controllers']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider.
    	when('/', {
        	templateUrl: 'views/templates/splash.html',
        	controller: 'MainCtrl'
        })
        .when('/crisis', {
        	templateUrl: 'views/templates/crisis.html',
        	controller: 'CrisisCtrl'
        })
        .when('/wait', {
          templateUrl: 'views/templates/wait.html',
          controller: 'MainCtrl'
        })
        .when('/sorry', {
          templaterl: 'views/templates/sorry.html',
          controller: 'MainCtrl'
        })
        .otherwise({
        	redirectTo: '/'
        });
        // if user.room, redirect to /crisis; if !user.room, redirect to /?
        // Get rid of '#' in URL, may only work with server
        // use the HTML5 History API
		$locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});

}]);
var socket = io.connect('http://localhost:8080');
var currentUser = new User();