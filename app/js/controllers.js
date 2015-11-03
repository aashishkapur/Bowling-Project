angular.module('bowlingApp.controllers', []);
angular.module('bowlingApp.controllers')

.controller('loginController', ['$scope', 'API', 'loginCreds', '$location', function($scope, API, loginCreds, $location){
	

	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function redirectPage(){
		// loginCreds.set($scope.email, $scope.password);
		console.log("redirect");
		// $window.location.href = '../leagues'
		// window.location.href = window.location.href + '/leagues';
		$location.path("leagues");
	}

	$scope.logIn = function(){
		var json = JSON.stringify({email : $scope.email, password: $scope.password});
		loginCreds.set($scope.email, $scope.password);

		API.login(loginCreds.).login(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			// $scope.id = value.id;

			// $scope.getBowlers();
			// $scope.getLeagues();

			redirectPage();
		},
		function(error){
			console.log(error);
		});

	};

	$scope.signUp = function(){

		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		API.signUp.signUp().$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			// $scope.id = value.id;
		},
		function(error){
			console.log(error);
		});

	};

}])

.controller('navController', function($scope, loginCreds){
	$scope.signedIn = loginCreds.signedIn;

	$scope.checkSignedIn = function(){
		console.log(loginCreds.signedIn() + "\t-" + loginCreds.get().email);
	};
})

.controller('leaguesController', function($scope, loginCreds){

	$scope.getEverything = function(){

	};

	$scope.getLeagues = function(){

		User.league().getLeagues().$promise.then(
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

		User.league().getLeague({leagueID: leagueID}).$promise.then(
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

		User.league().createLeague(json).$promise.then(
		function(value){
			console.l

			og(value);
			$scope.getLeagues();
		},
		function(error){
			console.log(error);
		});

		$scope.newLeagueName = "";

	};

	$scope.getBowlers = function(){

		User.bowler().getBowlers().$promise.then(
		function(value){
			console.log(value);
			$scope.bowlers = value;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.getBowler = function(bowlerID){

		User.bowler().getBowler({bowlerID: bowlerID}).$promise.then(
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

		User.bowler().createBowler(json).$promise.then(
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
		User.league().addBowlerToLeague({leagueID: leagueID, type: "bowlers"}, json).$promise.then(
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
		User.league().getBowlersInLeague({leagueID: leagueID, type: "bowlers"}).$promise.then(
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
		User.league().getLotteriesInLeague({leagueID: leagueID, type: "lotteries"}).$promise.then(
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
		User.league().buyTicketForBowler(
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

		User.league().getAllTicketsForJackpot(
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
		User.league().getWinningTicketForJackpot(
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