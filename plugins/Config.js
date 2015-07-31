window[window.dID][window.dID+"a"]("bootConfig",
    function(callback)
	{
		var load = {};
		for (var i = 0; i < this.plugins.length; i++)
		{
			load[this.plugins[i]] = "https://fluffyfishgames.github.io/data/"+this.plugins[i]+".json";
		}
		this.config = {};
		var loaded = 0;
		var loading = this.plugins.length;
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
					console.log(key);
					console.log(a);
					console.log(b);
					console.log(c);
					loaded++;
					if (loaded == loading)
						callback();
				}
			});
		};
		
		
	    for (var key in load)
		{
			d(key, load[key]);
	    }
	}
);