window[window.dID][window.dID+"a"]("bootDesignProfile", function(callback)
{
	this[this.dID]("addRoute", "profile", /[a-zA-Z0-9_\.]+\/channel/, "openProfile", 5);
	this.config.Design.Profile = {};
	this[this.dID]("addIDs", ['dashboardComments', 'writeComment', 'postComment', 'dashboardTab', 'previousBroadcastsTab', 'fansTab', 'fanOfTab', 'profile', 'profileHeader', 'profileBottom', 'profileContent', 'profilePage', 'toLive', 'fanButton']);
	callback();
});

window[window.dID][window.dID+"a"]("writePost", function(message, objectId, type) {
	if (objectId == null)
		objectId = 0;
	var self = this;
	this[this.dID]("sendRequest", "createPost", {
		channelID: this.config.Design.Profile.data.channelId,
		parentID: objectId,
		post: message
	}, function(json, success) {
		if (json["errorCode"] > 0) {} else {
			var post = {
				'post': message,
				'id': json["id"],
				'user': self.youNow.session.user,
				'isReplyable': true,
				'timeAgo': self[self.dID]("translateTime", "Just now"),
			};
			post.user.profileUrlString = post.user.profile;
			if (objectId > 0) {
				self.config.Design.Profile.posts[objectId].find(".comment").before(self[self.dID]("parseProfilePost", post, true));
			} else {
				self.elements["dashboardComments"].prepend(self[self.dID]("parseProfilePost", post, false));
			}
		}
	});
});

window[window.dID][window.dID+"a"]("openProfileTab", function(page) 
{
	this.elements["profileContent"].html("");
	this[this.dID]("updateElement");
	this.config.Design.Profile.currentPage = page;
	this.elements["dashboardTab"].removeClass("active");
	this.elements["previousBroadcastsTab"].removeClass("active");
	this.elements["fansTab"].removeClass("active");
	this.elements["fanOfTab"].removeClass("active");
	this.config.Design.Profile.posts = {};
	
	if (this.config.Design.Profile.currentPage == "dashboard")
	{
		this.elements["dashboardTab"].addClass("active");
		this.config.Design.Profile.dashboardPage = -1;
		this.elements["profileContent"].html('<textarea style="width:100%;height:60px;clear:both;float:left;" id="'+this.config.Design.ids["writeComment"]+'"></textarea><button style="display: block; clear:both;float:right;margin-top:5px;" id="'+this.config.Design.ids['postComment']+'" class="btn btn-confirm">' + this.language.post + '</button><div id="'+this.config.Design.ids['dashboardComments']+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
		var self = this;
		this.elements["writeComment"].on('keyup', function(e) {
			if (e.which == 13) {
				self[self.dID]("writePost", self.elements["writeComment"].val(), 0, "post");
				self.elements["writeComment"].val("");
			}
		});
		this.elements["postComment"].on('click', function(e) {
			self[self.dID]("writePost", self.elements["writeComment"].val(), 0, "post");
			self.elements["writeComment"].val("");
		});

		this.elements["dashboardComments"] = $('#'+this.config.Design.ids.dashboardComments);
		this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
	}
	else if (this.config.Design.Profile.currentPage == "previousBroadcasts")
	{
        this.elements["previousBroadcastsTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
	}
	else if (this.config.Design.Profile.currentPage == "fans")
	{
        this.elements["fansTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
    }
	else if (this.config.Design.Profile.currentPage == "fanOf")
	{
        this.profilePage = "fanOf";
        this.elements["fanOfTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
    }
});

window[window.dID][window.dID+"a"]("addProfilePage", function() 
{
	if (this.config.Design.Profile.hasMorePages == true) 
	{
		this.config.Design.Profile.dashboardPage++;
		this.config.Design.Profile.hasMorePages = false;
		var self = this;
		if (this.config.Design.Profile.currentPage == "dashboard") 
		{
			this[this.dID]("sendRequest", "getPosts", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.posts.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.posts[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasMore;
			});
		}
		if (this.config.Design.Profile.currentPage == "previousBroadcasts") {
			this[this.dID]("sendRequest", "getPreviousBroadcasts", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				if (self.config.Design.Profile.broadcasts == null)
					self.config.Design.Profile.broadcasts = {};
				for (var i = 0; i < json.posts.length; i++) {
					self.config.Design.Profile.broadcasts[json.posts[i].media.broadcast.broadcastId] = json.posts[i];
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.posts[i]));
				}
				
				self.config.Design.Profile.hasMorePages = json.hasMore;
				if (self.config.Design.Profile.lookForBroadcast != null)
				{
					if (self.config.Design.Profile.broadcasts[self.config.Design.Profile.lookForBroadcast] == null)
					{
						self[self.dID]("addProfilePage");
					}
					else 
					{
						self[self.dID]("openPreviousStream", self.config.Design.Profile.lookForBroadcast);
					}
				}
			});
		}
		if (this.config.Design.Profile.currentPage == "fans") {
			this[this.dID]("sendRequest", "getFans", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.fans.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.fans[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasNext == '1';
			});
		}
		if (this.config.Design.Profile.currentPage == "fanOf") {
			this[this.dID]("sendRequest", "getFansOf", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.fans.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.fans[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasNext == '1';
			});
		}
	}
});

window[window.dID][window.dID+"a"]("showPostOptions", function(postId, isComment) 
{
	var elx = $('<ul class="optionsMenu"><li>' + this.language.remove + '</li></ul>');
	$(this.config.Design.Profile.posts[postId].find(".options")).append(elx);
	var self = this;
	
	var ignoreFirst = true;
	var c = function() {
		if (ignoreFirst)
			ignoreFirst = false;
		else {
			elx.remove();
			$(document.body).unbind("click", c);
		}
	};
	$(document.body).click(c);
	$(elx.find("li")[0]).click(function() {
		$(self.config.Design.Profile.posts[postId]).remove();
		self[self.dID]("deletePost", {
			isComment: isComment ? '1' : '0',
			channelID: self.config.Design.Profile.data.channelId,
			postID: postId
		}, function(json, success) {});
	});
});

window[window.dID][window.dID+"a"]("checkComment", function(event, postId) 
{
	var element = this.config.Design.Profile.posts[postId].find(".comment").find("input")[0];
    if (event.which == 13) {
        this[this.dID]("writePost", element.val(), postId, "post");
        element.val("");
    }
});    

window[window.dID][window.dID+"a"]("changePostLike", function(postId, isComment) 
{
	if (this.config.Design.Profile.posts[postId] != null)
	{
		if (this.config.Design.Profile.posts[postId].liked)
		{
			this.config.Design.Profile.posts[postId].liked = false;
			this.config.Design.Profile.posts[postId].likes--;
			this.config.Design.Profile.posts[postId].element.find(".like").first().html('<img src="'+this.config.Design.images.likes+'" />'+this.language.like+''+(this.config.Design.Profile.posts[postId].likes > 0 ? this.language.otherLikes.replace('%1', this.config.Design.Profile.posts[postId].likes): ""));
			this[this.dID]("sendRequest", "unlikeObject", {channelID: this.config.Design.Profile.data.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
		}
		else 
		{
			this.config.Design.Profile.posts[postId].liked = true;
			this.config.Design.Profile.posts[postId].likes++;
			this.config.Design.Profile.posts[postId].element.find(".like").first().html('<img src="'+this.config.Design.images.thumbsDown+'" />'+this.language.unlike+''+(this.config.Design.Profile.posts[postId].likes > 1 ? this.language.otherLikes.replace('%1', this.config.Design.Profile.posts[postId].likes - 1): ""));
			this[this.dID]("sendRequest", "likeObject", {channelID: this.config.Design.Profile.data.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
		}
	}
});

window[window.dID][window.dID+"a"]("parseProfilePost", function(post, sub) 
{
	if (post.userId != null) {
		return $('<div class="userEntry entry"><a href="/' + post.profileUrlString + '" class="header"><img src="' + this[this.dID]("getProfilePicture", post.userId) + '"><div><strong>' + post.firstName + ' ' + post.lastName + '</strong><small>' + post.description + '</small></div></a></div>');
	} else {
		var self = this;
		var content = "";
		var replies = "";
		if (post.post != null && post.post != "")
			content += '<div class="text">' + post.post + '</div>';
		if (post.media != null) {
			if (post.media.ext != null)
				content += '<div class="image"><img src="https://cdn2.younow.com/php/api/post/getMedia/channelId=' + this.config.Design.Profile.data.channelId + '/id=' + post.id + '/ext=' + post.media.ext + '" /></div>';
			else if (post.media.snapshot != null)
				content += '<div class="image"><img src="https://cdn2.younow.com/php/api/getSnapshot/id=' + post.media.snapshot.snapshotId + '" /></div>';
			else if (post.media.broadcast != null) {
				var d = new Date(post.media.broadcast.dateAired);
				var gifts = '';
				for (var i in post.media.broadcast.gifts) {
					gifts += '<img src="https://cdn2.younow.com/images/profile/new/gifts/' + post.media.broadcast.gifts[i].giftSKU + '_pro.png" />';
				}
				content += '<div class="stream">' +
					'<img src="' + post.media.broadcast.broadcastThumbnail + '" />' +
					(post.media.broadcast.videoAvailable == 1 ? '<img onclick="window.history.pushState({\'html\':\'\',\'pageTitle\':\'\'},\'\', \'https://www.younow.com/'+this.config.Design.Profile.data.profile+'/channel/'+post.media.broadcast.broadcastId+'\');" class="play" src="' + this.config.Design.images.play + '" />' : '') +
					'<div>' +
					'<div style="float:left; width: 200px;">' +
					'<strong>' + d.toLocaleDateString(this.language.langCode) + ' ' + d.toLocaleTimeString(this.language.langCode) + '</strong>' +
					'<small style="clear:both;" class="label">#' + this[this.dID]("parseNumber", post.media.broadcast.tags) + '</small>' +
					'<img class="icon" src="' + this.config.Design.images.views + '"><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.totalViewers) + '</small>' +
					'<img class="icon" src="' + this.config.Design.images.time + '"><small class="label">' + this[this.dID]("parseTime", post.media.broadcast.broadcastLength) + '</small>' +
					'<img class="icon" src="' + this.config.Design.images.likes + '"><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.totalLikes) + '</small>' +
					'<img class="icon" src="' + this.config.Design.images.shares + '"><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.shares) + '</small>' +
					'</div>' +
					'<div style="float:right; width: calc(100% - 210px);">' +
					gifts +
					'</div>' +
					'</div>' +
					'</div>';
			}
		}
		var comment = "";
		if (post.isReplyable)
			comment = '<div class="comment"><img src="' + this[this.dID]("getProfilePicture", this.youNow.session.user.userId) + '" /><input type="text" /></div>';

		var options = "";
		if (post.user.userId == this.youNow.session.user.userId || this.config.Design.Profile.data.userId == this.youNow.session.user.userId)
			options = '<div class="options"><img src="' + this.config.Design.images.arrowDown + '" /></div>';
		
		var like = "";		
		this.config.Design.Profile.posts[post.id] = {};
		this.config.Design.Profile.posts[post.id].likes = parseInt(post.likesCount);
		if (post.like != null && post.like.user.userId == this.youNow.session.user.userId)
		{
			like = '<div class="like"><img src="'+this.config.Design.images.thumbsDown+'" />'+this.language.unlike+''+(this.config.Design.Profile.posts[post.id].likes > 1 ? this.language.otherLikes.replace('%1', this.config.Design.Profile.posts[post.id].likes - 1): "")+'</div>';
			this.config.Design.Profile.posts[post.id].liked = true;
		}
		else 
		{
			like = '<div class="like"><img src="'+this.config.Design.images.likes+'" />'+this.language.like+''+(this.config.Design.Profile.posts[post.id].likes > 0 ? this.language.otherLikes.replace('%1', this.config.Design.Profile.posts[post.id].likes): "")+'</div>';
			this.config.Design.Profile.posts[post.id].liked = false;
		}
		var el = null;
		if (sub == true)
			el = $('<div class="reply"><a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this[this.dID]("getProfilePicture", post.user.userId) + '"/><div><strong><img src="' + this.config.Design.images.star + '" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this[this.dID]("translateTime", post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>' + like);
		else
			el = $('<div class="entry"><a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this[this.dID]("getProfilePicture", post.user.userId) + '"/><div><strong><img src="' + this.config.Design.images.star + '" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this[this.dID]("translateTime", post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>' + like + comment + '</div>');
			
		if (post.replies != null) {
			for (var j = 0; j < post.replies.length; j++) {
				el.find(".comment").first().before(this[this.dID]("parseProfilePost", post.replies[j], true));
			}
		}
		el.find(".options").first().click(function(){
			self[self.dID]("showPostOptions", post.id, sub);
		});
		el.find(".like").first().click(function(){
			self[self.dID]("changePostLike", post.id, post.isComment);
		});
		if (post.isReplyable)
			el.find(".comment").first().find("input").keyup(function(e) {self[self.dID]("checkComment", e, post.id);});
		this.config.Design.Profile.posts[post.id].element = el;
		return el;
	}
});


window[window.dID][window.dID+"a"]("openProfile", function(parts) 
{
	var username = parts[0];
	this[this.dID]("updateElements");
	this.elements["right"].html('<div id="'+this.config.Design.ids['profile']+'">'+
	'<div id="'+this.config.Design.ids['profileHeader']+'"></div>'+
	'<div id="'+this.config.Design.ids['profileBottom']+'">'+
	'<div class="fade">'+
	'<a class="active" id="'+this.config.Design.ids['dashboardTab']+'">' + this.language.dashboard + '</a>'+
	'<a id="'+this.config.Design.ids['previousBroadcastsTab']+'">' + this.language.previousBroadcasts + '</a>'+
	'<a id="'+this.config.Design.ids['fansTab']+'">' + this.language.fansTab.replace("%1", "0") + '</a>'+
	'<a id="'+this.config.Design.ids['fanOfTab']+'">' + this.language.fanOf.replace("%1", "0") + '</a>'+
	'</div>'+
	'<div id="'+this.config.Design.ids['profileContent']+'"></div>'+
	'</div>'+
	'</div>');
	
	this[this.dID]("updateElements");
	var self = this;
	this.elements["profileContent"].bind('mousewheel DOMMouseScroll', function(event) {
		if (self.config.Design.Profile.hasMorePages) {
	//		if (self.elements["profileContent"].scrollTop() > 0)
				//self.animations.hideProfileHeader = true;
			//else
				//self.animations.hideProfileHeader = false;
			var l = self.elements["profileContent"][0].scrollHeight - self.elements["profileContent"].height() - 50;
			if (self.elements["profileContent"].scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) {
				self[self.dID]("addProfilePage");
			}
		}
	});
	this.elements["dashboardTab"].click(function() {
		self[self.dID]("openProfileTab", "dashboard");
	});
	this.elements["previousBroadcastsTab"].click(function() {
		self[self.dID]("openProfileTab", "previousBroadcasts");
	});
	this.elements["fansTab"].click(function() {
		self[self.dID]("openProfileTab", "fans");
	});
	this.elements["fanOfTab"].click(function() {
		self[self.dID]("openProfileTab", "fanOf");
	});
	this.config.Design.Profile.username = username;
	this[this.dID]("sendRequest", "getBroadcast", {
		username: username
	}, function(json, success) {
		self.config.Design.Profile.streamData = json;
		self[self.dID]("sendRequest", "getProfile", {
			channelID: self.config.Design.Profile.streamData.userId
		}, function(json, success) {
			self.config.Design.Profile.data = json;
			if (self.youNow.session.user.userId > 0) {
				self[self.dID]("sendRequest", "isFan", {
					userID: self.config.Design.Profile.streamData.userId
				}, function(json, success) {
					self.config.Design.Profile.isFan = json["fanOf"][self.config.Design.Profile.streamData.userId] == "fan";
					self[self.dID]("updateProfilePage");
				});
			} else {
				self[self.dID]("updateProfilePage");
			}
		});
	});
});

window[window.dID][window.dID+"a"]("likePost", function(objectID, channelID, isComment) 
{
	this[this.dID]("sendRequest", "likeObject", {
		objectID: objectID,
		channelID: channelID,
		isComment: isComment
	}, function(json, success) {
	});
});

window[window.dID][window.dID+"a"]("unlikePost", function(objectID, channelID, isComment) 
{
	this[this.dID]("sendRequest", "unlikeObject", {
		objectID: objectID,
		channelID: channelID,
		isComment: isComment
	}, function(json, success) {
	});
});

window[window.dID][window.dID+"a"]("updateProfilePage", function()
{
	var location = "";
	if (this.config.Design.Profile.data.country != null && this.config.Design.Profile.data.country != "")
		location += this.config.Design.Profile.data.country;
	if (this.config.Design.Profile.data.city != null && this.config.Design.Profile.data.city != "")
		location += ", " + this.config.Design.Profile.data.city;
	var created = new Date(this.config.Design.Profile.data.dateCreated);
	var createdString = created.toLocaleDateString(this.language.langCode) + ' ' + created.toLocaleTimeString(this.language.langCode);
	var fanButton = "";
	var socialButtons = "";
	this.elements["fansTab"].html(this.language.fansTab.replace("%1", this[this.dID]("parseNumber", this.config.Design.Profile.data.totalFans)));
	this.elements["fanOfTab"].html(this.language.fanOf.replace("%1", this[this.dID]("parseNumber", this.config.Design.Profile.data.totalFansOf)));
	if (this.config.Design.Profile.data.facebookId != null && this.config.Design.Profile.data.facebookId > 0)
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.config.Design.Profile.data.facebookId + '"><img src="' + this.config.Design.images.facebook + '" /></a>';
	if (this.config.Design.Profile.data.fbfn != null && this.config.Design.Profile.data.fbfn != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.config.Design.Profile.data.fbfn + '"><img src="' + this.config.Design.images.facebook + '" /></a>';
	if (this.config.Design.Profile.data.googleId != null && this.config.Design.Profile.data.googleId != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://plus.google.com/' + this.config.Design.Profile.data.googleId + '"><img src="' + this.config.Design.images.googleplus + '" /></a>';
	if (this.config.Design.Profile.data.twitterHandle != null && this.config.Design.Profile.data.twitterHandle != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.twitter.com/' + this.config.Design.Profile.data.twitterHandle + '"><img src="' + this.config.Design.images.twitter + '" /></a>';
	if (this.config.Design.Profile.data.instagramHandle != null && this.config.Design.Profile.data.instagramHandle != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.instagram.com/' + this.config.Design.Profile.data.instagramHandle + '"><img src="' + this.config.Design.images.instagram + '" /></a>';
	if (this.config.Design.Profile.data.youTubeUserName != null && this.config.Design.Profile.data.youTubeUserName != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.youtube.com/' + this.config.Design.Profile.data.youTubeUserName + '"><img src="' + this.config.Design.images.youtube + '" /></a>';
	if (this.youNow.session.user.userId > 0) {
		if (this.config.Design.Profile.data.isFan)
			fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float: left;" id="'+this.config.Design.ids.fanButton+'" class="btn btn-confirm"><img src="' + this.config.Design.images.removeFan + '" />' + this.language.unfan + '</button>';
		else
			fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float:left;" id="'+this.config.Design.ids.fanButton+'" class="btn btn-primary"><img src="' + this.config.Design.images.addFan + '" />' + this.language.fan + '</button>';
	}
	this.elements["profileHeader"].html('<div class="header">' +
		'<img src="https://cdn2.younow.com/php/api/channel/getCover/channelId=' + this.config.Design.Profile.data.userId + '" />' +
		'</div>' +
		'<div class="userBox">' +
		'<div class="userBar">' +
		'<div class="profilePicture">' +
		'<img style="height: 200px;" src="https://cdn2.younow.com/php/api/channel/getImage/channelId=' + this.config.Design.Profile.data.userId + '" />' +
		'<div style="'+(this.config.Design.Profile.streamData.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="live" id="isLive"><img src="'+this.config.Design.images.live+'" /></div>'+
		'<div class="info">' +
		'<strong><img style="float: left; margin-right: 5px; margin-top: 2px;" src="' + this.config.Design.images.star + '" /><span>' + this.config.Design.Profile.data.level + '</span> ' + this.config.Design.Profile.data.profile + '</strong><br />' +
		this.config.Design.Profile.data.description + '<br />' +
		'<div style="float:left; clear: both; margin-top:5px;">' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.location + ':</div>' +
		'<div style="float:left; width:150px;">' + location + '</div>' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.broadcastsCount + ':</div>' +
		'<div style="float:left; width:150px;">' + this[this.dID]("parseNumber", this.config.Design.Profile.data.broadcastsCount) + '</div>' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.dateCreated + ':</div>' +
		'<div style="float:left; width:150px;">' + createdString + '</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="buttons">' +
		socialButtons + fanButton + '<button id="'+this.config.Design.ids.toLive+'" style="float:left;height:32px;line-height:12px;font-weight:bold;margin-left:5px;'+(this.config.Design.Profile.streamData.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="btn btn-primary">'+this.language.toLive+'</button>'+
		'</div>' +
		'</div>'
	);
	this[this.dID]("updateElements");
	var self = this;
	this.elements["toLive"].click(function(){
		window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.config.Design.Profile.data.profile);
	});
	var self = this;
	if (fanButton != "") {
		this.elements["fanButton"].click(function() {
			if (self.config.Design.Profile.data.isFan) {
				self[self.dID]("sendRequest", "unfan", {
					channelID: self.config.Design.Profile.data.channelId
				}, function(json, success) {});
			} else {
				self[self.dID]("sendRequest", "fan", {
					channelID: self.config.Design.Profile.data.channelId
				}, function(json, success) {});
			}
			self.config.Design.Profile.isFan = !self.config.Design.Profile.isFan;
			self[self.dID]("updateProfilePage");
		});
	}
	if (this.config.Design.Profile.lookForBroadcast != null)
	{
		this[this.dID]("openProfilePage", "previousBroadcasts");
	}
	else 
	{
		this[this.dID]("openProfilePage", "dashboard");
		
	}
});