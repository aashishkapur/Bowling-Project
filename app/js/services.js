angular.module('bowlingApp.services', []);

angular.module('bowlingApp.services')

.service('loginCreds', function() {
	var creds = {};
	creds.email = "";
	creds.pass = "";

	return {
		get: function () {
			return creds;
		},
		set: function(email,pass) {
			creds.email = email;
			creds.pass = pass;
		},
		auth: function(){
			return btoa(creds.email + ":" + creds.pass);
		},
		signedIn: function(){
			return !(creds.email === "");
		}


	};
});
