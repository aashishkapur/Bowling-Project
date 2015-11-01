var templateApp = angular.module("templateApp",[]);

templateApp.controller('mainController', function($scope){

	$scope.bowlers = [
		{id:1, name:"bowler 1"},
		{id:2, name:"bowler 2"},
		{id:3, name:"bowler 3"}, 
		{id:4, name:"bowler 4"}
	];

	$scope.leagues = [
		{id:1, name:"league 1", bowlers: 10, jackpot: 1},
		{id:2, name:"league 2", bowlers: 50, jackpot: 432},
		{id:3, name:"league 3", bowlers: 25, jackpot: 325}, 
		{id:4, name:"league 4", bowlers: 5, jackpot: 105.5050}
	];

	$scope.activeLeague = $scope.leagues[0];

	$scope.changeActiveLeague = function(leagueID){
		$scope.activeLeague = leagueID;
		console.log(leagueID);
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

});
