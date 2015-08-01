window[window.dID+"b"] = function(dID, clientID, plugins)
{
	console.log("Dark modes loves you! "+dID);
	this.plugins = plugins;
	this.dID = dID;
	this.clientID = clientID;
	
	this[this.dID+"a"]("random", function()
	{
		var a = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var k = Math.floor(10 + Math.random() * 10);
		var c = "";
		for (var i = 0; i < k; i++)
		{
			var d = Math.random() * (a.length - 1);
			c += a.substring(d, d + 1);
		}
		return c;
	});
	
	this[this.dID+"a"]("name", function(str)
	{
	    return $.md5(this.clientID + "." + str);
	});
	
	if (window.localStorage.getItem(this[this.dID]("name", "inDarkMode")) == "1" && window.location.href != "https://www.younow.com/explore/") 
	{
		window.location.href = "https://www.younow.com/explore/";
		window.localStorage.setItem(this[this.dID]("name", "browse"), window.location.href.replace("https://www.younow.com/", ""));
	}
	
	var loaded = 0;
	var self = this;
	var dl = function(i) {
		if (self.libraries != null && i < self.libraries.length)
		{
			$.ajax(self.libraries[i],
			{
				dataType: "text",
				success: function(text, b, c)
				{
					var element = $('<scr'+'ipt>'+text+'</scr'+'ipt>');
					$(document.body).append(element);
					dl(i+1);
				},
				error: function(a, b, c) 
				{
					dl(i+1);
				}
			});
		}
		else 
		{
			console.log("BOOT");
			//boot the system :)
			for (var ll = 0; ll < self.plugins.length; ll++)
			{
				self[self.dID](("ready"+self.plugins[ll]).replace(".",""));
			}
		}
	}
	var d = function(i) {
	    if (i < self.plugins.length)
		{
			var m = $.md5(self.dID+".methods");
			var f = $.md5(self.dID+".boot"+self.plugins[i].replace(".", ""));
			if (self[m][f] != null)
			{
				self[self.dID]("boot"+self.plugins[i].replace(".", ""), function(){d(i+1);});
			}
			else 
			{
				d(i+1);
			}
		}
		else
		{
			//before we are ready, we need to load all necessary libraries for plugins to work
			dl(0);
		}
	};
    for (var j = 0; j < plugins.length; j++) 
	{
		var url = plugins[j];
		if (!url.startsWith("https://"))
			url = 'https://fluffyfishgames.github.io/plugins/'+url+'.js';
	    $.ajax(url,
		{
			dataType: "text",
			success: function(text, b, c)
			{
				var element = $('<scr'+'ipt>'+text.replace(/window\.dID/g, '"'+self.dID+'"')+'</scr'+'ipt>');
				$(document.body).append(element);
				loaded++;
				if (loaded == plugins.length)
				{
					d(0);
				}
			}
		});
	}
};

window[window.dID+"b"].prototype[window.dID] = function(functionName)
{
	var m = $.md5(this.dID+".methods");
	var f = $.md5(this.dID+"."+functionName);
	if (functionName == "log")
	{
		if (this.log == null)
			this.log = [];
		this.log.push(arguments[1]);
	}
	else if (functionName == "addLibrary")
	{
		if (this.libraries == null)
			this.libraries = [];
		this.libraries.push(arguments[1]);
	}
	else if (functionName.substring(0,4) == "fire")
	{
		var n = $.md5(this.dID+".events."+functionName.substring(4));
		if (this[n] == null)
			this[n] = [];
		for (var i = 0; i < this[n].length; i++)
			this[n][i].apply(this, Array.prototype.slice.call(arguments, 1));
	}
    else if (functionName.substring(0,2) == "on")
	{
		var n = $.md5(this.dID+".events."+functionName.substring(2));
		if (this[n] == null)
			this[n] = [];
		this[n].push(arguments[1]);
	}
	else if (this[m][f] != null)
		return this[this[m][f]].apply(this, Array.prototype.slice.call(arguments, 1));
	return null;
};

window[window.dID+"b"].prototype[window.dID+"a"] = function(functionName, func)
{
	var mm = $.md5(this.dID+".methods")
	var nm = $.md5(this.dID+"."+functionName);
    if (this[mm] == null)
		this[mm] = {};
	
	while (true)
	{
		var m = "";
		if (functionName == "random")
			m = func();
		else 
			m = this[this.dID]("random");
	    if (this[m] == null)
		{
			this[m] = func;
			this[mm][nm] = m;
			break;
		}
	}
};