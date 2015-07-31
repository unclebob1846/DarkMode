window[window.dID][window.dID+"a"]("bootConfig",
    function(callback)
	{
		var load = {};
		for (var i = 0; i < this.plugins.length; i++)
		{
			load[this.plugins[key]] = "https://fluffyfishgames.github.io/data/"+this.plugins[i]+".json";
		}
		this.config = {};
		var loaded = 0;
		var loading = 0;
		var self = this;
	    var d = function(key, url)
		{
			$.ajax(url, {
				dataType: "json",
				success: function(json, b, c)
				{
					self.config[key] = json;
					loaded++;
					if (loaded == loading)
						callback();
				},
				error: function(a, b, c)
				{
					loaded++;
					if (loaded == loading)
						callback();
				}
			});
		};
		
		var loading = 0;
	    for (var key in load)
		{
			d(key, load[key]);
			loading++;
	    }
	}
);