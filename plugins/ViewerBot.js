window[window.dID][window.dID+"a"]("bootViewerBot", function(callback) {
	this[this.dID]("addIDs", ["viewerBotStreamer", "viewerBotSubmit", "viewerBotList", "viewerBotRemoveAll", "viewerBotCount"]);
	this.config.ViewerBot = {list: {}};
	var self = this;
	this[this.dID]("onDesign", function()
	{
		self[self.dID]("addHeader", "viewerBot", {
			"label": self.language.viewerBot
		});
		
		self.headers["viewerBot"].content.html('<div style="float:left; clear: both;"><span>'+self.language.streamer+':</span></div>' +
												'<div style="float:left; clear:both;"><input type="text" id="'+self.config.Design.ids.viewerBotStreamer+'" style="width:170px;" /></div>'+
												'<div style="float:left; clear: both;"><span>'+self.language.count+':</span></div>' +
												'<div style="float:left; clear:both;"><input type="number" value="20" style="margin-bottom:5px;width:170px;" id="'+self.config.Design.ids.viewerBotCount+'" /></div>'+
												'<div style="float:right; clear:both;margin-bottom:5px;"><button class="btn btn-confirm" id="'+self.config.Design.ids.viewerBotSubmit+'">'+self.language.addViewers+'</button></div>'+
												'<div style="float:left; clear:both;width: 190px;margin-left:-10px;height: 30px;" class="highlight"><span style="margin-top:9px;margin-left:10px;font-weight:bold;">'+self.language.viewers+'</span><img style="float:right;margin-right: 5px;" src="'+self.config.Design.images.trash+'" id="'+self.config.Design.ids.viewerBotRemoveAll+'" /></div>'+
												'<ul style="float:left; clear:both;" id="'+self.config.Design.ids.viewerBotList+'"></ul>');

		self[self.dID]("updateElements");
		
		var removeViewers = function(name)
		{
			if (self.config.ViewerBot.list[name] != null)
			{
				for (var kn = 0; kn < self.config.ViewerBot.list[name].pusher.length; kn++)
					self.config.ViewerBot.list[name].pusher[kn].disconnect();
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
				var li = $('<li class="normal" style="width:190px; margin-left:-10px; height:30px;"><span style="margin-top:5px;margin-left:10px;">('+self.elements["viewerBotCount"].val()+') <strong>'+json.user.profileUrlString+'</strong></span></li>');
				var removeImg = $('<img style="float:right;" src="'+self.config.Design.images.trash+'" />');
				removeImg.click(function(){
					removeViewers(id);
				});
				li.append(removeImg);
				self.elements["viewerBotList"].append(li);
				
				var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
				var pusherList = [];
				var conns = 0;
				var pusher = null;
				for (var kk = 0; kk < self.elements["viewerBotCount"].val(); kk++)
				{
					if (pusher == null || conns == 20)
					{
						pusher = new Pusher('d5b7447226fc2cd78dbb', {
							cluster: "younow"
						});
						pusherList.push(pusher);
						conns = 0;
					}
				
					var rnd = '';
					for (var i = 0; i < 26; i++)
					{
						var k = Math.random() * chars.length;
						rnd += chars.substring(k, k+1);
					}
					pusher.subscribe("public-on-channel_"+json.userId+"_"+rnd+"_LINK");
					conns++;
				}
				self.config.ViewerBot.list[id] = {element: li, pusher: pusherList};
			});
			
		});
	});
    callback();
});