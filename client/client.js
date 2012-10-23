if (Meteor.is_client) {
	
	/**** TEMPLATE: tPage ****/
	
	Template.tPage.rendered = function () {
		/*
		$('.inner').css('left',-$('.inner').width());	
		
		$('#kacontent').parent().parent().trigger('pagecreate');
		
		$("#playerlistlogin").listview("refresh");
		*/
		//TODO: nach server:
		//LoggedIn.find({time: {$lt:new Date()}});		//TODO: online status false
	}
	
	Template.tPage.events = {
		'click ul#navbar a': 	function (e) {
			var page = e.target.href.substr(e.target.href.indexOf('#')+1, e.target.href.size);
			var p = Session.get("selected_player");
			Page.change(p, page);			
		}
	};	
	
	Template.tPage.getPageName = function () {
		return Session.get("selected_page");
	}
	
	
	Template.tPage.isLoggedIn = function () {
		//TODO
		return false;
	};
	
	
	Template.tPageSwitch.getPlayer = function() {
		var p = Session.get("selected_player");
		return Player.getPlayer(p.name);
	}
	
	/**** TEMPLATE: tProfile ****/
	
	
	
	
	/**** TEMPLATE: tHighscore ****/
	
	Template.tHighscore.getPlayers = function() {
		return Player.getAllPlayers({won:-1});
	}
	
	
	
	
	/**** TEMPLATE: tPageSwitch ****/
	Template.tPageSwitch.isLoggedIn = function() {
		return Template.tPage.isLoggedIn();
	}
	
	Template.tPageSwitch.isPage = function(name) {
		var page = Session.get("selected_page");
		return page === name;
	}
	
	/**** TEMPLATE: tLogin ****/
	Template.tLogin.getPlayers = function () {
		//TODO
		//return Player.getAllPlayers();	
	};
	
 
	Template.tLogin.events = {
		'click button.loginBtn': 	function (e) {
			console.log(e);//TODO
		},
		'click a.login': 	function (e) {
			var id = e.target.id;
			logPlayerIn(id);			
		},
		'click input#submitNewPlayer': 	function (e) {
			var form = $(e.target).parents().find('div#login');
			var pwd = form.find('input#pwd').val();
			var name = form.find('input#name').val();
			var ret = Player.createPlayer(name, pwd);
			if (ret) {
				logPlayerIn(ret._id);
				//Session.set("selected_player", ret);						
			} else {
				console.log("bereits vorhanden");
			}	
		}
	};
  
 
}
