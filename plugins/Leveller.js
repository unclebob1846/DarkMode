window[window.dID][window.dID+"a"]("bootLeveller", function(callback) {
	var self = this;
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "leveller", {
			"label": self.language.leveller
		});
		
		var levellerStatsID = self[self.dID]("random")+"_lv0";
		var desiredLevelID = self[self.dID]("random")+"_lv1";
		var levellerEnabledID = self[self.dID]("random")+"_lv2";
		self.headers["leveller"].content.html('<div style="float:left; clear:both;"><span>'+self.language.desiredLevel+':</span></div>'+
												'<div style="float:left;"><input type="number" style="width:180px;" value="'+self.config.Leveller.desiredLevel+'" id="'+desiredLevelID+'" /></div>'+
												'<div style="float:left; clear: both;"><input type="checkbox" id="'+levellerEnabledID+'" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
												'<div style="float:left;margin-top:5px;"><span>' + self.language.levellerActive + ' </span></div></div>' +
												'<div id="'+levellerStatsID+'"></div>');
												
		self.elements["levellerStats"] = $('#'+levellerStatsID);
		var desiredLevel = $('#'+desiredLevelID);
		desiredLevel.change(function() {
			var l = parseInt(desiredLevel.val());
			if (l > self.config.Leveller.levelCap) l = self.config.Leveller.levelCap;
			self.config.settings.Leveller.desiredLevel = l;
			desiredLevel.val(l);			
			window.localStorage.setItem(self[self.dID]("name", "config.leveller.desiredLevel"), self.config.Leveller.desiredLevel);
		});
		
		var levellerEnabled = $('#'+levellerEnabledID);
		levellerEnabled.change(function() {
			if (levellerEnabled.is(":checked")) {
				self.leveller = null;
				self.config.leveller.active = true;
			} else {
				self.config.leveller.active = false;
			}
		});
	});
    callback();
});