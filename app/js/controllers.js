angular.module('bowlingApp.controllers', []);
angular.module('bowlingApp.controllers')

.controller('loginController', ['$scope', 'API', 'loginCreds', '$location', '$rootScope', '$timeout', function($scope, API, loginCreds, $location, $rootScope, $timeout){
	

	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function redirectPage(){
		loginCreds.set($scope.email, $scope.password);
		console.log("redirect");
		$location.path("leagues");
			$timeout(function(){
				console.log("loglogloglog");
			$rootScope.$broadcast('getLeagues:fire');
	}, 200);

	}

	$scope.logIn = function(){

		$scope.emailTaken = false;

		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		API.login(btoa($scope.email + ":" + $scope.password)).login(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			$scope.badCreds = false;

			redirectPage();
		},
		function(error){
			console.log(error);
			$scope.badCreds = true;
		});

	};

	$scope.signUp = function(){

		$scope.badCreds = false;

		var json = JSON.stringify({email : $scope.email, password: $scope.password});

		API.signUp().signUp(json).$promise.then(
		function(value){
			console.log(value);
			console.log(value.id);
			// $scope.id = value.id;
			$scope.emailTaken = false;
			redirectPage();
		},
		function(error){
			console.log(error);
			$scope.emailTaken = true;
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


	function APIError(){
		if (window.confirm("Sorry, there was an error.  This page will reload")) { 
			window.location.href = "index.html";
		}
		window.location.href = "index.html";
	}

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
			APIError();
		});

	};

	$scope.updatedLeague = {};
	$scope.lotteryDone = [];

	function resetLeague(leagueID){
		$scope.updatedLeague = {};

		API.league().getLeague({leagueID: leagueID}).$promise.then(
		function(value){
			// console.log(value);
			$scope.updatedLeague = value;
			console.log($scope.updatedLeague);

			API.league().getBowlersInLeague({leagueID: leagueID, type: "bowlers"}).$promise.then(
			function(value2){
				$scope.updatedLeague.bowlers = value2;
				console.log($scope.updatedLeague);

				API.league().getLotteriesInLeague({leagueID: leagueID, type: "lotteries"}).$promise.then(
				function(value3){

					$scope.updatedLeague.lotteries = value3;
					console.log($scope.updatedLeague);

					for(var i = 0; i < $scope.updatedLeague.lotteries.length; i++)
					{

						API.league().getAllTicketsForJackpot(
								{leagueID: leagueID, type: "lotteries", lotteryID: $scope.updatedLeague.lotteries[i].id, type2: "tickets"}
							).$promise.then(
						function(value4){
							if(value4.length > 0)
							{
									// if(value4[0].lottery_id === updatedLeague.lotteries[j].id)
									// {
										// console.log("I:" + i);
										// console.log(updatedLeague.lotteries[i]);
										// updatedLeague.lotteries[i].tickets = value4;
										console.log("146146" + value4[0].lottery_id);
										console.log(value4);
										for(var j = 0; j < $scope.updatedLeague.lotteries.length; j++)
										{
											console.log($scope.updatedLeague.lotteries[j].id);
											if(value4[0].lottery_id === $scope.updatedLeague.lotteries[j].id)
											{
												$scope.updatedLeague.lotteries[j].tickets = value4;
												console.log("val4");
												console.log(value4);

												console.log("146146" + value4[0].lottery_id +"\t" +  $scope.updatedLeague.lotteries[j].id);

												$scope.lotteryDone.push(value4[0].lottery_id);
											}
										}
										// console.log("adding tickets:");
										// console.log(value4);
										// console.log(updatedLeague.lotteries[j]);
										// console.log("tickets: ");
										// console.log(updatedLeague.lotteries[j].tickets);
										// console.log("-----------------------");
									// }
							}
							console.log($scope.updatedLeague);
							checkIfFinished(leagueID);

						},
						function(error){
							console.log(error);
							// alert("error: " + error);
							APIError();
						});
					}
				// -----

						},
				function(error){
					console.log(error);
					// alert("error: " + error);
					APIError();
				});

			},
			function(error){
				console.log(error);
				// alert("error: " + error);
				APIError();
			});
		},
		function(error){
			console.log(error);
			APIError();
		});

	}

	function checkIfFinished(leagueID)
	{
		console.log("check if finished");
		console.log($scope.lotteryDone);
		var done = true;
		for(var i = 0; i < $scope.updatedLeague.lotteries.length; i++)
		{
			if($scope.lotteryDone.indexOf($scope.updatedLeague.lotteries[i].id) === -1)
			{
				done = false;
				console.log("loop no run,\t" + $scope.updatedLeague.lotteries[i].id);
			}
		}


		if(done)
		{
			console.log("never runs-------------------------------------------");
			var found = false;

			for(var i = 0; i < $scope.leagues.length; i++)
			{
				if(leagueID === $scope.leagues[i].id)
				{
					// $scope.leagues.splice(i, 1);

					// $scope.leagues.push($scope.updatedLeague);
					$scope.leagues[i] = $scope.updatedLeague;

					i = $scope.leagues.length;
					found = true;
					console.log("changing league")
				}
			}

			if(!found)
				$scope.leagues.push($scope.updatedLeague)

			$scope.changeActiveLeague($scope.updatedLeague);
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
			APIError();
		});


	};

	$scope.makeLeague = function(leagueName){

		var json = JSON.stringify({name : $scope.newLeagueName});
		console.log("making league: " + $scope.newLeagueName);

		API.league().createLeague(json).$promise.then(
		function(value){
			console.log(value);
			// $scope.getLeagues();

			$scope.leagues.push(value);
			resetLeague(value.id);
		},
		function(error){
			console.log(error);
			APIError();
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
			APIError();
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
			APIError();
		});

	};

	$scope.makeBowler = function(name){

		var json = JSON.stringify({name : name});

		API.bowler().createBowler(json).$promise.then(
		function(value){
			console.log(value);
			$scope.getBowlers();
		},
		function(error){
			console.log(error);
			APIError();
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
			APIError();
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
			// alert("error: " + error);
			APIError();
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
			// alert("error: " + error);
			APIError();
		});

	};

	function getActiveLottery(){
		return $scope.activeLeague.lotteries[($scope.activeLeague.lotteries.length - 1)];
	}

	$scope.buyTicket = function(bowlerID){
		console.log("BUY TICKET: leagueID: " + $scope.activeLeague.id + ", bowlerID: " + bowlerID + 
			", lotteries: " + $scope.activeLeague.lotteries[0].id);

		var json = JSON.stringify({bowler_id:bowlerID});
		API.league().buyTicketForBowler(
			{leagueID: $scope.activeLeague.id, type: "lotteries", lotteryID: getActiveLottery().id, type2: "tickets"},
			json).$promise.then(
		function(value){
			// console.log(value);
			// $scope.getAllTickets($scope.activeLeague.id, $scope.activeLeague.lotteries);
			resetLeague($scope.activeLeague.id);
			// for(var i = 0; i < $scope.leagues.length; i++)
			// {
			// 	if($scope.leagues[i].id ===)
			// }
			// $scope.changeActiveLeague($scope.activeLeague.id);

		},
		function(error){
			console.log(error);
			// alert("error: " + error);
			APIError();
		});
	};

	// $scope.allTickets = [];

	$scope.getAllTickets = function(leagueID, lotteries){
		
		// console.log("getAllTickets: leagueID: " + leagueID + ", lotteries: " + lotteries[0].id);

		for(var m = 0; m < lotteries.length; m++)
		{

			API.league().getAllTicketsForJackpot(
					{leagueID: leagueID, type: "lotteries", lotteryID: lotteries[m].id, type2: "tickets"}
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
							// console.log($scope.leagues[i].lotteries);
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
				// alert("error: " + error);
				APIError();
			});

		}
	};


	$scope.drawWinningTicket = function(){
		console.log("lottery id: " + getActiveLottery().id)
		API.league().getWinningTicketForJackpot(
				{leagueID: $scope.activeLeague.id, type: "lotteries", lotteryID: getActiveLottery().id, type2: "roll"}
			).$promise.then(
		function(value){
			console.log(value);
			$scope.winningTicketSequence = 1;
			$scope.winningTicket = value;

		},
		function(error){
			console.log(error);
			// alert("error: " + error);
			APIError();
		});
	};

	$scope.recordResultsOfRoll = function(){

		console.log("pins: " + $scope.pinsKnockedOver);
		var json = JSON.stringify({pin_count : $scope.pinsKnockedOver});

		API.league().recordResultsOfRoll(
				{leagueID: $scope.activeLeague.id, type: "lotteries", lotteryID: getActiveLottery().id, type2: "roll"}, json
			).$promise.then(
		function(value){
			console.log(value);
			$scope.winningTicketSequence = 2;
			$scope.winningTicket = value;
			resetLeague($scope.activeLeague.id);


		},
		function(error){
			console.log(error);
			// alert("error: " + error);
			APIError();
		});
	};

	$scope.activeLeague;

	$scope.winningTicketSequence = 0;
	$scope.winningTicket;

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

			if(  (typeof $scope.activeLeague.lotteries[i].tickets) !=  'undefined'){
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
	}

	$scope.getBowlerName = function(bowlerID){
		var bowlerName = "ERROR";
		for(var m = 0; m < $scope.bowlers.length; m++)
		{
			if($scope.bowlers[m].id === bowlerID)
			{
				bowlerName = $scope.bowlers[m].name;
				m = $scope.bowlers.length;
			}
		}
		return bowlerName;
	};



});