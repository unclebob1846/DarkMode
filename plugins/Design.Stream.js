window[window.dID][window.dID+"a"]("bootDesignStream", function(callback) {
    this[this.dID]("addIDs", ["streamBar", "streamView", "streamBar", "streamInfo", "stream", "likeImage", "likeCount", "shareCount", "time", "viewerCount", "chatTab", "audienceTab", "infoTab", "infoList", "viewerList", "chatOptions", "writeInChat", "writeInTrending", "writeInTag", "intoTag", "chatMessage", "trendingList", "chat"]);
    this[this.dID]("addRoute", "stream", /[a-zA-Z0-9_\.]+/, "openStream", 1);
	this[this.dID]("addLibrary", "https://fluffyfishgames.github.io/libs/flowplayer.js");
	this[this.dID]("addLibrary", "https://fluffyfishgames.github.io/libs/uaparser.js");
	this.config.Design.Stream = {};
	callback();
});

window[window.dID][window.dID+"a"]("openStream", function(parts) {
	this.config.Design.Stream.name = parts[0];
	var self = this;
	
	this[this.dID]("sendRequest", "getBroadcast", {
		username: this.config.Design.Stream.name
	}, function(json, success) {
		self.config.Design.Stream.data = json;
		if (json["errorCode"] > 0) {
			window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.config.Design.Stream.Name+"/channel");
		} else {
			self.streamerUpdated = true;
			self[self.dID]("updateStreamInfo");
		}
	});
});

window[window.dID][window.dID+"a"]("sendChatMessage", function(streamId, message) {
	if (this.elements["writeInChat"].is(':checked')) {
		this[this.dID]("sendRequest", "sendChatMessage", {
			channelID: streamId,
			message: message
		}, function(json, success) {});
	} else if (this.elements["writeInTrending"].is(':checked')) {
		var self = this;
		this[this.dID]("sendRequest", "getPlayData", {
			playDataURL: this.currentStreamer.PlayDataBaseUrl,
			userID: this.currentStreamer.userID
		}, function(json, success) {
			for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++) {
				self[self.dID]("sendRequest", "sendChatMessage", {
					channelID: json.onBroadcastPlay.queues[0].items[i].userId,
					message: message
				}, function(json, success) {});
			}
		});
	} else if (this.elements["writeInTag"].is(':checked')) {
		var self = this;
		this[this.dID]("sendRequest", "searchTag", {
			query: this.elements["intoTag"].val(),
			perPage: 100,
			page: 0
		}, function(json, success) {
			for (var i = 0; i < json.hits.length; i++) {
				self[self.dID]("sendRequest", "sendChatMessage", {
					channelID: json.hits[i].objectID,
					message: message
				}, function(json, success) {});
			}
		});
	}
});

window[window.dID][window.dID+"a"]("openAudience", function() {
	this.elements["chatMessage"].css("display", "none");
	this.elements["chatMessages"].css("display", "none");
	this.elements["chatOptions"].css("display", "none");
	this.elements["infoList"].css("display", "none");
	this.elements["viewerList"].css("display", "block");
	this.elements["chatTab"].removeClass("active");
	this.elements["infoTab"].removeClass("active");
	this.elements["audienceTab"].addClass("active");
	this[this.dID]("addTick", "updateViewers", 5000, "tickUpdateViewers");
});

window[window.dID][window.dID+"a"]("openChat", function() {
	this.elements["chatMessage"].css("display", "block");
	this.elements["chatMessages"].css("display", "block");
	this.elements["chatMessages"].scrollTop(this.elements["chatMessages"][0].scrollHeight);
	this.elements["chatOptions"].css("display", "block");
	this.elements["viewerList"].css("display", "none");
	this.elements["infoList"].css("display", "none");
	this.elements["audienceTab"].removeClass("active");
	this.elements["infoTab"].removeClass("active");
	this.elements["chatTab"].addClass("active");
});

window[window.dID][window.dID+"a"]("openInfo", function() {
	this.elements["chatMessage"].css("display", "none");
	this.elements["chatMessages"].css("display", "none");
	this.elements["chatOptions"].css("display", "none");
	this.elements["viewerList"].css("display", "none");
	this.elements["infoList"].css("display", "block");
	this.elements["chatTab"].removeClass("active");
	this.elements["audienceTab"].removeClass("active");
	this.elements["infoTab"].addClass("active");
});

window[window.dID][window.dID+"a"]("updateStreamInfo", function() {
	var self = this;
	if (this.config.Design.Stream.lastName != this.config.Design.Stream.name)
	{
		if (this.elements["stream"] == null) 
		{ 
			this.elements["right"].html(
				'<div id="'+this.config.Design.ids['stream']+'">'+
					'<div id="'+this.config.Design.ids['streamInfo']+'"></div>'+
					'<div class="outer">'+
						'<div class="stream">'+
							'<div id="'+this.config.Design.ids['streamView']+'">'+
							'</div>'+
							'<div id="'+this.config.Design.ids['streamBar']+'">' +
								'<div class="item">'+
									'<img id="'+this.config.Design.ids['likeImage']+'" src="' + this.config.Design.images.likes + '" />'+
									'<span id="'+this.config.Design.ids['likeCount']+'"></span>'+
								'</div>'+
								'<div class="item">'+
									'<img src="' + this.config.Design.images.shares + '" />'+
									'<span id="'+this.config.Design.ids['shareCount']+'"></span>'+
								'</div>'+
								'<div style="float:right;" class="item">'+
									'<img src="' + this.config.Design.images.time + '" />'+
									'<span id="'+this.config.Design.ids['time']+'"></span>'+
								'</div>'+
								'<div style="float:right;" class="item">'+
									'<img src="' + this.config.Design.images.views + '" />'+
									'<span id="'+this.config.Design.ids['viewerCount']+'"></span>'+
								'</div>' +
							'</div>'+
						'</div>'+
						'<div id="'+this.config.Design.ids['chat']+'">'+
							'<a class="tab active" id="'+this.config.Design.ids['chatTab']+'">' + this.language.chat + '</a>'+
							'<a class="tab" id="'+this.config.Design.ids['audienceTab']+'">' + this.language.audience + '</a>'+
							'<a class="tab last" id="'+this.config.Design.ids['infoTab']+'">' + this.language.infos + '</a>'+
							'<div id="'+this.config.Design.ids['infoList']+'"></div>'+
							'<ul id="'+this.config.Design.ids['viewerList']+'"></ul>'+
							'<ul id="'+this.config.Design.ids['chat']+'"></ul>'+
							'<div id="'+this.config.Design.ids['chatOptions']+'">'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" checked id="'+this.config.Design.ids['writeInChat']+'" />' + this.language.writeInChat + 
								'</div>'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" id="'+this.config.Design.ids['writeInTrending']+'" />' + this.language.writeInTrending + 
								'</div>'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" id="'+this.config.Design.ids['writeInTag']+'" />' + this.language.writeInTag + '<input type="text" id="intoTag" />'+
								'</div>'+
							'</div>'+
							'<textarea id="'+this.config.Design.ids['chatMessage']+'" maxlength="150"></textarea>'+
						'</div>'+
					'</div>'+
					'<div id="'+this.config.Design.ids['trendingList']+'"></div>'+
				'</div>');

			this[this.dID]("updateElements");
			
			this.elements["likeImage"].click(function() {
				if (self.config.Design.Stream.Data.username.toLowerCase() != "drachenlord_offiziell")
					self[self.dID]("like", self.currentStreamer.userId);
			});
			this.elements["likeImage"].mousemove(function(e) {
				self[self.dID]("showTooltip", e, {
					"type": "likeCost",
					"cost": self.currentStreamer.nextLikeCost
				});
			});
			
			this.elements["likeImage"].mouseout(function(e) {
				self[self.dID]("hideTooltip");
			});
			this.elements["audienceTab"].click(function(e) {
				self[self.dID]("openAudience")
			});
			this.elements["infoTab"].click(function(e) {
				self[self.dID]("openInfo");
			});
			this.elements["chatTab"].click(function(e) {
				self[self.dID]("openChat");
			});
			this.elements["writeInTag"].change(function() {
				if (window.localStorage.getItem(self[self.dID]("name", "warned")) != "1") {
					alert(self.language.chatWarning);
					window.localStorage.setItem(self[self.dID]("name", "warned"), "1");
				}
			});
			this.elements["writeInTrending"].change(function() {
				if (window.localStorage.getItem(self[self.dID]("name", "warned")) != "1") {
					alert(self.language.chatWarning);
					window.localStorage.setItem(self[self.dID]("name", "warned"), "1");
				}
			});
			this.elements["chatMessage"].keydown(function(e) {
				if (e.keyCode == 13) {
					self[self.dID]("sendChatMessage", self.currentStreamer.userId, self.elements["chatMessage"].val());
					self.elements["chatMessage"].val("");
				}
			})
			this.elements["chatMessage"].keyup(function(e) {
				if (e.keyCode == 13) {
					self.elements["chatMessage"].val("");
				}
			});
		}

		flowplayer(this.config.Design.ids.streamView, "https://FluffyFishGames.github.io/swf/flowplayer-3.2.18.swf", {
			clip: {
				url: this.config.Design.Stream.data.media.stream,
				live: true,
				scaling: 'fit',
				provider: 'rtmp'
			},
			plugins: {
				rtmp: {
					url: "flowplayer.rtmp-3.2.13.swf",
					netConnectionUrl: 'rtmp://' + this.config.Design.Stream.data.media.host + this.config.Design.Stream.data.media.app
				},
				controls: {
					all: false,
					play: false,
					scrubber: false,
					mute: true,
					volume: true,
					fullscreen: true,
				}
			},
			canvas: {
				backgroundGradient: 'none'
			}
		});
		
		this.config.Design.Stream.pusher = new Pusher('d5b7447226fc2cd78dbb', {
			cluster: "younow"
		});
		this.config.Design.Stream.pusherChannel = this.config.Design.Stream.pusher.subscribe("public-channel_" + this.config.Design.Stream.data.userId);
		this.config.Design.Stream.pusherChannel.bind('onLikes', function(data) {
			self.config.Design.Stream.data.likes = data.message.likes;
			self.config.Design.Stream.data.viewers = data.message.viewers;
		});
		this.config.Design.Stream.pusherChannel.bind('onViewers', function(data) {
			self.config.Design.Stream.data.likes = data.message.likes;
			self.config.Design.Stream.data.viewers = data.message.viewers;
		});
		this.config.Design.Stream.pusherChannel.bind('onChat', function(data) {
			for (var i = 0; i < data.message.comments.length; i++)
				self[self.dID]("addChatMessage", data.message.comments[i]);
		});
		for (var i = 0; i < this.config.Design.Stream.data.comments.length; i++)
			this[this.dID]("addChatMessage", this.config.Design.Stream.data.comments[i]);
		
		this.config.Design.Stream.lastName = this.config.Design.Stream.name;
	}
	
	var extraRight = "";
	if (this.config.Design.Stream.data.minChatLevel > 0)
		extraRight = '<div class="right">' + this.language.minChatLevel.replace("%1", this.config.Design.Stream.data.minChatLevel) + '</div>';
	this.elements["streamInfo"].html('<a style="text-decoration:none; color:#ddd;" href="/'+this.config.Design.Stream.data.user.profileUrlString+'/channel"><img src="' + this[this.dID]("getProfilePicture", this.config.Design.Stream.data.userId) + '" style="margin-top:-5px;margin-right:5px;" height="30" /><img src="' + this.config.Design.images.star + '" style="margin-right: 5px;margin-top:-4px;" />' + Math.floor(this.config.Design.Stream.data.userlevel) + ' <strong>' + this.config.Design.Stream.data.username + '</strong> (' + this.config.Design.Stream.data.country + ')</a> ' + this.language.in + ' <a href="/explore/tag/' + this.config.Design.Stream.data.tags[0] + '">#' + this.config.Design.Stream.data.tags[0] + '</A>' + extraRight);

	this.elements["likeCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.likes));
	this.elements["shareCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.shares));
	this.elements["viewerCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.viewers));
	this.elements["time"].html(this[this.dID]("parseTime", this.duration));

	var device = this.config.Design.Stream.data.broadcasterInfo.substring(0, this.config.Design.Stream.data.broadcasterInfo.indexOf('{'));
	var connection = "";
	var osVersion = "";
	var provider = "";
	var browser = "";
	var numCommas = (device.match(/,/g) || []).length;
	if (device.length < 40) //PHONE!
	{
		for (var k in this.config.deviceMapping) {
			device = device.replace(k, this.config.Design.deviceMapping[k]);
		}
		var parts = device.split(",");
		device = parts[0];
		connection = parts[1];
		provider = parts[2];
		osVersion = parts[3];
	} else {
		/*this.UAParser.setUA(device);
		browser = this.UAParser.getBrowser().name + " " + this.UAParser.getBrowser().version;
		osVersion = this.UAParser.getOS().name + " " + this.UAParser.getOS().version;
		device = this.UAParser.getDevice().vendor + " " + this.UAParser.getDevice().model;
		device = device.replace("undefined", "").replace("undefined", "").trim();*/
	}

	if (this.streamerUpdated) {
		this.elements["infoList"].html('<h2>Streamer</h2>' +
			'<div class="label">' + this.language.age + ':</div><div class="value">' + this.config.Design.Stream.data.age + '</div>' +
			'<div class="label">' + this.language.barsEarned + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.barsEarned) + '</div>' +
			'<div class="label">' + this.language.coins + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.coins) + '</div>' +
			'<div class="label">' + this.language.maxLikes + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.maxLikesInBroadcast) + '</div>' +
			'<div class="label">' + this.language.country + ':</div><div class="value">' + this.config.Design.Stream.data.country + '</div>' +
			'<div class="label">' + this.language.fans + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.totalFans) + '</div>' +
			'<div class="label">' + this.language.partner + ':</div><div class="value">' + this.language.partnerStatus[this.config.Design.Stream.data.partner] + '</div>' +
			'<div class="label">' + this.language.level + ':</div><div class="value">' + Math.floor(this.config.Design.Stream.data.userlevel) + ' (' + this.language.levelNeeded.replace("%1", Math.floor((this.config.Design.Stream.data.userlevel - Math.floor(this.config.Design.Stream.data.userlevel)) * 100) + '%').replace("%2", Math.ceil(this.config.Design.Stream.data.userlevel)) + ')</div>' +
			'<div class="label">' + this.language.points + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.points) + '</div>' +
			(device != "" ? '<div class="label">' + this.language.device + ':</div><div class="value">' + device + '</div>' : '') +
			(browser != "" ? '<div class="label">' + this.language.browser + ':</div><div class="value">' + browser + '</div>' : '') +
			(connection != "" ? '<div class="label">' + this.language.connection + ':</div><div class="value">' + connection + '</div>' : '') +
			(osVersion != "" ? '<div class="label">' + this.language.osVersion + ':</div><div class="value">' + osVersion + '</div>' : '') +
			(provider != "" ? '<div class="label">' + this.language.provider + ':</div><div class="value">' + provider + '</div>' : '') +
			'<h2>Stream</h2>' +
			'<div class="label">' + this.language.streamURL + ':</div><div class="value">rtmp://' + this.config.Design.Stream.data.media.host + this.config.Design.Stream.data.media.app + '/' + this.config.Design.Stream.data.media.stream + '<br /><a id="copyStreamURL">' + this.language.copy + '</a><textarea id="streamURL" style="display:none;">rtmp://' + this.config.Design.Stream.data.media.host + this.config.Design.Stream.data.media.app + '/' + this.config.Design.Stream.data.media.stream + '</textarea></div>' +
			'<div class="label">' + this.language.displayViewers + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.display_viewers) + '</div>' +
			'<div class="label">' + this.language.mobileViewers + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.mviewers) + '</div>' +
			'<div class="label">' + this.language.maxViewers + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.maxConcurrentViewers) + '</div>' +
			'<div class="label">' + this.language.tag + ':</div><div class="value">#' + this.config.Design.Stream.data.tags[0] + '</div>' +
			'<div class="label">' + this.language.position + ':</div><div class="value">' + this.config.Design.Stream.data.position + '</div>' +
			'<div class="label">' + this.language.reconnects + ':</div><div class="value">' + this.config.Design.Stream.data.reconnects + '</div>' +
			'<div class="label">' + this.language.featuredTime + ':</div><div class="value">' + this[this.dID]("parseTime", this.config.Design.Stream.data.featuredTime) + '</div>' +
			'<div class="label">' + this.language.giftsValue + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.giftsValue) + '</div>' +
			'<div class="label">' + this.language.newFans + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.fans) + '</div>' +
			'<div class="label">' + this.language.bitrate + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.lastQuality.bitrate) + '</div>' +
			'<div class="label">' + this.language.fps + ':</div><div class="value">' + this[this.dID]("parseNumber", this.config.Design.Stream.data.lastQuality.fps) + '</div>'
		);
		this.streamerUpdated = false;
		$('#copyStreamURL').click(function(e) {
			$('#streamURL').css("display", "block");
			$('#streamURL').select();

			try {
				document.execCommand('copy');
			} catch (err) {}
			$('#streamURL').css("display", "none");
		});
    };
});