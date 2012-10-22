
if (Meteor.is_server) {
	Meteor.methods
	(
		{
			//Erstmal ignorieren: Android cloud messaging test (für push nachrichten)
			"testF":function () {
				
				 
				
				 var options = {
					headers:{
						"Authorization":"key=AIzaSyDdPgUkd_RHNbk6Kqk2Brx2vxTacqBcH4w", 
						"Content-type": "application/json"
					},
					data: {"registration_ids":["APA91bESXISqHtFdxmP3ET8cmj45YoMuEZDP1FjoxYOjYrbnPCwlQOHCcV-DEd6A0_0_MYwFb3sif7jDYvpPbXTMsBcfDg66lTCv6BZCub9VN00wG669OLFgI0OA8EYacv7Fp8r8I6noq1sPKRP9F_gRHxKrKA48Lw"]}
				};
				
				var url = "https://android.googleapis.com/gcm/send";
				//var url = "http://google.de";
				var callback = function(error, result) {
					//Players.insert({name: "neu"+ret});
					console.log("error: "+error);
					console.log("result: "+result);
					return result;
				}; 
				 
				return Meteor.http.call("POST", url, options);
				
			}
		
			
		}
	);
	
	
	
	
	
	Meteor.startup(function () {
		//callM();
		//LoggedIn.remove({time: {$lt:new Date()}});
		 //console.log("startup #################"); 
		//Meteor._debug("init ================"); 
		//Meteor.publish("messages", function (roomId) {
			  //console.log("message here");
			//})
		//Players.insert({name: "foo"});
	});
}