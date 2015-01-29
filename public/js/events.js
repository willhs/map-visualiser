//-------------- event handling for DOM elements ----------------

var recordExplButton = document.getElementById("record-exploration-button"),
playExplButton = document.getElementById("play-exploration-button"),
pauseExplButton = document.getElementById("pause-exploration-button"),
stopExplButton = document.getElementById("stop-exploration-button"),
saveExplButton = document.getElementById('save-exploration-button'),
deleteExplButton = document.getElementById('delete-exploration-button'),
resetExplButton = document.getElementById("reset-exploration-button"),
explChooser = document.getElementById("exploration-selector"),
userNameInput = document.getElementById("username-input"),
passwordInput = document.getElementById("password-input"),
logonButton = document.getElementById("logon-button"),
messageBar = document.getElementById("percent"),
notificationContainer = document.getElementById("notification-container"),
removeNotification = document.getElementById("remove-notification"),
quickplayNotification = document.getElementById("quickplay-notification"),
notificationSelector = document.getElementById("notification-selector");


//explorations

recordExplButton.addEventListener("click", function(){
	if (recording)
		stopRecording();
	else
		startRecording();
});

playExplButton.addEventListener('click', function () {
	if (!paused)
		startPlayback(selectedExploration);
	else {
		elapsedCityEventTime = -1;
		resumePlayback(selectedExploration);
	}
});

pauseExplButton.addEventListener('click', function(){
	pausePlayback(selectedExploration);
});

stopExplButton.addEventListener('click', function(){
	stopPlayback(selectedExploration);
});

saveExplButton.onclick = saveExploration;

resetExplButton.onclick = resetExplorations;

explChooser.onclick = updateSelectedExploration;

//users
var guestUsers = ["obama", "john", "lorde", "will"];

guestUsers.forEach(function(userName){
	document.getElementById(userName).onclick= function() {
		userNameInput.value = userName;
		passwordInput.value = "password";
	};
});

//submit button
logonButton.onclick = function(){

	// if noone is logged on
	if(userLoggedOn()){
		if (!recording)
			logout(currentUser);
	}
	else{
		attemptLogon(userNameInput.value, passwordInput.value);
	}
};
//share button
document.getElementById("submit-shared-file").addEventListener('click',function(){

	var userLabelValue = document.getElementById("user-input").value;
	console.log(userLabelValue);
	if(userLabelValue!=null && userLabelValue!=currentUser.name && selectedExploration!=null){
		saveFileToSharedUser(userLabelValue);
		var selectedExplName = selectedExploration.name;
		document.getElementById("expl-sent-message").innerHTML = "Sent to: "+userLabelValue+ "     ExplName:"+ selectedExplName;
	}
});
//notifications
notificationContainer.addEventListener('click',function(){
	stopRecording();
	if(showListNotifications()){
		resetVisibility(notificationSelector, "visible");


	}
	else{
		resetVisibility(notificationSelector, "hidden");
		resetVisibility(removeNotification, "hidden");
		resetVisibility(quickplayNotification, "hidden");
	}

});

//new account
var myWindow;
var newAccount = document.getElementById("create-new-account");
newAccount.onclick = function(){
	myWindow = window.open("newAccountPopupWindow.html", "_blank", "toolbar=yes, scrollbars=no, resizable=no, top=500, left=800, width=270, height=180");
};

//remove current choice exploration
deleteExplButton.onclick = function(){
	if(selectedExploration==null){
		return;
	}
	if(currentUser.explorations.indexOf(selectedExploration)<0){
		return;
	}
	deleteExploration(selectedExploration);
	deselectExploration();
};

removeNotification.addEventListener("click", function(){
	var selected = currentUser.getSharedExploration()[notificationSelector.options[notificationSelector.selectedIndex].value];
	selected.isNew = false;
	setExplorationIsOld(selected);

	resetVisibility(notificationSelector, "hidden");
	resetVisibility(removeNotification, "hidden");
	resetVisibility(quickplayNotification, "hidden");
	updateNotifications();
	deselectExploration();
});
quickplayNotification.addEventListener("click", function(){
	selected = currentUser.getSharedExploration()[notificationSelector.options[notificationSelector.selectedIndex].value];
	//var quickPlayExploration = new Exploration();
	//quickPlayExploration = selected;
	startPlayback(selected);
	selected.isNew = true;
	updateNotifications();


});

resetExplorations();