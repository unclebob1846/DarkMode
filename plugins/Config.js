window[window.dID][window.dID+"a"]("bootConfig",
    function(callback)
	{
		var load = {};
		for (var i = 0; i < this.plugins.length; i++)
		{
			load[this.plugins[i]] = "https://fluffyfishgames.github.io/data/"+this.plugins[i]+".json"+'?v='+(Math.random()*1000000);
		}
		this.config = {inDarkMode: window.localStorage.getItem(this[this.dID]("name", "inDarkMode")) == "1"};
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

window[window.dID][window.dID+"a"]("setConfigValue", function(key, value){
	window.localStorage.setItem(this[this.dID]("name", key), value);
});

window[window.dID][window.dID+"a"]("getConfigValue", function(key, def){
	var val = window.localStorage.getItem(this[this.dID]("name", key));
	if (val == null)
		return def;
	return val;
});