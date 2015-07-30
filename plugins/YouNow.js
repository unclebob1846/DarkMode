window[window.dID][window.dID+"a"]("bootYouNow", function() {
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
	this.youNow = {
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
		this.youNow.urlRouter.update = function(a) {
			return true;
		};
		this.youNow.urlRouter.sync = function() {};
		this.youNow.urlRouter.listen = function() {};
		this.youNow.urlRouter.href = function(c, d, e) {                                                                                                                                                                                                                                                                               
			return "";
		};
		this.youNow.urlRouter.push = function(c, d, e) {};

		this.youNow.state.get = function(a, b) {
			return true;
		};
		this.youNow.state.go = function(a, b, c) {
			return true;
		};
		this.youNow.state.href = function(a, b, c) {
			return "";
		};
		this.youNow.state.reload = function() {};
		this.youNow.state.transitionTo = function(a, b, c) {};
		this.youNow.view.load = function(c, d) {};
		this.youNow.swf.newBroadcaster = function(a) {
			return false;
		};
		this.youNow.broadcasterService.addBroadcast = function(a, b, c, d, e, f) {
			return false;
		};
		this.youNow.broadcasterService.switchBroadcaster = function(a, b, c, d) {
			return false;
		};
		this.youNow.broadcasterService.showBroadcaster = function(a) {
			return false;
		};
		this.youNow.broadcasterService.switchToBroadcast = function(a) {
			return false;
		};
		this.youNow.broadcasterService.trackBroadcaster = function() {
			return false;
		};
		this.youNow.broadcasterService.updateBroadcaster = function(a, b, d) {
			return false;     
		};
		
		this[this.dID]("applyDesign");
	}
});

window[window.dID][window.dID+"a"]("getBroadcastPicture", function(broadcastId) {
	var c = this[this.dID]("getConfig");
	return c.youNow.config.broadcasterThumb + broadcastId;
});

window[window.dID][window.dID+"a"]("getProfilePicture", function(userid){
	return 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + userid;
});