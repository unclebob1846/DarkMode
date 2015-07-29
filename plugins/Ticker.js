window[dID][dID+"x"]("bootTicker", 
	function(callback)
	{
		this.config.ticker = {};
		callback();
	}
);

window[dID][dID+"x"]("readyTicker",
    function()
	{
		var self = this;
		setInterval(function() {
		    self[dID]("tick");
		}, this.config.settings.baseTick);
	}
);

window[dID][dID+"x"]("tick",
    function()
	{
		var self = this;
		var d = (new Date()).getTime();
		if (this.lastTick == null)
			this.lastTick = d;
		var delta = d - this.lastTick;
		for (var key in this.config.ticker)
		{
		    if (this.config.ticker[key].lastFired < d - this.config.ticker[key].interval)
			{
				this[dID](this.config.ticker[key].functionName, delta);
				this.config.ticker[key].lastFired = d - this.config.ticker[key].interval;
			}
		}
		this.lastTick = d;
	}
);

window[dID][dID+"x"]("addTick",
    function(name, interval, functionName)
	{
		this.config.ticker[name] = {interval: interval, functionName: functionName, lastFired: 0};
	}
);