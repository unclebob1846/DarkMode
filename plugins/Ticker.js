window[dID][dID+"x"]("bootTicker",
    function()
	{
		var self = this;
		var c = this[dID]("getConfig");
	    setInterval(function() {
		    self[dID]("tick");
		}, c.settings.baseTick);
	}
);

window[dID][dID+"x"]("tick",
    function()
	{
		var self = this;
		var c = this[dID]("getConfig");
		var d = (new Date()).getTime();
		for (var key in c.ticker)
		{
		    if (c.ticker[key].lastFired < d - c.ticker[key].interval)
			{
				this[dID](c.ticker[key].functionName);
				c.ticker[key].lastFired = d - c.ticker[key].interval;
			}
		}
	}
);

window[dID][dID+"x"]("addTick",
    function(name, interval, functionName)
	{
	    var c = this[dID]("getConfig");
		if (c.ticker == null)
			c.ticker = {};
		c.ticker[name] = {interval: interval, functionName: functionName, lastFired: 0};
	}
);