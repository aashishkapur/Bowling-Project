var testApp = angular.module('testApp', ['ngRoute']);

// configure our routes
testApp.config(function($routeProvider) {
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl : 'pages/a.html',
			controller  : 'mainController'
		})

		// route for the about page
		.when('/b', {
			templateUrl : 'pages/b.html',
			controller  : 'aboutController'
		})

		// route for the contact page
		.when('/c', {
			templateUrl : 'pages/c.html',
			controller  : 'contactController'
		});
});

// create the controller and inject Angular's $scope
testApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

testApp.controller('aboutController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

testApp.controller('contactController', function($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
});