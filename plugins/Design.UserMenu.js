window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	var self = this;
	this[this.dID]("onLogin", function(){
		console.log("LOGIN");
		self.elements["userMenu"] = $(".user-menu") 
		self.elements["userMenuList"] = self.elements["userMenu"].find("ul");
		self.elements["userMenuPanel"] = self.elements["userMenuList"].find(".user");
		self.elements["userMenuProgressText"] = self.elements["userMenuPanel"].find(".user-progress-text");
		self[self.dID]("addTick", "userMenu", 2000, "tickUserMenu");	
	});
	this[this.dID]("onLogout", function(){
		console.log("LOGOUT");
		self[self.dID]("removeTick", "userMenu");	
	});
	callback();
});

window[window.dID][window.dID+"a"]("readyDesignUserMenu", function() {
});
 
window[window.dID][window.dID+"a"]("tickUserMenu", function(deltaTime) {
	if (this.youNow.session.user != null && this.youNow.session.user.userId > 0)
	{
		this.elements["userMenuProgressText"].html(this.config.Language["userProgress"].replace("%1", this.youNow.session.user.progress).replace("%3", Math.floor(this.youNow.session.user.realLevel)+1));
	}
});