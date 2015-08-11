window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	callback();
});

window[window.dID][window.dID+"a"]("readyDesignUserMenu", function(callback) {
	if (this.config.inDarkMode)
	{
		this.elements["userMenu"] = $(".user-menu");
		this.elements["userMenuList"] = this.elements["userMenu"].find("ul")[0];
		this.elements["userMenuPanel"] = this.elements["userMenuList"].find(".user")[0];
		this[this.dID]("addTick", "userMenu", 2000, "tickUserMenu");
	}
	callback();
});

window[window.dID][window.dID+"a"]("userMenu", function(callback) {
	
});