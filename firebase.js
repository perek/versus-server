var Firebase = require('firebase');
var refUsers = new Firebase("https://amber-fire-4863.firebaseio.com/users");
var refActive = new Firebase("https://amber-fire-4863.firebaseio.com/active");
var refFights = new Firebase("https://amber-fire-4863.firebaseio.com/fights");

function purgeActives(allActive){
	if(allActive){
		allActive.forEach(function(userSnapshot) {
	    // Will be called with a messageSnapshot for each message under message_list.
	    var currTime = new Date();
	    var nearby = userSnapshot.child('nearby').val();
	    var location = userSnapshot.child('location').val();
	    var userId = userSnapshot.name();
	    var deleteRef = false;

	    location = location && location['timestamp'] ?  location : {timestamp: "0"};
    	var timestamp = new Date();
    	var timeDiff = timestamp.getTime() - parseInt(location.timestamp)*1000;
    	console.log("User " + userId + " active since " + timeDiff);
    	if(timeDiff > 14400000){
    		console.log("User " + userId + " being purged from the data store");
    		userSnapshot.ref().remove();
    	} else if(!deleteRef && nearby && Object.keys(nearby).length > 0){
	    	console.log("User " + userId + " has players nearby, running experiance");
	    	calculateXP(userSnapshot);
	    }
	  });
	}	
}

function calculateXP(userSnapshot){
	var userId = userSnapshot.name();
	console.log("User " + userId + " is getting new experiance");
}

refActive.on('value', function(allActive) {
	  purgeActives(allActive);
});

refActive.on('child_added', function(dataSnapshot) {
  purgeActives(dataSnapshot);
});
