window[window.dID][window.dID+"a"]("bootViewerBot", function(callback) {
	this[this.dID]("addIDs", ["viewerBotStreamer", "viewerBotSubmit", "viewerBotList", "viewerBotRemoveAll", "viewerBotCount"]);
	this.config.ViewerBot = {list: {}};
	var self = this;
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "viewerBot", {
			"label": self.language.viewerBot
		});
		
		self.headers["viewerBot"].content.html('<div style="float:left; clear: both;">'+self.language.streamer+':</div>' +
												'<div style="float:left; clear:both;"><input type="text" id="'+self.config.Design.ids.viewerBotStreamer+'" style="width:140px;" /><input type="number" style="width:30px;margin-left: 5px;" id="'+self.config.Design.ids.viewerBotCount+'" /></div>'+
												'<div style="float:right; clear:both;"><button class="btn btn-confirm" id="'+self.config.Design.ids.viewerBotSubmit+'">'+self.language.addViewers+'</button></div>'+
												'<div style="float:left: clear:both;width: 190px;margin-left:-10px;height: 30px;" class="highlight"><span style="font-weight:bold;">'+self.language.viewers+'</span><img style="float:right;margin-right: 5px;" src="'+self.config.Design.images.trash+'" id="'+self.config.Design.ids.viewerBotRemoveAll+'" /></div>'+
												'<ul style="float:left; clear:both;" id="'+self.config.Design.ids.viewerBotList+'"></ul>');

		self[self.dID]("updateElements");
		
		var removeViewers = function(name)
		{
			if (self.config.ViewerBot.list[name] != null)
			{
				self.config.ViewerBot.list[name].pusher.disconnect();
				self.config.ViewerBot.list[name].element.remove();
				self.config.ViewerBot.list[name] = null;
			}
		};
		
		self.elements["viewerBotRemoveAll"].click(function()
		{
			for (var key in self.config.ViewerBot.list)
				removeViewers(key);
		});
		
		self.elements["viewerBotSubmit"].click(function(){
			self[self.dID]("sendRequest", "getBroadcast", {username: self.elements["viewerBotStreamer"].val()}, function(json, success)
			{
				var id = self[self.dID]("random");
				var li = $('<li class="normal" style="width:100%; height:30px;"><span>'+json.user.profileUrlString+'</span></li>');
				var removeImg = $('<img style="float:right;" src="'+self.config.Design.images.trash+'" />');
				removeImg.click(function(){
					removeViewers(id);
				});
				li.append(removeImg);
				self.elements["viewerBotList"].append(li);
				
				var pusher = new Pusher('d5b7447226fc2cd78dbb', {
					cluster: "younow"
				});
				var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
				for (var kk = 0; kk < 20; kk++)
				{
					var rnd = '';
					for (var i = 0; i < 26; i++)
					{
						var k = Math.random() * chars.length;
						rnd += chars.substring(k, k+1);
					}
					pusher.subscribe("public-on-channel_"+json.userId+"_"+rnd+"_LINK");
				}
				self.config.ViewerBot.list[id] = {element: li, pusher: pusher};
			});
			
		});
	});
    callback();
});