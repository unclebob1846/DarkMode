window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	var self = this;
	this.config.Design.UserMenu = {
		buttons: {},
	};
	this[this.dID]("onLogin", function(){
		console.log("LOGIN");
		console.log($(".user-menu"));
		self.elements["userMenu"] = $(".user-menu");
		console.log("LOGIN");
		self.elements["userMenuList"] = self.elements["userMenu"].find("ul");
		console.log("LOGIN");
		self.elements["userMenuPanel"] = self.elements["userMenuList"].find(".user");
		console.log("LOGIN");
		self.elements["userMenuProgressText"] = self.elements["userMenuPanel"].find(".user-progress-text");
		console.log("LOGIN");
		self[self.dID]("addTick", "userMenu", 2000, "tickUserMenu");
		for (var key in self.config.Design.UserMenu.buttons)
		{
			self[self.dID]("addUserMenuItemElement", key);
		}
	});
	this[this.dID]("onLogout", function(){
		self[self.dID]("removeTick", "userMenu");	
	});
	callback();
});

window[window.dID][window.dID+"a"]("readyDesignUserMenu", function() {
});

window[window.dID][window.dID+"a"]("addUserMenuItem", function(name, callback) {
	this.config.Design.UserMenu.buttons[name] = callback;
	
	if (this.config.loggedIn)
	{
		this[this.dID]("addUserMenuItemElement", name);
	}
});

window[window.dID][window.dID+"a"]("addUserMenuItemElement", function(name) {
	if (this.config.loggedIn)
	{
		var liElement = $('<li>'+name+'</li>');
		liElement.click(this.config.Design.UserMenu.buttons[name]);
		this.elements["userMenuList"].add(liElement);
	}
});
 
window[window.dID][window.dID+"a"]("tickUserMenu", function(deltaTime) {
	if (this.youNow.session.user != null && this.youNow.session.user.userId > 0)
	{
		this.elements["userMenuProgressText"].html(this.language["userProgress"].replace("%1", this.youNow.session.user.progress).replace("%3", Math.floor(this.youNow.session.user.realLevel)+1));
	}
});