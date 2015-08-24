window[window.dID][window.dID+"a"]("bootMacroManager", function(callback) {
	this[this.dID]("addLanguageTable", "MacroManager", "https://fluffyfishgames.github.io/"+this.baseFolder+"language/MacroManager.json");
	this[this.dID]("addIDs", ["macroManager", "macroList", "macroSteps", "addMacro", "addAction"]);
    //this[this.dID]("addRoute", "stream", /[a-zA-Z0-9_\.]+/, "openStream", 1);
	
	//this[this.dID]("addIDs"
	callback();
});

window[window.dID][window.dID+"a"]("readyMacroManager", function(callback) {
	var self = this;
	this[this.dID]("addSettingsTab", this.language.MacroManager.settingsTitle, function(){
		var macroManager = $('<div id="'+self.config.Design.ids.macroManager+'">' +
		'<div class="macroList">'+
		'<div id="'+self.config.Design.ids.addMacro+'" class="add"><i class="fa fa-plus" />'+self.language.MacroManager.createMacro+'</div>'+
		'<ul id="'+self.config.Design.ids.macroList+'">'+
		'</ul>'+
		'</div>'+
		'<div class="macroSteps">'+
		'<div id="'+self.config.Design.ids.addAction+'" class="add"><i class="fa fa-plus" />'+self.language.MacroManager.addAction+'</div>'+
		'<ul id="'+self.config.Design.ids.macroSteps+'">'+
		'</ul>'+
		'</div>'+
		'</div>');
		self[self.dID]("updateElements");
		
		self.elements["addAction"].css("display", "none");
		self.config.MacroManager.macros = self[self.dID]("getConfigValue", "MacroManager.macros", []);
		self.elements["addMacro"].click(function(){
			var newMacro = {'name': 'Neues Makro'};
			self.config.MacroManager.macros.push(newMacro);
			self[self.dID]("setConfigValue", "MacroManager.macros", self.config.MacroManager.macros);
			selectMacro(addMacro(newMacro), newMacro);
		});
		var selectMacro = function(){};
		var lastMacro = null;
		
		var selectMacro = function(macro) {
			if (lastMacro != null)
				lastMacro.removeClass("active");
			el.addClass("active");
			lastMacro = el;
		};
		
		var addMacro = function(macro){
			var el = $('<li>'+macro.name+'</li>');
			el.click(function(){
				
				selectMacro(el, macro);
			});
			self.elements["macroList"].append(el);
			return el;
		};
		
		if (macros != null)
		{
			for (var i = 0; i < macros.length; i++)
			{
				addMacro(macros[i]);
			}
		}
		self.elements.settingsContent.append(macroManager);
	});
	
	this[this.dID]("addHeader", "macroManager", {
		"label": this.language["MacroManager"].title,
		"settings": true
	});
	this[this.dID]("updateMacroManagerContent");
});

window[window.dID][window.dID+"a"]("updateLevellerContent", function(callback) {
	if (this.headers["macroManager"] != null && this.headers["macroManager"].content != null)
	{
		var self = this;
		if (!this.config.loggedIn)
		{
			this.headers["macroManager"].content.html('<span>'+this.language["MacroManager"].loginNeeded+'</span>');
		}
		else if (this.config.banned)
		{
			this.headers["macroManager"].content.html('<span>'+this.language["MacroManager"].banned+'</span>');
		}
		else
		{
			
		}
	}
});
