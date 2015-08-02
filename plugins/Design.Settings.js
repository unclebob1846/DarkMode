window[window.dID][window.dID+"a"]("bootDesignSettings", function(callback)
{
	this[this.dID]("addRoute", "settings", /settings/, "openSettings", 4);
	this[this.dID]("addIDs", ['settings']);
	this[this.dID]("onPageChange", function(){
		if (self.config.Router.currentPage != "profile")
		{
			self[self.dID]("removeTick", "updateProfileStream");
		}
	});
	callback();
});