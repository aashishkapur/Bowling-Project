
var testApp = angular.module('BowlingApp', ['ngResource']);

testApp.controller('mainController', function($scope, User) {
	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function auth(){
		return btoa($scope.email + ":" + $scope.password);
	}

	$scope.randomStuff = function(){
		console.log($scope.allTickets);
	};


	$scope.login = function(){
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		User.login(auth()).login(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			$scope.id = value.id;

			// getBowlers(), getLeagues()
			$scope.getBowlers();
			$scope.getLeagues();
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
			getAllLotteriesInLeagues();


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
		User.league(auth()).addBowlerToLeague({leagueID: leagueID, type: "bowlers"}, json).$promise.then(
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
		User.league(auth()).getBowlersInLeague({leagueID: leagueID, type: "bowlers"}).$promise.then(
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

	function getAllLotteriesInLeagues()
	{
		console.log("get lotteries");
		for(var i = 0; i < $scope.leagues.length; i++)
		{
			$scope.getLotteriesInLeague($scope.leagues[i].id);
			console.log("I:" + i);
		}

	}

	$scope.getLotteriesInLeague = function(leagueID){
		User.league(auth()).getLotteriesInLeague({leagueID: leagueID, type: "lotteries"}).$promise.then(
		function(value){
			for(var i = 0; i < $scope.leagues.length; i++)
			{
				if($scope.leagues[i].id === leagueID)
				{
					$scope.leagues[i].lotteries = value;
					// method call here
					$scope.getAllTickets(leagueID, value);

				}
			}
		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});

	};

	$scope.buyTicket = function(leagueID, bowlerID, lotteries){
		console.log("BUY TICKET: leagueID: " + leagueID + ", bowlerID: " + bowlerID + 
			", lotteries: " + lotteries[0].id);

		var json = JSON.stringify({bowler_id:bowlerID});
		User.league(auth()).buyTicketForBowler(
			{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[0].id, type2: "tickets"},
			json).$promise.then(
		function(value){
			console.log(value);
			$scope.getAllTickets(leagueID, lotteries);
		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});
	};

	// $scope.allTickets = [];

	$scope.getAllTickets = function(leagueID, lotteries){
		
		console.log("getAllTickets: leagueID: " + leagueID + ", lotteries: " + lotteries[0].id);

		User.league(auth()).getAllTicketsForJackpot(
				{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[0].id, type2: "tickets"}
			).$promise.then(
		function(value){
			// console.log(value);
			// console.log("getAllTickets: " + value + "\t\t" + typeof value[0].lottery_id + "\t" + typeof value);
			// $scope.allTickets.push(value);
			if(value[0] == false)
				console.log("false false false " + leagueID);
			else
			{
				for(var i = 0; i < $scope.leagues.length; i++)
				{
					for(var j = 0; j < $scope.leagues[i].lotteries.length; j++)
					{
						if(leagueID === $scope.leagues[i].id && value[0].lottery_id === $scope.leagues[i].lotteries[j].id)
							$scope.leagues[i].lotteries[j].tickets = value;
					}
				}
			}
		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});
	};


	$scope.drawTicket = function(lotteries){
		User.league(auth()).getWinningTicketForJackpot(
				{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[0].id, type2: "roll"}
			).$promise.then(
		function(value){
			console.log(value);
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
			return $resource('http://bowling-api.nextcapital.com/api/leagues/:leagueID/:type/:lotteryID/:type2',
				{
					leagueID:'@id',
					type:'@type',
					lotteryID:'@lotteryID',
					type2:'@type2'
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
					},
					getLotteriesInLeague:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},//-----------
					buyTicketForBowler:{
						method: 'POST',
						isArray: false,
						headers:{
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getAllTicketsForJackpot:{
						method: 'GET',
						isArray: true,
						headers:{
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					getWinningTicketForJackpot:{
						method: 'GET',
						isArray: false,
						headers:{
							'Authorization': 'Basic ' + authKey,
							'Content-Type':'application/json'
						}
					},
					recordResultsOfRoll:{
						method: 'PUT',
						isArray: false,
						headers:{
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
