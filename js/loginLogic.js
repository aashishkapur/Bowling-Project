var email = "", pass = "";

function getAuth()
{
	console.log("getAuth, email: " + email + "\tpass: " + pass);

	return btoa(email + ":" + pass);
}

function setAuth(email, pass)
{
	this.email = email;
	this.pass = pass;
	console.log("setAuth, email: " + email + "\tpass" + pass);
}

var testApp = angular.module('BowlingApp', ['ngResource']);

testApp.controller('mainController', function($scope, User) {
	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	$scope.login = function(){
		setAuth($scope.email, $scope.password);
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.login(btoa($scope.email + ":" + $scope.password)).login(json).$promise.then(
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

		User.signUp.signUp().$promise.then(
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

		User.league(btoa($scope.email + ":" + $scope.password)).getLeagues().$promise.then(
		function(value){
			console.log(value);
			$scope.leagues = value;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.getLeague = function(leagueID){

		User.league(btoa($scope.email + ":" + $scope.password)).getLeague({leagueID: leagueID}).$promise.then(
		function(value){
			console.log(value);
			alert("League Name: " + value.name + "\nID: " + value.id);
		},
		function(error){
			console.log(error);
		});

	};

	$scope.makeLeague = function(){

		var json = JSON.stringify({name : $scope.newLeagueName});

		User.league(btoa($scope.email + ":" + $scope.password)).createLeague(json).$promise.then(
		function(value){
			console.log(value);
			$scope.getLeagues();
		},
		function(error){
			console.log(error);
		});

		$scope.newLeagueName = "";

	};

	function auth(){
		return btoa($scope.email + ":" + $scope.password);
	}

	$scope.getBowlers = function(){

		User.bowler(auth()).getBowlers().$promise.then(
		function(value){
			console.log(value);
			$scope.bowlers = value;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.getBowler = function(bowlerID){

		User.bowler(auth()).getBowler({bowlerID: bowlerID}).$promise.then(
		function(value){
			console.log(value);
			alert("Bowler Name: " + value.name + "\nID: " + value.id);
		},
		function(error){
			console.log(error);
		});

	};

	$scope.makeBowler = function(){

		var json = JSON.stringify({name : $scope.newBowlerName});

		User.bowler(btoa($scope.email + ":" + $scope.password)).createBowler(json).$promise.then(
		function(value){
			console.log(value);
			$scope.getBowlers();
		},
		function(error){
			console.log(error);
		});

		$scope.newBowlerName = "";

	};

	
});	

testApp.factory('User', ['$resource', function($resource){

	return {
		login: function(authKey) {
				return $resource('http://bowling-api.nextcapital.com/api/login',
					{},
					{
						login:{
							method: 'POST',
							isArray: false,
							headers: {
								'Authorization': 'Basic ' + authKey,
								'Content-Type':'application/json'
							}
						}
					}
				);
			},
		signUp: function(){
			return $resource('http://bowling-api.nextcapital.com/api/users', 
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
				});
			},
		league: function(authKey){
			return $resource('http://bowling-api.nextcapital.com/api/leagues/:leagueID',
				{
					leagueID:'@id'
				},
				{
					getLeagues:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getLeague:{
						method: 'GET',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					createLeague:{
						method: 'POST',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
// check url structure add var for /:id/:bowler, use bowler as a var
					addBowler:{
						method: 'PUT',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getBowlers:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					}
				})
			},
		bowler: function(authKey){
			return $resource('http://bowling-api.nextcapital.com/api/bowlers/:bowlerID',
				{
					bowlerID:'@id'
				},
				{
					getBowlers:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getBowler:{
						method: 'GET',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					createBowler:{
						method: 'POST',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					}
				})
			}
	};

}]);
