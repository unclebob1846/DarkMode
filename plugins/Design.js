    w.DarkMode.prototype.selectHeader = function(key) {
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

    };

    w.DarkMode.prototype.openSettings = function(key) {
        this.currentPage = "settings";
        window.history.pushState({
            "html": "",
            "pageTitle": ""
        }, "", "https://www.younow.com/settings/" + key);
    };

w[dID][dID+"x"]("addHeader", function(header, key) {
	var self = this;
	var li = $('<li></li>');

	var headerEl = $('<div class="header">' + header.label + '</div>');
	var contentEl = $('<div class="content"></div>');
	if (header.hasSettings == true) {
		var icon = $('<div style="cursor:pointer;float:right;margin-top:-3px;"><img src="' + this.config.images.settings + '" /></div>');
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
		self.selectHeader(key);
	});
	li.append(headerEl);
	li.append(contentEl);
	this.elements["left"].append(li);
});

w[dID][dID+"x"]("bootDesign", function(callback) {
    this[dID]("addButton");
	callback();
});

w[dID][dID+"x"]("addButton", function() {
	var container = $(".user-actions");
	var button = $(".user-actions").find("[translate=header_golive]");
	var self = this;

	var newButton = $("<button></button>");
	newButton.attr("class", "pull-right btn btn-primary");

	if (this.inDarkMode == "1") {
		newButton.html(this[dID]("getLang", "goLight"));
		newButton.css('background-color', '#999');
		newButton.css('border-color', '#444');
	} else {
		newButton.html(this[dID]("getLang", "goDark"));
		newButton.css('background-color', '#333');
		newButton.css('border-color', '#111');
	}
	newButton.css('height', '27');
	newButton.css('visibility', 'visible');
	newButton.insertAfter(container);

	newButton.click(function() {
		window.localStorage.setItem("inDarkMode", window.localStorage.getItem("inDarkMode") == "1" ? "0" : "1");
		if (window.localStorage.getItem("inDarkMode") == "1") {
			window.localStorage.setItem("browse", window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
			window.location.href = "https://www.younow.com/explore/";
		} 
		else {
			window.location.reload();
		}
	});
	button.remove();
});


window[dID][dID+"a"]("applyDesign", function() 
{
	var c = this[dID]("getConfig");
	var self = this;
	$('#main').remove();
	$('.newFooter').remove();
	$('.nav-logo').children()[0].remove();
	$('.nav-logo').append($('<img src="' + c.images.logo + '" style="width:auto;" height="40" />'));
	$('[ng-model=searchBox]').attr("placeholder", "Search AttentionWhore");
	this.page = $('<div id="darkPage"></div>');
	this.elements = {};
	this.headers = {
		"userList": {
			"label": this[dID]("getLang", "userList"),
			"hasSettings": false,
		},
		"leveller": {
			"label": this[dID]("getLang", "leveller"),
		},
		"massLiker": {
			"label": this[dID]("getLang", "massLiker"),
			"hasSettings": true,
		},
	};
	this.elements["left"] = $('<ul id="left"></ul>');
	for (var key in this.headers) {
		this.addHeader(this.headers[key], key);
	}

	this.selectHeader("userList");

	this.elements["right"] = $('<div id="right"></div>');
	this.headers["userList"].content.append((this.elements["trendingPeopleHeader"] = $('<strong>' + this.language["trendingPeople"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleContent"] = $('<ul id="trendingPeople"></ul>')));
	this.headers["userList"].content.append((this.elements["editorsPickHeader"] = $('<strong>' + this.language["editorsPick"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["editorsPickArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["editorsPickContent"] = $('<ul id="editorsPick"></ul>')));
	this.headers["userList"].content.append((this.elements["friendsHeader"] = $('<strong>' + this.language["friends"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["friendsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["friendsContent"] = $('<ul id="friends"></ul>')));
	this.headers["userList"].content.append((this.elements["trendingTagsHeader"] = $('<strong>' + this.language["trendingTags"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingTagsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingTagsContent"] = $('<ul id="trendingTags"></ul>')));
	
	this.headers["massLiker"].content.html('<div style="float:left; clear: both;"><input type="checkbox" id="massLikerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
		'<div style="float:left;margin-top:5px;"><span>' + this[dID]("getLang", massLikerEnabled + ' </span></div></div>' +
		'<div id="massLikerStats"></div>');

	this.headers["viewerBot"].content.html('<div style="float:left; clear:both;"><span>'+this[dID]("getLang", streamer+':</span></div>'+
											  '<div style="float:left;"><input type="text" style="width:180px;" value="" id="viewerBotStreamer" /></div>'+
										   '<div style="float:right;margin-top:5px;float: right;"><button id="viewerBotButton" class="btn btn-primary">' + this[dID]("getLang", love + ' </button></div></div>');

		
	this.headers["leveller"].content.html('<div style="float:left; clear:both;"><span>'+this[dID]("getLang", desiredLevel+':</span></div>'+
										  '<div style="float:left;"><input type="number" style="width:180px;" value="'+this.config.leveller.desiredLevel+'" id="desiredLevel" /></div>'+
		'<div style="float:left; clear: both;"><input type="checkbox" id="levellerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
		'<div style="float:left;margin-top:5px;"><span>' + this[dID]("getLang", levellerActive + ' </span></div></div>' +
		'<div id="levellerStats"></div>');

	this.headers["chatBot"].content.html('<div style="float:left; clear: both;"><input type="checkbox" disabled readonly id="chatBotEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
		'<div style="float:left;margin-top:5px;"><span>' + this[dID]("getLang", chatbotEnabled + ' </span></div></div>');
	
	$(document.body).append(this.page);
	$(document.body).append((this.elements["tooltip"] = $('<div id="tooltip"></div>')));
	this.page.append(this.elements["left"]);
	this.page.append(this.elements["right"]);
	
	} catch(e){}
	setInterval(function() {
		self.tick();
	}, 10);
	var b = window.localStorage.getItem("browse");
	if (b != null && b != "") {
		window.history.pushState({
			"html": "",
			"pageTitle": ""
		}, "", "https://www.younow.com/" + b);
		window.localStorage.setItem("browse", "");
	}

	var a = $('.navbar-content');
	//        a.append($('<div style="float: right;margin-top:-5px;margin-right: 10px;"><span id="nextMessageIn"></span></div>'));
	var self = this;
	//      this.elements["nextMessageIn"] = $('#nextMessageIn');

	$(document.body).append((this.onSound = $('<audio src="https://github.com/FluffyFishGames/JuhNau-Darkmode/raw/master/on.mp3" />')));
	$(document.body).append((this.offSound = $('<audio src="https://github.com/FluffyFishGames/JuhNau-Darkmode/raw/master/off.mp3" />')));

	var self = this;
	
	this.elements["viewerBotButton"] = $('#viewerBotButton');
	this.elements["viewerBotButton"].click(function() {
		self.viewerBot($('#viewerBotStreamer').val());
	});

	
	this.elements["massLikerEnabled"] = $('#massLikerEnabled');
	this.elements["massLikerEnabled"].change(function() {
		if (self.elements["massLikerEnabled"].is(":checked")) {
			if (self.config.playSounds)
			{
				self.onSound.prop("currentTime", 0);
				self.onSound.trigger("play");
			}
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
			if (self.config.playSounds)
			{
				self.offSound.prop("currentTime", 0);
				self.offSound.trigger("play");
			}
			self.config.massLiker.active = false;
		}
	});

	this.elements["desiredLevel"] = $('#desiredLevel');
	this.elements["desiredLevel"].change(function() {
		var l = parseInt(self.elements["desiredLevel"].val());
		if (l > self.config.leveller.levelCap) l = self.config.leveller.levelCap;
		self.config.leveller.desiredLevel = l;
		self.elements["desiredLevel"].val(l);
		window.localStorage.setItem("config.leveller.desiredLevel", self.config.leveller.desiredLevel);
	});
	
	this.elements["levellerEnabled"] = $('#levellerEnabled');
	this.elements["levellerEnabled"].change(function() {
		if (self.elements["levellerEnabled"].is(":checked")) {
			if (self.config.playSounds)
			{
				self.onSound.prop("currentTime", 0);
				self.onSound.trigger("play");
			}
			self.leveller = null;
			self.config.leveller.active = true;
		} else {
			if (self.config.playSounds)
			{
				self.offSound.prop("currentTime", 0);
				self.offSound.trigger("play");
			}
			self.config.leveller.active = false;
		}
	});
};
