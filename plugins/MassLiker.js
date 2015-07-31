window[window.dID][window.dID+"a"]("bootLeveller", function(callback) {
	var self = this;
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "massLiker", {
			"label": self.language.massLiker),
			"hasSettings": true,
		});
		
		var massLikerEnabledID = self[self.dID]("random") + "_ml0";
		self.headers["massLiker"].content.html('<div style="float:left; clear: both;"><input type="checkbox" id="' + massLikerEnabledID + '" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
												'<div style="float:left;margin-top:5px;"><span>' + self.language.massLikerEnabled + ' </span></div></div>' +
												'<div id="massLikerStats"></div>');

		var massLikerEnabled = $('#'+massLikerEnabledID);
		massLikerEnabled.change(function() {
			if (massLikerEnabled.is(":checked")) {
				self.config.massLiker.active = true;
				if (self.massLiker != null) {
					self.massLiker = null;
				}
			} else {
				if (self.massLiker.previousUrl != null)
					window.history.replaceState({
						"html": "",
						"pageTitle": ""
					}, "", self.massLiker.previousUrl);
				self.config.massLiker.active = false;
			}
		});
	});
    callback();
});