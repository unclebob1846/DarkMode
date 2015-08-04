window[window.dID][window.dID+"a"]("bootLeveller", function(callback) {
	var self = this;
	this[this.dID]("addIDs", ['desiredLevel', 'levellerActive', 'levellerStats']);
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "leveller", {
			"label": self.language.leveller
		});
		
		self.headers["leveller"].content.html('<div style="float:left; clear:both;"><span>'+self.language.desiredLevel+':</span></div>'+
												'<div style="float:left;"><input type="number" style="width:180px;" value="'+self.config.Leveller.desiredLevel+'" id="'+self.config.Design.ids.desiredLevel+'" /></div>'+
												'<div style="float:left; clear: both;"><input type="checkbox" id="'+self.config.Design.ids.levellerActive+'" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
												'<div style="float:left;margin-top:5px;"><span>' + self.language.levellerActive + ' </span></div></div>' +
												'<div id="'+self.config.Design.ids.levellerStats+'"></div>');
		
		self[self.dID]("updateElements");
		
		self.elements.desiredLevel.change(function() {
			var l = parseInt(self.elements.desiredLevel.val());
			if (l > self.config.Leveller.levelCap) l = self.config.Leveller.levelCap;
			self.config.Leveller.desiredLevel = l;
			self.elements.desiredLevel.val(l);
		});
		
		self.elements.levellerActive.change(function() {
			if (self.elements.levellerActive.is(":checked")) {
				self.leveller = null;
				self[self.dID]("addTick", "leveller", 100, "leveller");
			} else {
				self[self.dID]("removeTick", "leveller");
			}
		});
	});
    callback();
});

window[window.dID][window.dID+"a"]("leveller", function(callback) {
	if (this.leveller == null)
	{
		var login = "";
		if (this.youNow.session.user.twitterAuth == 1)
			login = "twitter";
		else if (this.youNow.session.user.googleAuth == 1)
			login = "google";
		else if (this.youNow.session.user.instagramAuth == 1)
			login = "instagram";
		else if (this.youNow.session.user.facebookAuth == 1)
			login = "facebook";
		this.leveller = {
			'task': 'leveling',
			'login': login,
			'username': this.youNow.session.user.profile,
			'level': this.youNow.session.user.level,
			'levelsLeft': (this.config.Leveller.desiredLevel - Math.floor(this.youNow.session.user.level))
		};
	}

	var self = this;
	$('#levellerStats').html('<div style="float:left;clear:both; font-weight:bold; color:#ddd; width:180px;">'+this.language.currentTask+'</div>'+
							 '<div style="float:left;clear:both; font-size:10px;color:#ddd; width:180px;">'+this.language[this.leveller.task]+'</div>'+
							 '<div style="float:left;clear:both; font-weight:bold; color:#ddd;width:180px;">'+this.language.level+'</div>'+
							 '<div style="float:left;clear:both; font-size:10px;color:#ddd; width:180px;">'+this[this.dID]("parseNumber", this.leveller.level)+'</div>');
	if (this.leveller.task == 'leveling') {
		if (this.leveller.levelsLeft > 0){
			this.leveller.task = 'waiting';
			$.ajax({
				xhr: function() {
					var xhr = jQuery.ajaxSettings.xhr();
					var setRequestHeader = xhr.setRequestHeader;
					xhr.setRequestHeader = function(name, value) {
						if (name == 'X-Requested-With') return;
						setRequestHeader.call(this, name, value);
					}
					return xhr;
				},
				url: 'https://www.younow.com/php/api/channel/updateSettings',
				method: "POST",
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'X-Requested-By': this.youNow.session.user.requestBy,
				},
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					"tsi": this.config.tsi,
					"tdi": this.config.tdi,
					"userId": this.youNow.session.user.userId,
					"channelId": this.youNow.session.user.userId,
					"deactivation": 1
				},
				success: function(json, b, c) {
					/*self.youNow.session.authenticate["google"]().then(function(data) {
						self.youNow.session.login(data, true).then(function(data) {
							self.leveller.levelsLeft--;
							self.leveller.level++;
							self.leveller.task = 'leveling';
						});
					});*/
					self[self.dID]("loginInstagram", function() {
						self.leveller.levelsLeft--;
						self.leveller.level++;
						console.log("READY");
						self.leveller.task = 'leveling';
					}, true);
				},
				error: function(a, b, c) {}
			});
			this.leveller.task = 'waiting';
		}
		else {
			this.leveller.task = 'renaming';
			$.ajax({
				xhr: function() {
					var xhr = jQuery.ajaxSettings.xhr();
					var setRequestHeader = xhr.setRequestHeader;
					xhr.setRequestHeader = function(name, value) {
						if (name == 'X-Requested-With') return;
						setRequestHeader.call(this, name, value);
					}
					return xhr;
				},
				url: 'https://www.younow.com/php/api/channel/updateSettings',
				method: "POST",
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'X-Requested-By': this.youNow.session.user.requestBy,
				},
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					"tsi": this.config.tsi,
					"tdi": this.config.tdi,
					"userId": this.youNow.session.user.userId,
					"channelId": this.youNow.session.user.userId,
					"profileUrlString": this.leveller.username,
				},
				success: function(json, b, c) {
					self.youNow.session.getSession();
					self.leveller.task = 'finished';
				},
				error: function(a, b, c) {}
			});
		}
	}
});