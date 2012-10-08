var setCookie = function(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
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
var toggleNav = function () {
					var $lefty = $('.inner');
					var $container = $('.ui-grid-a');
					
					$lefty.animate({				
						left: parseInt($lefty.css('left'),10) == 0 ? -$lefty.outerWidth() : 0
					});			
				}

if (Meteor.is_client) {
	
	
	Template.tPanel.rendered = function () {
		$('.inner').css('left',-$('.inner').width());
		
	}
	
	

	
	Template.tPanel.events = {
		'click a#logout': 	function (e) {
			var player = Session.get("selected_player");
			LoggedIn.remove({"player._id": player._id});
			Session.set("selected_player", undefined);			
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
		}
	};
	
	
	
	
	
	Template.tContent.rendered = function () {
		$('#kacontent').parent().parent().trigger('pagecreate');
		
		$("#playerlistlogin").listview("refresh");
		//TODO: nach server:
		LoggedIn.remove({time: {$lt:new Date()}});
		
		
	};
	
	Template.tContent.created = function () {
		
	};
	
	Template.tLogin.getPlayers = function () {
		var p = Players.find({}, {sort: {name: 1}});
		
		//No longer needed, since "rendered" callback
		//Meteor.autosubscribe(function () {			
		//	$("#playerlistlogin").listview("refresh");
		//	Meteor.subscribe("p", Session.get("numPlayer"));
		//});
		
		return p;		
	};
	
	
	Template.tContent.isLoggedIn = function () {
		//Session.get("selected_player");
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
	

	
	Template.playerlist.players = function () {
	 return Players.find({}, {sort: {name: 1}});
	};

	Template.loggedin.getLogged = function () {
		return LoggedIn.find({}, {sort: {name: 1}});
	};


  
	Template.tLogin.events = {
				'click a.login': 	function (e) {
					var id = e.target.id;
					//login:
					var player = Players.findOne({_id:id});
					Session.set("selected_player", player);
					setCookie("ka", id);
					var invalidateTime = new Date();
					invalidateTime.addMinutes(5);
					LoggedIn.insert({player: player, time:invalidateTime});
					//Meteor.autosubscribe(function () {
						//Meteor.subscribe("messages", Session.get("selected_player"));
					//});		
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
					//var player = Players.findOne(Session.get("selected_player"));
					//Session.set("selected_player", player);
					//LoggedIn.insert(player);
					//Meteor.autosubscribe(function () {
						//Meteor.subscribe("messages", Session.get("selected_player"));
					//});		
				}
	};
  
 
}
