angular.module('bowlingApp.factory', ['ngResource']);

angular.module('bowlingApp.factory')


.factory('API', ['$resource', 'loginCreds', function($resource, loginCreds){

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
							'Content-Type':'application/json'
						}
					}
				});
			},
		league: function(){
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
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getLeague:{
						method: 'GET',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					createLeague:{
						method: 'POST',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					addBowlerToLeague:{
						method: 'PUT',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getBowlersInLeague:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getLotteriesInLeague:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},//-----------
					buyTicketForBowler:{
						method: 'POST',
						isArray: false,
						headers:{
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getAllTicketsForJackpot:{
						method: 'GET',
						isArray: true,
						headers:{
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getWinningTicketForJackpot:{
						method: 'GET',
						isArray: false,
						headers:{
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					recordResultsOfRoll:{
						method: 'PUT',
						isArray: false,
						headers:{
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					}

				})
			},
		bowler: function(){
			return $resource('http://bowling-api.nextcapital.com/api/bowlers/:bowlerID',
				{
					bowlerID:'@id'
				},
				{
					getBowlers:{
						method: 'GET',
						isArray: true,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					getBowler:{
						method: 'GET',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					},
					createBowler:{
						method: 'POST',
						isArray: false,
						headers: {
							'Authorization': 'Basic ' + loginCreds.auth(),
							'Content-Type':'application/json'
						}
					}
				})
			}
	};

}]);