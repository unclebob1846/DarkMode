window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	var self = this;
	this[this.dID]("onLogin", function(){
		self.elements["userMenu"] = $(".user-menu");
		self.elements["userMenuList"] = self.elements["userMenu"].find("ul");
		self.elements["userMenuPanel"] = self.elements["userMenuList"].find(".user");
		self.elements["userMenuProgressText"] = self.elements["userMenuPanel"].find(".user-progress-text");
		self[self.dID]("addTick", "userMenu", 2000, "tickUserMenu");	
	});
	this[this.dID]("onLogout", function(){
		self[self.dID]("removeTick", "userMenu");	
	});
	callback();
});

window[window.dID][window.dID+"a"]("readyDesignUserMenu", function() {
});
 
window[window.dID][window.dID+"a"]("tickUserMenu", function(callback) {
	if (this.youNow.session.user != null && this.youNow.search.user.userId > 0)
	{
		this.elements["userMenuProgressText"].html(this.config.language["userProgress"].replace("%1", this.youNow.session.user.progress).replace("%3", Math.floor(this.youNow.session.user.realLevel)+1));
	}
});