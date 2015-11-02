angular.module('bowlingApp.services', []);

angular.module('bowlingApp.services')

.service('loginCreds', function() {
	var creds = {};

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
		}

	};
});
