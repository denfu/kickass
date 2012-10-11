var setCookie = function(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

var getCookie = function(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

var nav_toggled = false;

var toggleNav = function () 
{
	var $lefty = $('.inner');
	var $container = $('.ui-grid-a');
	
	$lefty.animate({				
		left: parseInt($lefty.css('left'),10) == 0 ? -$lefty.outerWidth() : 0
	});			
}

var logPlayerIn = function(id) {
	//login:
	var player = Players.findOne({_id:id});
	player.online = true;
	Session.set("selected_player", player);
	Player.updatePlayer(player);
	setCookie("ka", id);
	var invalidateTime = new Date();
	invalidateTime.addMinutes(5);
	LoggedIn.insert({player: player, time:invalidateTime});		
	Session.set("selected_page", "highscore");
}

var logPlayerOut = function() {
	var player = Session.get("selected_player");
	player.online = false;
	LoggedIn.remove({"player._id": player._id});
	Player.updatePlayer(player);
	Session.set("selected_player", undefined);
}

if (Meteor.is_client) {
	
	/**** TEMPLATE: tPage ****/
	
	Template.tPage.rendered = function () {
		$('.inner').css('left',-$('.inner').width());	
		
		$('#kacontent').parent().parent().trigger('pagecreate');
		
		$("#playerlistlogin").listview("refresh");
		//TODO: nach server:
		LoggedIn.find({time: {$lt:new Date()}});		//TODO: online status false
	}
	
	Template.tPage.events = {
		'click a#logout': 	function () {
			logPlayerOut();						
		},
		'click a#menu': function(e) {
			nav_toggled = true;
			toggleNav();
			return false;
		},
		'click div.ui-block-b': function() {
			if (nav_toggled) {
				nav_toggled = false;
				toggleNav();
				return false; //prevent from delegating to next event catch
			}
		},
		'click ul#navbar a': 	function (e) {
			var page = e.target.href.substr(e.target.href.indexOf('#')+1, e.target.href.size);
			toggleNav();
			Session.set("selected_page", page);
		}
	};	
	
	Template.tPage.getPageName = function () {
		return Session.get("selected_page");
	}
	
	
	Template.tPage.isLoggedIn = function () {
		var id = getCookie("ka");
		if (id !== undefined) {
			var logged = LoggedIn.findOne({"player._id":id});
			if (logged) {
				Session.set("selected_player", logged.player);
				return true;
			}
		}
		return !!Session.get("selected_player");
	};
	
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
		return Player.getAllPlayers();	
	};
	
 
	Template.tLogin.events = {
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
				Session.set("selected_player", ret);						
			} else {
				console.log("bereits vorhanden");
			}	
		}
	};
  
 
}
