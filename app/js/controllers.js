angular.module('bowlingApp.controllers', []);
angular.module('bowlingApp.controllers')

.controller('loginController', ['$scope', 'API', 'loginCreds', '$location', '$rootScope', '$timeout', function($scope, API, loginCreds, $location, $rootScope, $timeout){
	

	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function redirectPage(){
		loginCreds.set($scope.email, $scope.password);
		console.log("redirect");
		// $window.location.href = '../leagues'
		// window.location.href = window.location.href + '/leagues';
		$location.path("leagues");
		    $timeout(function(){
		    	console.log("loglogloglog");
			$rootScope.$broadcast('getLeagues:fire');
    }, 200);

	}

	$scope.logIn = function(){
		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		API.login(btoa($scope.email + ":" + $scope.password)).login(json).$promise.then(
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

.controller('navController', function($scope, loginCreds, $window){
	$scope.signedIn = loginCreds.signedIn;

	$scope.checkSignedIn = function(){
		console.log(loginCreds.signedIn() + "\t-" + loginCreds.get().email);
	};

	$scope.signOut = function(){
		// location = location;
		$window.location.href = "index.html";
	}
})

.controller('leaguesController', function($scope, loginCreds, $rootScope, API, $timeout){

	// $rootScope.$on('getLeagues:fire', $scope.getLeagues);
	// console.log("fasdfdsadfsdfsadfsdfsdfs");
	    $scope.$on('getLeagues:fire', function(){
	        // $scope.$apply(function(){
	        	console.log("sdafdfsfdsdfs");
	            $scope.getLeagues();
	            console.log("gotLeagues");
	        // });
    });

	$scope.getLeagues = function(){
		console.log("STARTING");

		API.league().getLeagues().$promise.then(
		function(value){
			console.log(value);
			$scope.leagues = value;
			getAllBowlersInLeagues();
			getAllLotteriesInLeagues();
			$scope.activeLeague = $scope.leagues[0];
			$scope.getBowlers();

		},
		function(error){
			console.log(error);
		});

	};

	function resetLeague(leagueID){
		var updatedLeague = {};

		API.league().getLeague({leagueID: leagueID}).$promise.then(
		function(value){
			// console.log(value);
			updatedLeague = value;

			API.league().getBowlersInLeague({leagueID: leagueID, type: "bowlers"}).$promise.then(
			function(value2){
				updatedLeague.bowlers = value2;

				API.league().getLotteriesInLeague({leagueID: leagueID, type: "lotteries"}).$promise.then(
				function(value3){

					updatedLeague.lotteries = value3;

					API.league().getAllTicketsForJackpot(
							{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[0].id, type2: "tickets"}
						).$promise.then(
					function(value4){
						if(value.length > 0)
						{
							for(var j = 0; j < updatedLeague.lotteries.length; j++)
							{
								if(value4[0].lottery_id === updatedLeague.lotteries[j].id)
									updatedLeague.lotteries[j].tickets = value4;
							}
						}

					},
					function(error){
						console.log(error);
						alert("error: " + error);
					});
						},
				function(error){
					console.log(error);
					alert("error: " + error);
				});

			},
			function(error){
				console.log(error);
				alert("error: " + error);
			});
		},
		function(error){
			console.log(error);
		});

		for(var i = 0; i < $scope.leagues.length; i++)
		{
			if(leagueID === $scope.leagues[i].id)
			{
				$scope.leagues.splice(i, 1);

				$scope.leagues.push(updatedLeague);

				$scope.changeActiveLeague(leagueID);

				i = $scope.leagues.length;
			}
		}

	}

	$scope.getLeague = function(leagueID){

		API.league().getLeague({leagueID: leagueID}).$promise.then(
		function(value){
			console.log(value);
			// $scope.leagues

			// getAllBowlersInLeagues();
			// getAllLotteriesInLeagues();


			// alert("League Name: " + value.name + "\nID: " + value.id);
		},
		function(error){
			console.log(error);
		});


	};

	$scope.makeLeague = function(){

		var json = JSON.stringify({name : $scope.newLeagueName});

		API.league().createLeague(json).$promise.then(
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

		API.bowler().getBowlers().$promise.then(
		function(value){
			console.log(value);
			$scope.bowlers = value;
		},
		function(error){
			console.log(error);
		});

	};

	$scope.getBowler = function(bowlerID){

		API.bowler().getBowler({bowlerID: bowlerID}).$promise.then(
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

		API.bowler().createBowler(json).$promise.then(
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
		API.league().addBowlerToLeague({leagueID: leagueID, type: "bowlers"}, json).$promise.then(
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
		API.league().getBowlersInLeague({leagueID: leagueID, type: "bowlers"}).$promise.then(
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
			// console.log("I:" + i);
		}

	}

	$scope.getLotteriesInLeague = function(leagueID){
		API.league().getLotteriesInLeague({leagueID: leagueID, type: "lotteries"}).$promise.then(
		function(value){
			for(var i = 0; i < $scope.leagues.length; i++)
			{
				if($scope.leagues[i].id === leagueID)
				{
					$scope.leagues[i].lotteries = value;
					// console.log("\tleagueID: " + leagueID);
					// console.log(value);
					// console.log($scope.leagues[i]);
					// method call here

				$timeout(function(){
					$scope.getAllTickets(leagueID, value);
				}, 200);

				}
			}
		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});

	};

	$scope.buyTicket = function(bowlerID){
		console.log("BUY TICKET: leagueID: " + $scope.activeLeague.id + ", bowlerID: " + bowlerID + 
			", lotteries: " + $scope.activeLeague.lotteries[0].id);

		var json = JSON.stringify({bowler_id:bowlerID});
		API.league().buyTicketForBowler(
			{leagueID: $scope.activeLeague.id, type: "lotteries", lotteryID: $scope.activeLeague.lotteries[0].id, type2: "tickets"},
			json).$promise.then(
		function(value){
			// console.log(value);
			$scope.getAllTickets($scope.activeLeague.id, $scope.activeLeague.lotteries);
			$scope.changeActiveLeague($scope.activeLeague.id);

		},
		function(error){
			console.log(error);
			alert("error: " + error);
		});
	};

	// $scope.allTickets = [];

	$scope.getAllTickets = function(leagueID, lotteries){
		
		// console.log("getAllTickets: leagueID: " + leagueID + ", lotteries: " + lotteries[0].id);

		API.league().getAllTicketsForJackpot(
				{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[0].id, type2: "tickets"}
			).$promise.then(
		function(value){
			// console.log(value);
			// console.log("getAllTickets: " + value + "\t\t" + typeof value[0].lottery_id + "\t" + typeof value);
			// $scope.allTickets.push(value);
			if(value.length > 0)
			{
				if(typeof value[0] == undefined || 
					value[0] == false || 
					value[0].lottery_id == null || 
					value[0].lottery_id == undefined)
					console.log("false false false " + leagueID);
				else
				{
					for(var i = 0; i < $scope.leagues.length; i++)
					{
						for(var j = 0; j < $scope.leagues[i].lotteries.length; j++)
						{
							if(leagueID === $scope.leagues[i].id && 
									value[0].lottery_id === $scope.leagues[i].lotteries[j].id)
								$scope.leagues[i].lotteries[j].tickets = value;
						}
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
		API.league().getWinningTicketForJackpot(
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

	$scope.activeLeague;

	$scope.changeActiveLeague = function(league){
		$scope.activeLeague = league;
		console.log("CHANGE ACTIVE LEAGUE: " + league);
		// $scope.sortTicketsByPerson();
	};

	$scope.activeBowlers = [];

	$scope.changeActiveState = function(id){
		console.log(id + "\t" + $scope.activeBowlers);
		console.log("\t" + $scope.activeBowlers.indexOf(id));
		if($scope.activeBowlers.indexOf(id) === -1)
			$scope.activeBowlers.push(id);
		else
		{
			console.log("REMOVE");
			var temp = $scope.activeBowlers.indexOf(id);
			$scope.activeBowlers.splice(temp, 1);
		}
	};

	$scope.getActiveBowlers = function(id){
		return $scope.activeBowlers.indexOf(id) >= 0;
	};


	$scope.getOtherBowlers = function(){

		var otherBowlers = [];
		for(var i = 0; i < $scope.bowlers.length; i++)
		{
			var found = false;
			for(var j = 0; j < $scope.activeLeague.bowlers.length; j++)
			{
				// console.log("ID:" + $scope.bowlers[i].id + "\t ID2:" + $scope.activeLeague.bowlers[j].id);
				if($scope.bowlers[i].id === $scope.activeLeague.bowlers[j].id)
				{
					found = true;
					j = $scope.activeLeague.bowlers.length;
				}
			}
			if(!found)
			{
				otherBowlers.push($scope.bowlers[i]);
			}
		}
		// console.log("getting other bowlers, " + $scope.activeLeague.id);
		// console.log(otherBowlers);
		$scope.activeLeague.otherBowlers = otherBowlers;
		// console.log($scope.activeLeague.otherBowlers);

	};

	$scope.addOtherBowlersToLeague = function(){

		console.log($scope.activeBowlers);

		for(var i = 0; i < $scope.activeBowlers.length; i++)
		{
			// $scope.activeLeague.id


			// $scope.activeLeague.bowlers.push($scope.activeBowlers[i]);

			// console.log($scope.activeBowlers[)
			$scope.addBowlerToLeague($scope.activeLeague.id, $scope.activeBowlers[i]);
		}

		// $scope.getLeagues();
		resetLeague($scope.activeLeague.id);

		// close modal, refresh activeLeague and league by calling getLeagues()
		// THEN, CHANGE MODEL TO REFRESH ONLY THE CURRENT LEAGUE TO SAVE API CALLS
	};

	$scope.ticketBuyer = {};

	$scope.updateBuyTicketModal = function(bowler){
		$scope.ticketBuyer = bowler;
	};

	$scope.sortTicketsByPerson = function(){
		console.log("sorting tickets by person");
		for(var i = 0; i < $scope.activeLeague.lotteries.length; i++)
		{
			$scope.activeLeague.lotteries[i].ticketHolders = [];
			for(var j = 0; j < $scope.activeLeague.lotteries[i].tickets.length; j++)
			{
				var ticket = $scope.activeLeague.lotteries[i].tickets[j];
				// console.log(ticket);
				// console.log("\t\tTICKET B ID" + ticket.bowler_id + "\t\t" + $scope.activeLeague.lotteries[i].tickets[j].bowler_id);
				var found = false;
				console.log($scope.activeLeague.lotteries[i].ticketHolders);
				for(var k = 0; k < $scope.activeLeague.lotteries[i].ticketHolders.length; k++)
				{
					// console.log("---1: " + ticket.bowler_id + "2: " +  $scope.activeLeague.lotteries[i].ticketHolders[k].bowler_id);
					if(ticket.bowler_id === $scope.activeLeague.lotteries[i].ticketHolders[k].bowler_id)
					{
						$scope.activeLeague.lotteries[i].ticketHolders[k].numTickets++;
						k = $scope.activeLeague.lotteries[i].ticketHolders.length;
						found = true;
						// console.log("found: " + ticket.bowler_ID + "\t" + $scope.activeLeague.lotteries[i].ticketHolders[k].id)
					}
				}
				if(!found)
				{
					var bowlerName = "ERROR";
					for(var m = 0; m < $scope.bowlers.length; m++)
					{
						if($scope.bowlers[m].id === ticket.bowler_id)
						{
							bowlerName = $scope.bowlers[m].name;
							// console.log("creating user: " + $scope.bowlers[m].id + "ticket: " + ticket.bowler_id);
						}
					}
					var newPerson = {
						bowler_id: ticket.bowler_id,
						name: bowlerName,
						numTickets: 1
					}
					// console.log("created new person: " + newPerson.bowler_id + "  " + newPerson.name + "  " + newPerson.numTickets)
					$scope.activeLeague.lotteries[i].ticketHolders.push(newPerson);	
				}
			}
		}
	}





});