window[window.dID][window.dID+"a"]("bootDesignSettings", function(callback)
{
	this[this.dID]("addRoute", "settings", /settings/, "openSettings", 4);
	this[this.dID]("addIDs", ['settings', 'settingsContent']);
	this.config.Design.Settings = {tabs: {}};
	callback();
});

window[window.dID][window.dID+"a"]("addSettingsTab", function(label, func)
{
	this.config.Design.Settings.tabs[label] = func;
});

window[window.dID][window.dID+"a"]("openSettings", function(callback, page)
{
	this.elements["right"].html('<div id="'+this.config.Design.ids.settings+'"><ul class="tabsBar"></ul><div id="'+this.config.Design.ids.settingsContent+'"></div></div>');
	var tabs = this.elements["right"].find(".tabs").first();
	this[this.dID]("updateElements");
	var c = 0;
	for (var key in this.config.Design.Settings.tabs)
		c++;
	
	var addTab = function(key, func)
	{
		var li = $('<li style="width:'+(100/c)+'%">'+key+'</li>');
		li.click(function(){
			self.elements.settingsContent.html("");
			self.elements.settingsContent.append(func());
		});
	};
	var first = true;
	for (var key in this.config.Design.Settings.tabs)
	{
		addTab(key, this.config.Design.Settings.tabs[key]);
		if (page == key || first)
		{
			this.elements.settingsContent.html("");
			this.elements.settingsContent.append(this.config.Design.Settings.tabs[key]());
		}
	}
});