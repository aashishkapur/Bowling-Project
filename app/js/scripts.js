var bowlingApp = angular.module("bowlingApp",
	[
		'ngRoute',
		'ngResource', 
		'bowlingApp.controllers',
		'bowlingApp.factory',
		'bowlingApp.services',
		'angular-loading-bar'
	]);

// angular.module('bowlingApp', [''])

bowlingApp.config(function($routeProvider, loginCredsProvider) {

	 // $provide.service('loginCreds',function(){

	 // });

	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl : 'pages/login.html',
			controller  : 'loginController'
		})

		// route for the about page
		.when('/leagues', {
			templateUrl : 'pages/leagues.html',
			controller  : 'leaguesController',
			resolve: {
				data: function(loginCreds){
					console.log("isUserLoggedIn at route provider: " + loginCreds.signedIn());
					if(!loginCreds.signedIn())
					{
						window.location.href = "index.html";

						// change location somehow if not logged in
						// $location.path('/');
					}
				}

			}
		})

		// route for the contact page
		.when('/c', {
			templateUrl : 'pages/c.html',
			controller  : 'contactController'
		});
});



