window[window.dID][window.dID+"a"]("selectHeader", function(key) {
	var c = 0;
	for (var k in this.headers) {
		c++;
	}
	for (var k in this.headers) {
		if (k == key) {
			this.headers[k].li.css("height", "calc(100% - " + ((c - 1) * 30) + "px)");
		} else {
			this.headers[k].li.css("height", 30);
		}
	}
});

window[window.dID][window.dID+"a"]("addStylesheet", function(file) {
	var self = this;
	$.ajax(file, {
		dataType: "text",
		success: function(text, b, c)
		{
			for (var key in self.config.Design.ids)
			{
				var r = new RegExp("#"+key+"\\s", "g");
				text = text.replace(r, "#"+self.config.Design.ids[key]+" ");
			}
			var style = $('<style type="text/css"></style>');
			for (var i = 0; i < text.length; i+=4096)
			{
				var textNode = document.createTextNode(text.substring(i, i + 4096));
				style.append(textNode);
			}
			$('head').append(style);
		},
		error: function(a, b, c)
		{
		}
	});
});

window[window.dID][window.dID+"a"]("openSettings", function(key) {
	this.currentPage = "settings";
	
	window.history.pushState({
		"html": "",
		"pageTitle": ""
	}, "", "https://www.younow.com/settings/" + key);
});

window[window.dID][window.dID+"a"]("parseNumber", function(n){
	var rx = /(\d+)(\d{3})/;
	return String(n).replace(/^\d+/, function(w) {
		while (rx.test(w)) {
			w = w.replace(rx, '$1.$2');
		}
		return w;
	});
});

window[window.dID][window.dID+"a"]("parseTime", function(d) {
	var hours = Math.floor(d / (60 * 60));
	var minutes = Math.floor(d / (60)) % 60;
	var seconds = Math.floor(d % 60);
	var time = "";
	if (hours > 0) time += hours + ":";
	if (minutes > 9) time += minutes + ":";
	else time += "0" + minutes + ":";
	if (seconds > 9) time += seconds;
	else time += "0" + seconds;
	return time;
});

window[window.dID][window.dID+"a"]("addHeader", function(key, header) {
	var self = this;
	var li = $('<li></li>');

	var headerEl = $('<div class="header">' + header.label + '</div>');
	var contentEl = $('<div class="content"></div>');
	if (header.hasSettings == true) {
		var icon = $('<div style="cursor:pointer;float:right;margin-top:-3px;"><img src="' + this.config.Design.images.settings + '" /></div>');
		icon.click(function(e) {
			self.openSettings(key);
			e.stopPropagation();
		});
		headerEl.append(icon);
	}
	header.header = headerEl;
	header.content = contentEl;
	header.li = li;
	header.header.click(function() {
		self[self.dID]("selectHeader", key);
	});
	li.append(headerEl);
	li.append(contentEl);
	this.elements["left"].append(li);
	this.headers[key] = header;
	if (this.config.Design.SelectedHeader == null)
		this.config.Design.SelectedHeader = key;
	this[this.dID]("selectHeader", this.config.Design.SelectedHeader);
});

window[window.dID][window.dID+"a"]("updateElements", function(elements) {
	for (var key in this.config.Design.ids)
	{
		if (this.elements[key] != null)
		{
			if (!jQuery.contains(document.documentElement, this.elements[key]))
			{
				this.elements[key] = null;
			}
		}
		var el = $('#'+this.config.Design.ids[key])
		if (el != null && el.length > 0)
			this.elements[key] = $('#'+this.config.Design.ids[key]);
	}
});

window[window.dID][window.dID+"a"]("addIDs", function(elements) {
	if (this.config.Design.ids == null)
		this.config.Design.ids = {};
	for (var i = 0; i < elements.length; i++)
	{
		if (this.config.Design.ids[elements[i]] == null)
			this.config.Design.ids[elements[i]] = this[this.dID]("random") + $.md5(this.clientID + elements[i]);
	}
});

window[window.dID][window.dID+"a"]("bootDesign", function(callback) {
	this[this.dID]("addIDs", ["darkPage", "left", "right", "tooltip"]);
	this.headers = {};
	callback();
});

window[window.dID][window.dID+"a"]("readyDesign", function() {
	if (this.config.inDarkMode)
	{
		this[this.dID]("addStylesheet", "https://fluffyfishgames.github.io/css/DarkMode.css");
		this[this.dID]("addTick", "design", 20, "tickDesign");
	}
	this[this.dID]("addButton");
	if (this.config.inDarkMode)
	{
		var self = this;
		$('#'+$.md5(this.dID+'_Loader')).animate({opacity: 0}, 300, function(){
			$('#'+$.md5(self.dID+'_Loader')).remove();
		});
		this[window.dID]("applyDesign");
	}
});

window[window.dID][window.dID+"a"]("tickDesign", function(deltaTime) {
	this[this.dID]("design"+this.config.Router.currentPage.charAt(0).toUpperCase() + this.config.Router.currentPage.substring(1), deltaTime);
});


        /*if (data["type"] == "count") {
            this.elements["tooltip"].html('<div style="padding:5px;">x' + data.count + '</div>');
        } else if (data["type"] == "streamer" || data["type"] == "friend") {
        } else if (data["type"] == "likeCost") {
            if (this.currentStreamer.username.toLowerCase() == "drachenlord_offiziell")
                this.elements["tooltip"].html('<div style="padding:5px;"><img width="16" src="' + this.config.images.coins + '" />' + this.language.nobodyLikesDragon + '</div>');
            else
                this.elements["tooltip"].html('<div style="padding:5px;"><img width="16" src="' + this.config.images.coins + '" />' + data["cost"] + '</div>');
        }
    };*/
	
window[window.dID][window.dID+"a"]("getStreamTooltip", function(data) {
	var extra = "";
	if (data["viewers"] != null)
		extra += '<div class="value"><img style="margin-top:3px;" width="16" src="' + this.config.Design.images.views + '" /><span>' + this[this.dID]("parseNumber", data["viewers"]) + '</span></div>';
	if (data["likes"] != null)
		extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.Design.images.likes + '" /><span>' + this[this.dID]("parseNumber", data["likes"]) + '</span></div>';
	if (data["shares"] != null)
		extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.Design.images.shares + '" /><span>' + this[this.dID]("parseNumber", data["shares"]) + '</span></div>';
	if (data["fans"] != null)
		extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.Design.images.fans + '" /><span>' + this[this.dID]("parseNumber", data["fans"]) + '</span></div>';
	if (data["isWatching"] != null)
		extra += '<div class="value"><img style="margin-top:3px;" width="16" src="' + this.config.Design.images.views + '" /><span>' + data["isWatching"] + '</span></div>';
	var pic = this[this.dID]("getProfilePicture", data.userid);
	var c = "";
	if (data.broadcastId != null) {
		pic = this[this.dID]("getBroadcastPicture", data.broadcastId)
		var c = "wide";
	}
	this.elements["tooltip"].html('<div class="img ' + c + '"><img height="128" src="' + pic + '" /></div><div class="content"><div class="title"><img src="' + this.config.Design.images.star + '" style="float:left;margin-right: 5px;"/>' + data["level"] + ' ' + data["username"] + '</div>' + extra + '</div>');
});

window[window.dID][window.dID+"a"]("showTooltip", function(e, data) {	
	this.elements["tooltip"].css("left", e.pageX + 5);
	this.elements["tooltip"].css("display", "block");

	if (this.config.Design.lastTooltipObject != data) 
	{
		this[this.dID]("parse"+data.type.charAt(0).toUpperCase()+data.type.substring(1)+"Tooltip", data);
	}
	this.config.Design.lastTooltipObject = data;
	if (e.pageX + this.elements["tooltip"].width() > $(window).width() - 20)
		this.elements["tooltip"].css("left", e.pageX - 320 - 5);
	if (e.pageY - this.elements["tooltip"].height() < 5)
		this.elements["tooltip"].css("top", e.pageY + 5);
	else
		this.elements["tooltip"].css("top", e.pageY - 5 - this.elements["tooltip"].height());
});

window[window.dID][window.dID+"a"]("hideTooltip", function() {
	this.elements["tooltip"].css("display", "none");
});
	
window[window.dID][window.dID+"a"]("addButton", function() {
	var container = $(".user-actions");
	var button = $(".user-actions").find("[translate=header_golive]");
	if (button != null && button.length > 0)
	{
		button.remove();
	}
	var self = this;

	var newButton = $("<button></button>");
	newButton.attr("class", "pull-right btn btn-primary");

	if (this.config.inDarkMode) {
		newButton.html(this.language["goLight"]);
		newButton.css('background-color', '#999');
		newButton.css('border-color', '#444');
	} else {
		newButton.html(this.language["goDark"]);
		newButton.css('background-color', '#333');
		newButton.css('border-color', '#111');
	}
	newButton.css('height', '27');
	newButton.css('visibility', 'visible');
	newButton.insertAfter(container);

	newButton.click(function() {
		window.localStorage.setItem(self[self.dID]("name","inDarkMode"), window.localStorage.getItem(self[self.dID]("name","inDarkMode")) == "1" ? "0" : "1");
		if (window.localStorage.getItem(self[self.dID]("name","inDarkMode")) == "1") {
			window.localStorage.setItem(self[self.dID]("name","browse"), window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
			window.location.href = "https://www.younow.com/explore/";
		} 
		else {
			window.location.reload();
		}
	});
});

window[window.dID][window.dID+"a"]("applyDesign", function() 
{
	var self = this;
	$('#main').remove();
	$('.newFooter').remove();
	$('.nav-logo').children()[0].remove();
	$('.nav-logo').append($('<img src="' + this.config.Design.images.logo + '" style="width:auto;" height="40" />'));
	$('.search-field').attr("placeholder", "Search AttentionWhore");
	this.page = $('<div id="'+this.config.Design.ids.darkPage+'"></div>');
	this.elements = {};

	this.elements["left"] = $('<ul id="'+this.config.Design.ids.left+'"></ul>');
	this[this.dID]("addHeader", "userList", {
		"label": this.language.userList,
		"hasSettings": false,
	});

	this[this.dID]("selectHeader", "userList");

	this.elements["right"] = $('<div id="'+this.config.Design.ids.right+'"></div>');
	this.headers["userList"].content.append((this.elements["trendingPeopleHeader"] = $('<strong>' + this.language["trendingPeople"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleContent"] = $('<ul></ul>')));
	this.headers["userList"].content.append((this.elements["editorsPickHeader"] = $('<strong>' + this.language["editorsPick"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["editorsPickArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["editorsPickContent"] = $('<ul></ul>')));
	this.headers["userList"].content.append((this.elements["friendsHeader"] = $('<strong>' + this.language["friends"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["friendsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["friendsContent"] = $('<ul></ul>')));
	this.headers["userList"].content.append((this.elements["trendingTagsHeader"] = $('<strong>' + this.language["trendingTags"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingTagsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingTagsContent"] = $('<ul></ul>')));
	
	$(document.body).append(this.page);
	$(document.body).append((this.elements["tooltip"] = $('<div id="'+this.config.Design.ids.tooltip+'"></div>')));
	this.page.append(this.elements["left"]);
	this.page.append(this.elements["right"]);
	this[this.dID]("fireDesign");
});
