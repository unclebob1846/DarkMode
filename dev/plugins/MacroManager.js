window[window.dID][window.dID+"a"]("bootMacroManager", function(callback) {
	this[this.dID]("addLanguageTable", "MacroManager", "https://fluffyfishgames.github.io/"+this.baseFolder+"language/MacroManager.json");
	callback();
});

window[window.dID][window.dID+"a"]("readyMacroManager", function(callback) {
	this[this.dID]("addSettingsTab", this.language.MacroManager.settingsTitle, function(){
		self.elements.settingsContent.html("Macros");
	});
	
	this[self.dID]("addHeader", "macroManager", {
		"label": self.language["MacroManager"].title,
		"settings": true
	});
	this[this.dID]("updateMacroManagerContent");
});

window[window.dID][window.dID+"a"]("updateLevellerContent", function(callback) {
	if (this.headers["macroManager"] != null && this.headers["macroManager"].content != null)
	{
		var self = this;
		if (!this.config.loggedIn)
		{
			this.headers["macroManager"].content.html('<span>'+this.language["MacroManager"].loginNeeded+'</span>');
		}
		else if (this.config.banned)
		{
			this.headers["macroManager"].content.html('<span>'+this.language["MacroManager"].banned+'</span>');
		}
		else
		{
			
		}
	}
});
