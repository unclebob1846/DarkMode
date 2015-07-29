w[dID][dID+"x"]("bootYouNow", function() {
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

	var r = allServices('younow');
	var c = this[dID]("getConfig");
	c.youNow = {
		config: r.config,
		api: r.Api,
		session: r.session,
		pusher: r.pusher,
		search: r.searchService,
		urlRouter: r["$urlRouter"],
		state: r["$state"],
		view: r["$view"],
		swf: r.swf,
		modal: r["$modal"],
		broadcasterService: r["broadcasterService"],
		facebook: r["Facebook"],
		instagram: r["instagram"],
		twitter: r["twitter"],
		googleplus: r["google"],
	};
	
	if (window.localStorage.getItem("inDarkMode") == "1")
	{
		c.youNow.urlRouter.update = function(a) {
			return true;
		};
		c.youNow.urlRouter.sync = function() {};
		c.youNow.urlRouter.listen = function() {};
		c.youNow.urlRouter.href = function(c, d, e) {                                                                                                                                                                                                                                                                               
			return "";
		};
		c.youNow.urlRouter.push = function(c, d, e) {};

		c.youNow.state.get = function(a, b) {
			return true;
		};
		c.youNow.state.go = function(a, b, c) {
			return true;
		};
		c.youNow.state.href = function(a, b, c) {
			return "";
		};
		c.youNow.state.reload = function() {};
		c.youNow.state.transitionTo = function(a, b, c) {};
		c.youNow.view.load = function(c, d) {};
		c.youNow.swf.newBroadcaster = function(a) {
			return false;
		};
		c.youNow.broadcasterService.addBroadcast = function(a, b, c, d, e, f) {
			return false;
		};
		c.youNow.broadcasterService.switchBroadcaster = function(a, b, c, d) {
			return false;
		};
		c.youNow.broadcasterService.showBroadcaster = function(a) {
			return false;
		};
		c.youNow.broadcasterService.switchToBroadcast = function(a) {
			return false;
		};
		c.youNow.broadcasterService.trackBroadcaster = function() {
			return false;
		};
		c.youNow.broadcasterService.updateBroadcaster = function(a, b, d) {
			return false;     
		};
		
		this[dID]("applyDesign");
	}
});

w[dID][dID+"x"]("getBroadcastPicture", function(broadcastId) {
	var c = this[dID]("getConfig");
	return c.youNow.config.broadcasterThumb + broadcastId;
});

w[dID][dID+"x"]("getProfilePicture", function(userid){
	return 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + userid;
});