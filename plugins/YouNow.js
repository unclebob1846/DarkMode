window[window.dID][window.dID+"a"]("bootYouNow", function(callback) {
	function allServices(mod, r) {
		var inj = angular.element(document).injector().get;
		if (!r) r = {};
		angular.forEach(angular.module(mod).requires, function(m) {
			allServices(m, r)
		});
		angular.forEach(angular.module(mod)._invokeQueue, function(a) {
			try {
				r[a[2][0]] = inj(a[2][0]);
			} catch (e) {}
		});
		return r;
	}

	this.youNow = allServices('younow');
	
	if (this.config.inDarkMode == "1")
	{
		this.youNow["$urlRouter"].update = function(a) {
			return true;
		};
		this.youNow["$urlRouter"].sync = function() {};
		this.youNow["$urlRouter"].listen = function() {};
		this.youNow["$urlRouter"].href = function(c, d, e) {                                                                                                                                                                                                                                                                               
			return "";
		};
		this.youNow["$urlRouter"].push = function(c, d, e) {};

		this.youNow["$state"].get = function(a, b) {
			return true;
		};
		this.youNow["$state"].go = function(a, b, c) {
			return true;
		};
		this.youNow["$state"].href = function(a, b, c) {
			return "";
		};
		this.youNow["$state"].reload = function() {};
		this.youNow["$state"].transitionTo = function(a, b, c) {};
		this.youNow["$view"].load = function(c, d) {};
		this.youNow["swf"].newBroadcaster = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].addBroadcast = function(a, b, c, d, e, f) {
			return false;
		};
		this.youNow["broadcasterService"].switchBroadcaster = function(a, b, c, d) {
			return false;
		};
		this.youNow["broadcasterService"].showBroadcaster = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].switchToBroadcast = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].trackBroadcaster = function() {
			return false;
		};
		this.youNow["broadcasterService"].updateBroadcaster = function(a, b, d) {
			return false;     
		};
	}
	callback();
});

window[window.dID][window.dID+"a"]("getBroadcastPicture", function(broadcastId) {
	return this.youNow.config.broadcasterThumb + broadcastId;
});

window[window.dID][window.dID+"a"]("getProfilePicture", function(userid){
	return 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + userid;
});

window[window.dID][window.dID+"a"]("loginTwitter", function(callback){
	var twitter = {};
	if (this.youNow.twitterData != null)
	{
		self.youNow.session.login(this.youNow.twitterData).then(function(data) {
			callback();
		});
	}
	else 
	{
		var url = this.youNow.config.settings.ServerHomeBaseUrl + 'twitterLogin.php';
		var loginWindow = window.open(url, 'Twitter Login', 'location=0, status=0, width=800, height=400, scrollbars=1');
		window.twitterPopup = loginWindow;

		window.twitterSuccessCallback = function(userInfo) {
			var relevant = {};
			var nameTokens = userInfo.name ? userInfo.name.split(' ') : [];
			loginWindow.close();
			
			relevant.twitterId = userInfo.id;
			relevant.firstName = nameTokens[0] || '';
			relevant.lastName = nameTokens[1] || '';
			relevant.nickname = userInfo.screen_name || '';
			relevant.thumb = userInfo.profile_image_url || '';
			relevant.description = userInfo.description || '';
			relevant.url = userInfo.screen_name ? 'http://www.twitter.com/' + userInfo.screen_name : '';
			relevant.connections = userInfo.followers_count;
			relevant.oauthToken = userInfo.oauth_token;
			relevant.oauthTokenSecret = userInfo.oauth_token_secret;
			relevant.location = userInfo.location;
			console.log("A");
			self.youNow.twitterData = relevant;
			self.youNow.session.login(self.youNow.twitterData).then(function(data) {
				callback();
			});
		};
	}
});