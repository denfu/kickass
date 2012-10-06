Players = new Meteor.Collection("players");
Games = new Meteor.Collection("games");
LoggedIn = new Meteor.Collection("loggedin");
//APA91bESXISqHtFdxmP3ET8cmj45YoMuEZDP1FjoxYOjYrbnPCwlQOHCcV-DEd6A0_0_MYwFb3sif7jDYvpPbXTMsBcfDg66lTCv6BZCub9VN00wG669OLFgI0OA8EYacv7Fp8r8I6noq1sPKRP9F_gRHxKrKA48Lw

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addMinutes = function(m){
    this.setMinutes(this.getMinutes()+m);
    return this;
}




var Player = {
	createPlayer: 	function(name) {
						if (Players.findOne({name: name})) return;
						
						var player = {name: name, games: []};
						Players.insert(player);
						//Session.set("numPlayer",Players.find({}).count());
						return player;
					},
	deletePlayer:	function(playerToDelete) {
						Players.remove({name:playerToDelete});
						//Session.set("numPlayer",Players.find({}).count());
					}

}

var createGame = function(redKeeper, redAttack, blueKeeper, blueAttack) {

	var game = {
		red: {keeper: redKeeper, striker: redAttack}, 
		blue: {keeper: blueKeeper, striker: blueAttack},
		result: {
			redPoints: undefined, 
			bluePoints: undefined, 
			won: undefined
		},
		setResult: function(redPoints, bluePoints) {
			result.redPoints = redPoints;
			result.bluePoints = bluePoints;
		}
		
	};
	
	Games.insert(game);
	return game;
}