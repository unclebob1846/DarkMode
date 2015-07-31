window[window.dID][window.dID+"a"]("bootLeveller", function(callback) {
	var self = this;
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "leveller", {
			"label": this.language.leveller
		});
		self.headers["leveller"].content.html('<div style="float:left; clear:both;"><span>'+this.language.desiredLevel+':</span></div>'+
												'<div style="float:left;"><input type="number" style="width:180px;" value="'+this.config.settings.leveller.desiredLevel+'" id="desiredLevel" /></div>'+
												'<div style="float:left; clear: both;"><input type="checkbox" id="levellerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
												'<div style="float:left;margin-top:5px;"><span>' + this.language.levellerActive + ' </span></div></div>' +
												'<div id="levellerStats"></div>');
												

		var desiredLevel = $('#desiredLevel');
		desiredLevel.change(function() {
			var l = parseInt(desiredLevel.val());
			if (l > self.config.settings.leveller.levelCap) l = self.config.settings.leveller.levelCap;
			self.config.settings.leveller.desiredLevel = l;
			desiredLevel.val(l);
			
			window.localStorage.setItem("config.leveller.desiredLevel", self.config.leveller.desiredLevel);
		});
		
		var levellerEnabled = $('#levellerEnabled');
		levellerEnabled.change(function() {
			if (levellerEnabled.is(":checked")) {
				self.leveller = null;
				self.config.leveller.active = true;
			} else {
				self.config.leveller.active = false;
			}
		});
	});
    //callback();
});