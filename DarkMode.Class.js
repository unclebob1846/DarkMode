window[window.dID+"b"] = function(plugins)
{
	console.log("Dark modes loves you! "+window.dID);
	this.dID = window.dID;
	this[this.dID+"a"]("random", function()
	{
		var a = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var k = Math.floor(5 + Math.random() * 10);
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
	var d = function(i){
	    if (i < plugins.length)
			self[self.dID]("boot"+plugins[i], function(){d(i+1);});
		else
		{
			for (var ll = 0; ll < plugins.length; ll++)
				self[self.dID]("ready"+plugins[ll]);
		}
	};
    for (var j = 0; j < plugins.length; j++)
	{
		jQuery.getScript('https://FluffyFishGames.github.io/plugins/'+plugins[j]+'.js',
			function(){
				loaded++;
				if (loaded == plugins.length)
				{
					d(0);
					window.dID = null;
				}
			}
		);
	}
};

window[window.dID+"b"].prototype[dID] = function(functionName)
{
	if (this[this.dID+"x"][functionName] != null)
		return this[this.dID+"x"][functionName].apply(this, Array.prototype.slice.call(arguments, 1));
	return null;
};

window[window.dID+"b"].prototype[dID+"a"] = function(functionName, func)
{
    if (this[this.dID+"x"] == null)
		this[this.dID+"x"] = {};
	
	while (true)
	{
		var m = this[dID]("random");
	    if (this[m] == null)
		{
			this[m] = func;
			this[this.dID+"x"][functionName] = this[m];
			break;
		}
	}
};