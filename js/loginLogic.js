var email = "", pass = "";

function getAuth()
{
	return btoa(email + ":" + pass);
}

function setAuth(email, pass)
{
	this.email = email;
	this.pass = pass; 
}

var testApp = angular.module('BowlingApp', ['ngResource']);

testApp.controller('mainController', function($scope, User) {
	$scope.message="asdagdvfshbjk";
	$scope.email = "aa@aa.aaa";
	$scope.password = "abcdef";

	$scope.login = function(){
		setAuth($scope.email, $scope.password);
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.login.login(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			$scope.id = value.id;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.signUp = function(){

		setAuth($scope.email, $scope.password);
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.signUp.signUp(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			$scope.id = value.id;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.getLeagues = function(){

		User.league.getLeagues().$promise.then(
		function(value){
			console.log(value);
			$scope.leagues = value;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.makeLeague = function(){

		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.league.createLeague(json).$promise.then(
		function(value){
			console.log(value);
			// $scope.leagues = value;
		},
		function(error){
			console.log(error);
		});

	};

	
	// setAuth("aa@aa.aaa", "abcdef");

	/*User.login({"email":"aa@aa.aaa","password":"abcdef"}).$promise.then(
		function(value){
			console.log(value.id);
		},
		function(error){
			console.log(error);
		});*/
});	

testApp.factory('User', ['$resource', function($resource){

	return {
		login: $resource('http://bowling-api.nextcapital.com/api/login',
			{},
			{
				login:{
					method: 'POST',
					isArray: false,
					headers: {
						'Authorization': 'Basic ' + getAuth(),
						'Content-Type':'application/json'
					}
				}
			}),
		signUp: $resource('http://bowling-api.nextcapital.com/api/users', 
			{},
			{
				signUp:{
					method: 'POST',
					isArray: false,
					headers: {
						// 'Authorization': 'Basic ' + getAuth(),
						'Content-Type':'application/json'
					}
				}
			}),
		league: $resource('http://bowling-api.nextcapital.com/api/leagues',
			{},
			{
				getLeagues:{
					method: 'GET',
					isArray: true,
					headers: {
						'Authorization': 'Basic ' + getAuth(),
						'Content-Type':'application/json'
					}
				},
				createLeague:{
					method: 'POST',
					isArray: false,
					headers: {
						'Authorization': 'Basic ' + getAuth(),
						'Content-Type':'application/json'
					}
				}

			})

	};

}]);
