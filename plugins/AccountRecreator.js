window[window.dID][window.dID+"a"]("bootAccountRecreator", function(callback) {
	callback();
});

window[window.dID][window.dID+"a"]("readyAccountRecreator", function() {
	this[this.dID]("addUserMenuItem", this.language.recreateAccount, function(){
	
	});
});
