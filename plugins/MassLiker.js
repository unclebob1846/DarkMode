w[dID][dID+"x"]("bootLeveller", function(callback) {
	var self = this;
	this[dID]("onDesign", function()
	{
		self[dID]("addHeader", "massLiker", {
			"label": this[dID]("getLang", "massLiker"),
			"hasSettings": true,
		});
		
		self.headers["massLiker"].content.html('<div style="float:left; clear: both;"><input type="checkbox" id="massLikerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
												'<div style="float:left;margin-top:5px;"><span>' + this.language.massLikerEnabled + ' </span></div></div>' +
												'<div id="massLikerStats"></div>');

		var massLikerEnabled = $('#massLikerEnabled');
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