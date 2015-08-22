window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	var self = this;
	this.config.Design.UserMenu = {
		buttons: {},
	};
	this[this.dID]("onLogin", function(){
		this.elements["userMenu"] = $(".user-menu");
		this.elements["userMenuList"] = self.elements["userMenu"].find("ul");
		this.elements["userMenuPanel"] = self.elements["userMenuList"].find(".user");
		this.elements["userMenuProgressText"] = self.elements["userMenuPanel"].find(".user-progress-text");
		this[self.dID]("addTick", "userMenu", 2000, "tickUserMenu");
		for (var key in this.config.Design.UserMenu.buttons)
		{
			this[this.dID]("addUserMenuItemElement", key);
		}
	});
	this[this.dID]("onLogout", function(){
		this[this.dID]("removeTick", "userMenu");	
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