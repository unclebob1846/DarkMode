window[window.dID][window.dID+"a"]("bootLanguage", function(callback) {
	var loading = 0;
	var loaded = 0;
    var d = function(key, url)
	{
		$.ajax(url, {
			dataType: "json",
			success: function(json, b, c)
			{
				for (var k in json)
				{
					self.config.Language[k][key] = json[k];
				}
				loaded++;
				if (loaded == loading)
				{
					self.language = self.config.Language["de-DE"];
					callback();
				}
			},
			error: function(a, b, c)
			{
				loaded++;
				if (loaded == loading)
				{
					self.language = self.config.Language["de-DE"];
					callback();
				}
			}
		});
	};
	
	for (var key in this.config.languageTables)
	{
		loading++;
		d(key, this.config.languageTables[key]);
	}
});

window[window.dID][window.dID+"a"]("addLanguageTable", function(name, url) {
	if (this.config.languageTables == null)
		this.config.languageTables = {};
	this.config.languageTables[name] = url;
});