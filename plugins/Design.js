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
			$('head').append($('<style>'+text+'</style>'));
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

window[window.dID][window.dID+"a"]("addHeader", function(key, header) {
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
	this.headers[key] = header;
});

window[window.dID][window.dID+"a"]("bootDesign", function(callback) {
    if (window.localStorage.getItem(this.clientID+".inDarkMode") == "1")
	{
		this[this.dID]("addStylesheet", "https://fluffyfishgames.github.io/css/DarkMode.css");
		this[this.dID]("addTick", "design", 20, "tickDesign");
	}
	this.headers = {};
	callback();
});

window[window.dID][window.dID+"a"]("readyDesign", function() {
	console.log("A");
	this[this.dID]("addButton");
	if (window.localStorage.getItem(this.clientID+".inDarkMode") == "1")
	{
		$('#'+this.dID+'_Loader').animate({opacity: 0}, 300);
	}
});

window[window.dID][window.dID+"a"]("tickDesign", function(deltaTime) {

});

window[window.dID][window.dID+"a"]("addButton", function() {
	console.log("A");
	var container = $(".user-actions");
	var button = $(".user-actions").find("[translate=header_golive]");
	if (button != null && button.length > 0)
	{
		button.remove();
	}
	var self = this;

	var newButton = $("<button></button>");
	newButton.attr("class", "pull-right btn btn-primary");

	if (window.localStorage.getItem(this[this.dID]("name","inDarkMode")) == "1") {
		newButton.html(this[this.dID]("getLang", "goLight"));
		newButton.css('background-color', '#999');
		newButton.css('border-color', '#444');
	} else {
		newButton.html(this[this.dID]("getLang", "goDark"));
		newButton.css('background-color', '#333');
		newButton.css('border-color', '#111');
	}
	newButton.css('height', '27');
	newButton.css('visibility', 'visible');
	newButton.insertAfter(container);

	newButton.click(function() {
		window.localStorage.setItem(this[this.dID]("name","inDarkMode"), window.localStorage.getItem(this[this.dID]("name","inDarkMode")) == "1" ? "0" : "1");
		if (window.localStorage.getItem(this[this.dID]("name","inDarkMode")) == "1") {
			window.localStorage.setItem(this[this.dID]("name","browse"), window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
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
	$('.nav-logo').append($('<img src="' + c.images.logo + '" style="width:auto;" height="40" />'));
	$('[ng-model=searchBox]').attr("placeholder", "Search AttentionWhore");
	this.page = $('<div id="darkPage"></div>');
	this.elements = {};
	this.headers = {
		"userList": {
			"label": this.language.userList,
			"hasSettings": false,
		}
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
	
	$(document.body).append(this.page);
	$(document.body).append((this.elements["tooltip"] = $('<div id="tooltip"></div>')));
	this.page.append(this.elements["left"]);
	this.page.append(this.elements["right"]);
	
});
