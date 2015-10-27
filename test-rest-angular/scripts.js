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

var testApp = angular.module('testRestApp', ['ngResource']);

testApp.controller('mainController', function($scope, User) {
	$scope.message="asdagdvfshbjk";
	setAuth("aa@aa.aaa", "abcdef");
	User.login({"email":"aa@aa.aaa","password":"abcdef"}).$promise.then(
		function(value){
			console.log(value.id);
		},
		function(error){
			console.log(error);
		});
});	

testApp.factory('User', ['$resource', function($resource){

	return $resource('http://bowling-api.nextcapital.com/api/login',
			{},
        	{
        		'login': { 
        			method: 'POST',
					isArray: false,
					headers: {
						'Authorization': 'Basic ' + getAuth(),
						'Content-Type':'application/json'
					}
        		}

        	}

		);

}]);
