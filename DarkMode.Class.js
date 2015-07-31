window[window.dID+"b"] = function(dID, clientID, plugins)
{
	console.log("Dark modes loves you! "+dID);
	this.plugins = plugins;
	this.dID = dID;
	this.clientID = clientID;
	this[this.dID+"a"]("name", function(str)
	{
	    return $.md5(this.clientID + "." + str);
	});
	
	if (window.localStorage.getItem(this[this.dID]("name", "inDarkMode")) == "1" && window.location.href != "https://www.younow.com/explore/") 
	{
		window.location.href = "https://www.younow.com/explore/";
		window.localStorage.setItem(this[this.dID]("name", "browse"), window.location.href.replace("https://www.younow.com/", ""));
	}
	
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
	var loaded = 0;
	var self = this;
	var d = function(i) {
	    if (i < self.plugins.length)
		{
			if (self[$.md5(self.dID+".methods")][$.md5(this.dID+".boot"+self.plugins[i])] != null)
			{
				console.log("boot"+self.plugins[i]);
				self[self.dID]("boot"+self.plugins[i], function(){d(i+1);});
			}
			else 
			{
				d(i+1);
			}
		}
		else
		{
			/*for (var ll = 0; ll < plugins.length; ll++)
				self[self.dID]("ready"+plugins[ll]);*/
		}
	};
    for (var j = 0; j < plugins.length; j++) 
	{
	    $.ajax('https://fluffyfishgames.github.io/plugins/'+plugins[j]+'.js',
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
	if (functionName.substring(0,4) == "fire")
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
    if (this[mm] == null)
		this[mm] = {};
	
	while (true)
	{
		var m = this[this.dID]("random");
	    if (this[m] == null)
		{
			this[m] = func;
			this[mm][$.md5(this.dID+"."+functionName)] = m;
			break;
		}
	}
};