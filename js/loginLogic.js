
var testApp = angular.module('BowlingApp', ['ngResource']);

testApp.controller('mainController', function($scope, User) {
	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function auth(){
		return btoa($scope.email + ":" + $scope.password);
	}

	$scope.randomStuff = function(){
		console.log("Hello!");
	};


	$scope.login = function(){
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.login(auth()).login(json).$promise.then(
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

		User.league(auth()).getLeagues().$promise.then(
		function(value){
			console.log(value);
			$scope.leagues = value;
			getAllBowlersInLeagues();

		},
		function(error){
			console.log(error);
		});

	};

	$scope.getLeague = function(leagueID){

		User.league(auth()).getLeague({leagueID: leagueID}).$promise.then(
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

		User.league(auth()).createLeague(json).$promise.then(
		function(value){
			console.log(value);
			$scope.getLeagues();
		},
		function(error){
			console.log(error);
		});

		$scope.newLeagueName = "";

	};

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

		User.bowler(auth()).createBowler(json).$promise.then(
		function(value){
			console.log(value);
			$scope.getBowlers();
		},
		function(error){
			console.log(error);
		});

		$scope.newBowlerName = "";

	};

	$scope.addBowlerToLeague = function(leagueID, bowlerID){
		var json = JSON.stringify({bowler_id: bowlerID});
		User.league(auth()).addBowlerToLeague({leagueID: leagueID, bowler: "bowlers"}, json).$promise.then(
		function(value){
			console.log(value);
			getAllBowlersInLeagues();
		},
		function(error){
			console.log(error);
		});
	};

	function getAllBowlersInLeagues()
	{
		for(var i = 0; i < $scope.leagues.length; i++)
		{
			$scope.getBowlersInLeague($scope.leagues[i].id);
			// console.log("I: " + i + "\tid: " + $scope.leagues[i].id);
		}

	}

	$scope.getBowlersInLeague = function(leagueID){
		User.league(auth()).getBowlersInLeague({leagueID: leagueID, bowler: "bowlers"}).$promise.then(
		function(value){
			for(var i = 0; i < $scope.leagues.length; i++)
			{
				if($scope.leagues[i].id === leagueID)
				{
					$scope.leagues[i].bowlers = value;
				}
			}
		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});

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
			return $resource('http://bowling-api.nextcapital.com/api/leagues/:leagueID/:bowler',
				{
					leagueID:'@id',
					bowler:'@bowler'
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
					addBowlerToLeague:{
						method: 'PUT',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getBowlersInLeague:{
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
