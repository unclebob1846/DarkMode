window[window.dID][window.dID+"a"]("bootConfig",
    function(callback)
	{
		var load = {
			images: "https://fluffyfishgames.github.io/data/Images.json",
			countries: "https://fluffyfishgames.github.io/data/Countries.json",
			languages: "https://fluffyfishgames.github.io/data/Languages.json",
			deviceMapping: "https://fluffyfishgames.github.io/data/DeviceMapping.json",
			settings: "https://fluffyfishgames.github.io/data/Settings.json",
			requests: "https://fluffyfishgames.github.io/data/Requests.json"
		};
		this.config = {};
		var loaded = 0;
		var loading = 0;
		var self = this;
	    var d = function(key)
		{
			console.log(key + " => " + load[key]);
			$.ajax(load[key], {
				dataType: "json",
				success: function(json, b, c)
				{
				console.log(key + " => " + json);
				
					self.config[key] = json;
					loaded++;
				}
			});/*
			$.getJSON(load[key], function(data) {
				self.config[key] = data;
				loaded++;
				if (loaded == loading)
				{
				
					callback();
				}
			})  .done(function() {
    console.log( "second success" );
  })
  .fail(function(a, b, c) {
    console.log( "error" + b + c);
  })
  .always(function() {
    console.log( "complete" );
  });*/
		};
		
		var loading = 0;
	    for (var key in load)
		{
			d(key);
			loading++;
	    }
	}
);