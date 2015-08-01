window[window.dID][window.dID+"a"]("bootDesignExplore", function(callback) {
	this[this.dID]("addTick", "router", 20, "tickRouter");
	this.config.Router = {};
    callback();
});

window[window.dID][window.dID+"a"]("addRoute", function(regex, functionName) {
	if (this.config.Router.routes == null)
		this.config.Router.routes = [];
	this.config.Router.routes.push({
		regex: regex,
		functionName: functionName,
	});
});

window[window.dID][window.dID+"a"]("tickRouter", function(deltaTime) {
	if (this.config.Router.lastURL == null || this.config.Router.lastURL != window.location.href)
	{
		console.log(window.location.href);
		var url = window.location.href.replace("http://","").replace("https://", "").replace("www.younow.com/", "").replace("younow.com/", "");
		var parts = url.split("/");
		for (var i = 0; i < this.config.Router.routes.length; i++)
		{
		    if (url.match(this.config.Router.routes[i].regex))
			{
				console.log("MATCH"+window.location.href);
				this[this.dID](this.config.Router.routes[i].functionName, parts);
			}
			break;
		}
		this.config.Router.lastURL = window.location.href;
	}
});