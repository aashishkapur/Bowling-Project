angular.module('bowlingApp.controllers', []);
angular.module('bowlingApp.controllers')
.controller('loginController', ['$scope', 'API', 'loginCreds', function($scope, API, loginCreds){
	

	$scope.email = "test@test123.aaa";
	$scope.password = "abcdef";

	function redirectPage(){
		// loginCreds.set($scope.email, $scope.password);
		window.location.href = window.location.href + '/leagues';
		// $location.path("leagues");
	}

	$scope.logIn = function(){
		var json = JSON.stringify({email : $scope.email, password: $scope.password});
		loginCreds.set($scope.email, $scope.password);

		API.login(loginCreds.auth()).login(json).$promise.then(
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

.controller('leaguesController', function($scope){

});