window[window.dID][window.dID+"a"]("bootAccountRecreator", function(callback) {
	this[this.dID]("addLanguageTable", "AccountRecreator", "https://fluffyfishgames.github.io/language/AccountRecreator.json");
	callback();
});

window[window.dID][window.dID+"a"]("readyAccountRecreator", function() {
	this[this.dID]("addUserMenuItem", this.language["AccountRecreator"]["menuTitle"], "refresh", function(){
	
	});
});
