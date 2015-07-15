// ==UserScript==
// @name JuhNau DarkMode
// @description Hides your presence within younow streams and offer some nice features to troll streamers.
// @version 0.0.1
// @match *://younow.com/*
// @match *://www.younow.com/*
// ==/UserScript==

function main(w)
{
    function callback()
    {
      window.DarkModeInstance = new window.DarkMode();
    }

    
    w.DarkModeInstance = null;
    w.DarkMode = function()
    {
        var self = this;
        var s = setInterval(function(){
            if ($('.nav-logo') != null)
            {
                self.init();
                clearInterval(s);
            }
        }, 100);
    };
    
    w.DarkMode.prototype.init = function()
    {
        
        this.selectLanguage(null);
        this.lastTicks = {};
        for (var key in this.config.ticks)
        {
            this.lastTicks[key] = 0;
        }
        this.inDarkMode = window.localStorage.getItem("inDarkMode");
        if (this.inDarkMode == "1")
        {
            this.hijackAngular();
            this.applyDarkMode();
            $('#darkModeLoader').animate({'opacity':0}, 300, "swing", function(){
                $('#darkModeLoader').remove();
            });
            this.config["tsi"] = this.youNow.api.store('trpxId');
            this.config["tdi"] = this.youNow.api.store('trpx_device_id');
        }
        this.createButton();
    };
    
    w.DarkMode.prototype.applyDarkMode = function()
    {
        $('#main').remove();
        $('.newFooter').remove();
        $('.nav-logo').children()[0].remove();
        $('.nav-logo').append($('<img src="'+this.config.images.logo+'" style="width:auto;" height="40" />'));
        $('[ng-model=searchBox]').attr("placeholder", "Search AttentionWhore");
        this.page = $('<div id="darkPage"></div>');
        this.elements = {};
        this.elements["left"] = $('<div id="left"></div>');
        this.elements["right"] = $('<div id="right"></div>');
        this.elements["left"].append((this.elements["trendingPeopleHeader"] = $('<strong>'+this.language["trendingPeople"]+'</strong>')));
        this.elements["left"].append((this.elements["trendingPeopleArrow"] = $('<div class="arrow"></div>')));
        this.elements["left"].append((this.elements["trendingPeopleContent"] = $('<ul id="trendingPeople"></ul>')));
        this.elements["left"].append((this.elements["editorsPickHeader"] = $('<strong>'+this.language["editorsPick"]+'</strong>')));
        this.elements["left"].append((this.elements["editorsPickArrow"] = $('<div class="arrow"></div>')));
        this.elements["left"].append((this.elements["editorsPickContent"] = $('<ul id="editorsPick"></ul>')));
        this.elements["left"].append((this.elements["friendsHeader"] = $('<strong>'+this.language["friends"]+'</strong>')));
        this.elements["left"].append((this.elements["friendsArrow"] = $('<div class="arrow"></div>')));
        this.elements["left"].append((this.elements["friendsContent"] = $('<ul id="friends"></ul>')));
        this.elements["left"].append((this.elements["trendingTagsHeader"] = $('<strong>'+this.language["trendingTags"]+'</strong>')));
        this.elements["left"].append((this.elements["trendingTagsArrow"] = $('<div class="arrow"></div>')));
        this.elements["left"].append((this.elements["trendingTagsContent"] = $('<ul id="trendingTags"></ul>')));
        
        $(document.body).append(this.page);
        $(document.body).append((this.elements["tooltip"] = $('<div id="tooltip"></div>')));
        this.page.append(this.elements["left"]);
        this.page.append(this.elements["right"]);
        var self = this;
        this.youNow.urlRouter.update = function(a){return true;};
        this.youNow.urlRouter.sync = function(){};
        this.youNow.urlRouter.listen = function(){};
        this.youNow.urlRouter.href = function(c, d, e){return ""; };
        this.youNow.urlRouter.push = function(c, d, e){ };
        
        this.youNow.state.get = function(a, b){return true;};
        this.youNow.state.go = function(a, b, c){return true;};
        this.youNow.state.href = function(a, b, c){return "";};
        this.youNow.state.reload = function(){};
        this.youNow.state.transitionTo = function(a, b, c){};
        this.youNow.view.load = function(c,d){};
        this.youNow.swf.newBroadcaster = function(a){return false;};
        this.youNow.broadcasterService.addBroadcast = function(a,b,c,d,e,f){return false;};
        this.youNow.broadcasterService.switchBroadcaster = function(a,b,c,d){return false;};
        this.youNow.broadcasterService.showBroadcaster = function(a){return false;};
        this.youNow.broadcasterService.switchToBroadcast = function(a){return false;};
        this.youNow.broadcasterService.trackBroadcaster = function(){return false;};
        this.youNow.broadcasterService.updateBroadcaster = function(a,b,d){return false;};
        
        setInterval(function(){self.tick();}, 100);
        var b = window.localStorage.getItem("browse");
        if (b != null && b != "")
        {
            window.history.pushState({"html":"","pageTitle":""},"", "http://www.younow.com/hidden/"+b);
            window.localStorage.setItem("browse", "");
        }
    };
    
    w.DarkMode.prototype.tick = function()
    {

        var d = new Date();
        var cTime = d.getTime();
        for (var key in this.config.ticks)
        {
            if (this.lastTicks[key] < cTime - this.config.ticks[key])
            {
                this["tick"+key.charAt(0).toUpperCase()+key.slice(1)]();
                this.lastTicks[key] = cTime;
            }
        }
        var boxes = 4;
        if (this.elements["editorsPickContent"].css("display") == "none")
            boxes--;
        if (this.elements["friendsContent"].css("display") == "none")
            boxes--;
        this.elements["editorsPickContent"].css("height", "calc("+(1/boxes*100)+"% - 25px)");
        this.elements["friendsContent"].css("height", "calc("+(1/boxes*100)+"% - 25px)");
        this.elements["trendingPeopleContent"].css("height", "calc("+(1/boxes*100)+"% - 25px)");
        this.elements["trendingTagsContent"].css("height", "calc("+(1/boxes*100)+"% - 25px)");
    };
    
    w.DarkMode.prototype.tickOnlineFriends = function()
    {
        if (this.youNow.session.user != null && this.youNow.session.user.userId > 0)
        {
            var self = this;
            $.ajax({
                url: 'http://www.younow.com/php/api/channel/getLocationOnlineFansOf/numberOfRecords=50/channelId='+this.youNow.session.user.userId, 
                jsonp: "callback",
                method: "GET",
                dataType: "json",
                success: function(json, b, c)
                {
                    self.elements["friendsContent"].html("");
                    if (json["users"] != null && json["users"].length > 0)
                    {
                        for (i = 0; i < json["users"].length; i++)
                            self.addSideEntry(json["users"][i], self.elements["friendsContent"]);
                        self.elements["friendsHeader"].css("display", "block")
                        self.elements["friendsArrow"].css("display", "block")
                        self.elements["friendsContent"].css("display", "block")
                    }
                    else {
                        self.elements["friendsHeader"].css("display", "none")
                        self.elements["friendsArrow"].css("display", "none")
                        self.elements["friendsContent"].css("display", "none")
                    }
                }
            });
        }
    };
    
    w.DarkMode.prototype.showTooltip = function(e, data)
    {
        
        this.elements["tooltip"].css("top", e.pageY + 5);
        this.elements["tooltip"].css("left", e.pageX + 5);
        this.elements["tooltip"].css("display", "block");
        
        if (this.lastTooltipObject != data)
        {
            if (data["type"] == "streamer" || data["type"] == "friend")
            {
                var extra = "";
                if (data["viewers"] != null)
                    extra += '<div class="value"><img style="margin-top:3px;" width="16" src="'+this.config.images.views+'" /><span>'+this.addCommas(data["viewers"])+'</span></div>';
                if (data["likes"] != null)
                    extra += '<div class="value"><img style="margin-top:3px;" height="16" src="'+this.config.images.likes+'" /><span>'+this.addCommas(data["likes"])+'</span></div>';
                if (data["shares"] != null)
                    extra += '<div class="value"><img style="margin-top:3px;" height="16" src="'+this.config.images.shares+'" /><span>'+this.addCommas(data["shares"])+'</span></div>';
                if (data["fans"] != null)
                    extra += '<div class="value"><img style="margin-top:3px;" height="16" src="'+this.config.images.fans+'" /><span>'+this.addCommas(data["fans"])+'</span></div>';
                if (data["isWatching"] != null)
                    extra += '<div class="value"><img style="margin-top:3px;" width="16" src="'+this.config.images.views+'" /><span>'+data["isWatching"]+'</span></div>';
                this.elements["tooltip"].html('<div class="img"><img height="128" src="'+this.getProfilePicture(data.userid)+'" /></div><div class="content"><div class="title"><img src="'+this.config.images.star+'" style="float:left;margin-right: 5px;"/>'+data["level"]+' '+data["username"]+'</div>'+extra+'</div>');
            }
        }
        this.lastTooltipObject = data;
        console.log(this.elements["tooltip"].width());
        if (e.pageX + this.elements["tooltip"].width() > $(window).width() - 20)
            this.elements["tooltip"].css("left", e.pageX - 320 - 5);
        if (e.pageY + this.elements["tooltip"].height() > $(window).height() - 100)
            this.elements["tooltip"].css("top", e.pageY - this.elements["tooltip"].height() - 5);
        
    };
    w.DarkMode.prototype.addCommas = function(n){
        var rx=  /(\d+)(\d{3})/;
        return String(n).replace(/^\d+/, function(w){
            while(rx.test(w)){
                w= w.replace(rx, '$1.$2');
            }
            return w;
        });
    }
    w.DarkMode.prototype.hideTooltip = function()
    {
        this.elements["tooltip"].css("display", "none");
    };
    
    w.DarkMode.prototype.tickUpdateStreamData = function()
    {
        if (this.currentStreamer != null)
        {
            var d = new Date();
            this.duration = this.currentStreamer.length + Math.floor((d.getTime() - this.timeStart) / 1000);
            this.updateStreamerInfo();
        }
    };
    
    w.DarkMode.prototype.tickReloadStreamData = function()
    {
        if ($('#stream').length > 0 && this.currentStreamer != null)
        {
            var self = this;
            $.ajax({
                url: 'http://www.younow.com/php/api/broadcast/info/curId=0/user='+this.currentStreamer.username, 
                jsonp: "callback",
                dataType: "jsonp",
                success: function(json, b, c)
                {
                    if (json["errorCode"] > 0)
                    {
                        self.elements["right"].html('<div class="error">'+self.language.streamerOffline.replace("%1", self.currentStreamer.username)+'</div>');
                    }
                    else 
                    {
                        self.currentStreamer = json;
                    }
                }
            });
        }
    };
    
    w.DarkMode.prototype.tickReloadTagTrending = function()
    {
        if ($('#stream').length > 0 && this.currentStreamer != null)
        {
            var self = this;
            $.ajax({
                url: this.currentStreamer.PlayDataBaseUrl+this.currentStreamer.userId+".json", 
                dataType: "json",
                success: function(json, b, c)
                {
                    if (json["errorCode"] > 0)
                    {
                        //self.elements["right"].html('<div class="error">'+self.language.streamerOffline.replace("%1", self.currentStreamer.username)+'</div>');
                    }
                    else 
                    {
                        self.elements["trendingList"].html("");
                        for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++)
                        {
                            self.addTrendingUser(json.onBroadcastPlay.queues[0].items[i]);
                        }
                    }
                }
            });
        }
    };
    
    w.DarkMode.prototype.addTrendingUser = function(data)
    {
        var el = $('<a href="/hidden/'+data.profile+'"><img src="'+this.getProfilePicture(data.userId)+'" /></a>');
        var obj = {
            type: "streamer",
            username: data["username"],
            level: data["userlevel"],
            userid: data["userId"],
            fans: data["totalFans"],
            viewers: data["viewers"],
            shares: data["shares"],
            likes: data["likes"],
            tag: data["tags"][0],
        };
        var self = this;
        el.mousemove(function(e){self.showTooltip(e, obj);});
        el.mouseout(function(e){self.hideTooltip();});
        this.elements["trendingList"].append(el);
    };
    
    w.DarkMode.prototype.tickTrending = function()
    {
        var self = this;
        $.ajax({
            url: 'http://cdn2.younow.com/php/api/younow/dashboard/locale=de/trending=50', 
            jsonp: "callback",
            method: "GET",
            dataType: "json",
            success: function(json, b, c)
            {
                var i = 0;
                self.elements["editorsPickContent"].html("");
                if (json["featured_users"] != null && json["featured_users"].length > 0)
                {
                    for (i = 0; i < json["featured_users"].length; i++)
                        self.addSideEntry(json["featured_users"][i], self.elements["editorsPickContent"]);
                    self.elements["editorsPickHeader"].css("display", "block")
                    self.elements["editorsPickArrow"].css("display", "block")
                    self.elements["editorsPickContent"].css("display", "block")
                }
                else {
                    self.elements["editorsPickHeader"].css("display", "none")
                    self.elements["editorsPickArrow"].css("display", "none")
                    self.elements["editorsPickContent"].css("display", "none")
                }
                    self.elements["trendingPeopleContent"].html("");
                for (i = 0; i < json["trending_users"].length; i++)
                    self.addSideEntry(json["trending_users"][i], self.elements["trendingPeopleContent"]);
                self.elements["trendingTagsContent"].html("");
                for (i = 0; i < json["trending_tags"].length; i++)
                    self.addSideEntry(json["trending_tags"][i], self.elements["trendingTagsContent"]);
                
                //self.addSearchElements(json);
            }
        });
    };
    
    w.DarkMode.prototype.addSideEntry = function(data, container)
    {
        if (data["tag"] != null)
        {
            // it's a tag!
            container.append($('<li><a href="/hidden/explore/tag/'+data["tag"]+'">#'+data["tag"]+'</a></li>'));
        }
        else 
        {
            var username = "";
            var level = "";
            if (data["username"] != null)
                username = data["username"];
            else
                username = data["name"];
            if (data["level"] != null)
                level = data["level"];
            else 
                level = Math.floor(data["userlevel"]);
            // seems like a user.
            var el = $('<li><a href="/hidden/'+data["profile"]+'">'+username+'</a></li>');
            container.append(el);
            var self = this;
            var obj = {
                type: "streamer",
                username: username,
                level: level,
                userid: data["userId"]
            };
            if (data["locale"] != null)
                obj["locale"] = data["locale"];
            if (data["shares"] != null)
                obj["shares"] = data["shares"];
            if (data["likes"] != null)
                obj["likes"] = data["likes"];
            if (data["viewers"] != null)
                obj["viewers"] = data["viewers"];
            if (data["tags"] != null)
                obj["tag"] = data["tags"][0];
            if (data["fans"] != null)
                obj["fans"] = data["fans"];
            if (data["channelName"] != null && data["channelName"] != data["profile"])
            {
                obj["type"] = "friend";
                obj["isWatching"] = data["channelName"];
            }
            el.mousemove(function(e){self.showTooltip(e, obj);});
            el.mouseout(function(e){self.hideTooltip();});
        }
    };
    
    w.DarkMode.prototype.tickRouting = function()
    {
        var location = window.location.href.replace("http://","").replace("https://", "").replace("www.younow.com/", "").replace("younow.com/", "");
        if (location != this.lastLocation)
        {
            this.lastLocation = location;
            if (location.indexOf("/") > - 1)
                this.path = location.split("/");
            else
                this.path = [location];
            this.updatePage();
        }
    };
    
    w.DarkMode.prototype.updatePage = function()
    {
        if (this.pusher != null)
        {
            this.pusher.disconnect();
            this.pusher = null;
        }
        this.elements["right"].html("");
        if (this.path.length == 0)
        {
        }
        else if (this.path[0] == "hidden")
        {
            if (this.path.length > 3)
                this.explore("#"+this.path[3], 0);
            else if (this.path.length > 2)
                this.explore(this.path[2], 0);
            else if (this.path.length > 1)
            {
                if (this.path[1] == "settings")
                {
                    //TODO: Settings page
                }
                else 
                {
                    this.openStream(this.path[1]);
                }
            }
            else
                this.explore(null, 0);
        }
        else 
        {
            window.history.pushState({"html":"","pageTitle":""},"", "http://www.younow.com/hidden/"+window.location.href.replace("http://www.younow.com/",""));
        }
    };
    
    w.DarkMode.prototype.sendChatMessage = function(streamId, message)
    {
        $.ajax({
            url: 'http://www.younow.com/php/api/broadcast/chat', 
            jsonp: "callback",
            method: "POST",
            dataType: "json",
            data: {"tsi": this.config.tsi, "tdi": this.config.tdi, "userId": this.youNow.session.user.userId, "channelId": streamId, "comment": message},
            success: function(json, b, c)
            {
              
            }
        });
    };
    
    w.DarkMode.prototype.openStream = function(name)
    {
        this.currentStreamer = {
            username: name
        };
        var self = this;
        if ($('#stream').length == 0)
        {
            this.elements["right"].html('<div id="stream"><div id="streamInfo"></div><div class="outer"><div class="stream"><div id="streamView"></div><div id="streamBar"></div></div><div id="chat"><ul id="chatMessages"></ul><textarea id="chatMessage" maxlength="150"></textarea></div></div><div id="trendingList"></div></div>');
            this.elements["chatMessage"]  = $('#chatMessage');
            this.elements["streamView"]   = $('#streamView');
            this.elements["streamInfo"]   = $('#streamInfo');
            this.elements["streamBar"]    = $('#streamBar');
            this.elements["chatMessages"] = $('#chatMessages');
            this.elements["trendingList"] = $('#trendingList');
            this.elements["chatMessage"].keydown(function (e){
                if(e.keyCode == 13){
                    self.sendChatMessage(self.currentStreamer.userId, self.elements["chatMessage"].val());
                    self.elements["chatMessage"].val("");
                }
            })
            this.elements["chatMessage"].keyup(function (e){
                if(e.keyCode == 13){
                    self.elements["chatMessage"].val("");
                }
            });
        }
        
        $.ajax({
            url: 'http://www.younow.com/php/api/broadcast/info/curId=0/user='+this.currentStreamer.username, 
            jsonp: "callback",
            dataType: "jsonp",
            success: function(json, b, c)
            {
                if (json["errorCode"] > 0)
                {
                    self.elements["right"].html('<div class="error">'+self.language.streamerOffline.replace("%1", self.currentStreamer.username)+'</div>');
                }
                else 
                {
                    self.currentStreamer = json;
                    self.switchStream();
                }
            }
        });
    };
    
    w.DarkMode.prototype.switchStream = function()
    {
        flowplayer("streamView", "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf", {
            clip: {
                url: this.currentStreamer.media.stream,
                live: true,
                scaling: 'fit',
                provider: 'rtmp'
            },
            plugins: {
                rtmp: {
                    url: "flowplayer.rtmp-3.2.13.swf",
                    netConnectionUrl: 'rtmp://'+this.currentStreamer.media.host+this.currentStreamer.media.app
                },
                controls: {
                    all: false,
                    play: false,
                    scrubber: false,
                    mute: true,
                    volume: true,
                    fullscreen: true,
                }
            },
            canvas: {
                backgroundGradient: 'none'
            }
        });
        var d = new Date();
        this.timeStart = d.getTime();
        this.duration = this.currentStreamer.length;
        var self = this;
        
        this.pusher = new Pusher('d5b7447226fc2cd78dbb', {cluster:"younow"});
        this.channel = this.pusher.subscribe("public-channel_"+this.currentStreamer.userId);
        this.channel.bind('onLikes', function(data){
            self.currentStreamer.likes = data.message.likes;
            self.currentStreamer.viewers = data.message.viewers;
        });
        this.channel.bind('onViewers', function(data){
            self.currentStreamer.likes = data.message.likes;
            self.currentStreamer.viewers = data.message.viewers;
        });
        this.channel.bind('onChat', function(data){
            for (var i = 0; i < data.message.comments.length; i++)
                self.addChatMessage(data.message.comments[i]);
        });
        for (var i = 0; i < this.currentStreamer.comments.length; i++)
            this.addChatMessage(this.currentStreamer.comments[i]);
        
        this.updateStreamerInfo();
    };
    
    w.DarkMode.prototype.updateStreamerInfo = function()
    {
        if ($('#stream').length != 0 && this.elements["streamInfo"] != null)
        {
            this.elements["streamInfo"].html('<img src="'+this.getProfilePicture(this.currentStreamer.userId)+'" style="margin-top:-5px;margin-right:5px;" height="30" /><img src="'+this.config.images.star+'" style="margin-right: 5px;margin-top:-4px;" />'+Math.floor(this.currentStreamer.userlevel)+' <strong>'+this.currentStreamer.username+'</strong> ('+this.currentStreamer.country+') '+this.language.in+' <a href="/hidden/explore/tag/'+this.currentStreamer.tags[0]+'">#'+this.currentStreamer.tags[0]+'</A> : '+this.currentStreamer.user.description);

            var hours = Math.floor(this.duration / (60 * 60));
            var minutes = Math.floor(this.duration / (60)) % 60;
            var seconds = this.duration % 60;
            var time = "";
            if (hours > 0) time += hours + ":";
            if (minutes > 9) time += minutes + ":";
            else time += "0"+minutes+":";
            if (seconds > 9) time += seconds;
            else time += "0"+seconds;
            this.elements["streamBar"].html('<div class="item"><img src="'+this.config.images.likes+'" />'+this.currentStreamer.likes+'</div><div class="item"><img src="'+this.config.images.shares+'" />'+this.currentStreamer.shares+'</div><div style="float:right;" class="item"><img src="'+this.config.images.time+'" />'+time+'</div><div style="float:right;" class="item"><img src="'+this.config.images.views+'" />'+this.currentStreamer.viewers+'</div>');
        }
    };
    
    w.DarkMode.prototype.explore = function(query, page)
    {
        var el = $('<div id="userList"></div>');
        var titleEl = $('<h2></h2>');
        el.append(titleEl);
        var self = this;
        el.bind('mousewheel DOMMouseScroll', function(event){
            if (self.currentSearch.finished != true && self.currentSearch.loading != true)
            {
                var l = el[0].scrollHeight - el.height() - 50;
                console.log(el.scrollTop() + " => " + l);
                if (el.scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) 
                {
                    self.currentSearch.page += 1;
                    self.addSearchResults();
                }
            }
        });
        this.elements["right"].append(el);
        this.currentSearch = {
            query: query,
            titleEl: titleEl,
            page: page,
            element: el,
            finished: false,
        };
        this.addSearchResults();
    };
    
    w.DarkMode.prototype.addSearchResults = function()
    {
        this.currentSearch.loading = true;
        var self = this;
        if (this.currentSearch.query == null)
        {
            $.ajax({
                url: 'http://www.younow.com/php/api/younow/trendingUsers/numberOfRecords=100/startFrom='+(this.currentSearch.page * 100)+'/locale=de', 
                jsonp: "callback",
                method: "GET",
                processData: false,
                headers: {
                    "X-Algolia-API-Key":this.youNow.config.settings.PeopleSearchApiKey,
                    "X-Algolia-Application-Id":this.youNow.config.settings.PeopleSearchAppId,
                    "X-Algolia-TagFilters":this.youNow.config.settings.PeopleSearchSecurityTags,
                },
                dataType: "json",
                success: function(json, b, c)
                {
                    self.addSearchElements(json);
                }
            });
            
        }
        else if (this.currentSearch.query.charAt(0) == "#")
        {
            $.ajax({
                url: 'https://qz0xcgubgq.algolia.io/1/indexes/'+this.youNow.config.settings.PeopleSearchIndex+'/query', 
                jsonp: "callback",
                method: "POST",
                contentType: "application/json;charset=UTF-8",
                data: "{\"params\":\"query="+this.currentSearch.query.substring(1)+"&hitsPerPage=100&page="+this.currentSearch.page+"&attributesToHighlight=none&restrictSearchableAttributes=tag\"}",
                processData: false,
                headers: {
                    "X-Algolia-API-Key":this.youNow.config.settings.PeopleSearchApiKey,
                    "X-Algolia-Application-Id":this.youNow.config.settings.PeopleSearchAppId,
                    "X-Algolia-TagFilters":this.youNow.config.settings.PeopleSearchSecurityTags,
                },
                dataType: "json",
                success: function(json, b, c)
                {
                    self.addSearchElements(json);
                }
            });
        }
        else
        {
            $.ajax({
                url: 'https://qz0xcgubgq.algolia.io/1/indexes/'+this.youNow.config.settings.PeopleSearchIndex+'/query', 
                jsonp: "callback",
                method: "POST",
                contentType: "application/json;charset=UTF-8",
                data: "{\"params\":\"query="+this.currentSearch.query+"&hitsPerPage=100&page="+this.currentSearch.page+"&attributesToHighlight=none\"}",
                processData: false,
                headers: {
                    "X-Algolia-API-Key":this.youNow.config.settings.PeopleSearchApiKey,
                    "X-Algolia-Application-Id":this.youNow.config.settings.PeopleSearchAppId,
                    "X-Algolia-TagFilters":this.youNow.config.settings.PeopleSearchSecurityTags,
                },
                dataType: "json",
                success: function(json, b, c)
                {
                    self.addSearchElements(json);
                }
            });
        }
    };
    
    w.DarkMode.prototype.parseNumber = function(n)
    {
        var self = this;
        var rx=  /(\d+)(\d{3})/;
        return String(n).replace(/^\d+/, function(w){
            while(rx.test(w)){
                w= w.replace(rx, '$1'+self.language.numberSeperator+'$2');
            }
            return w;
        });
    };
    
    w.DarkMode.prototype.addSearchElements = function(json)
    {
        if (json["trending_users"] != null)
        {
            if (this.currentSearch.titleEl.html() == "")
                this.currentSearch.titleEl.html(this.parseNumber(json.total) + " " + this.language["usersFound"]); 
            this.currentSearch.loading = false;
            for (var i = 0; i < json["trending_users"].length; i++)
            {
                this.currentSearch.element.append(this.createProfileBox(json["trending_users"][i]));
            }
        }
        else {
            if (json.nbHits < 100)
                this.currentSearch.finished = true;
            if (this.currentSearch.titleEl.html() == "")
                this.currentSearch.titleEl.html(this.parseNumber(json.nbHits) + " " + this.language["usersFound"]); 
            this.currentSearch.loading = false;
            for (var i = 0; i < json.hits.length; i++)
            {
                this.currentSearch.element.append(this.createProfileBox(json.hits[i]));
            }
        }
    };
    
    w.DarkMode.prototype.createProfileBox = function(data)
    {
        var userid = "";
        var username = "";
        var profile = "";
        var level = "";
        var fans = "";
        var tag = "";
        if (data["userId"] != null)
        {
            userid = data["userId"];
            username = data["username"];
            profile = data["profile"];
            level = Math.floor(data["userlevel"]);
            fans = data["totalFans"];
            tag = data["tags"][0];
        }
        else {    
            userid = data.objectID;
            username = data.profile;
            profile = username;
            level = data.level;
            fans = data.fans;
            tag = data.tag;
        }
        var tagSpan = "";
        if (tag != "")
            tagSpan = '<span>#'+tag+'</span>';
        return $('<a href="/hidden/'+username+'" class="userProfile"><div><img src="'+this.getProfilePicture(userid)+'" />'+tagSpan+'</div><strong><img src="'+this.config.images.star+'" />'+level+' '+username+'</strong><small>'+this.parseNumber(fans)+' '+this.language.fans+'</small></a>');
    };
    
    w.DarkMode.prototype.addChatMessage = function(message)
    {
        var wasBottom = false;
        if (this.elements["chatMessages"].scrollTop() > this.elements["chatMessages"][0].scrollHeight - this.elements["chatMessages"].height() - 20)
            wasBottom = true;
        if (this.elements["chatMessages"].children().length > this.config.maxMessages - 1)
            this.elements["chatMessages"].children()[0].remove();
        this.elements["chatMessages"].append('<li><img src="http://cdn2.younow.com/php/api/channel/getImage/?channelId='+message.userId+'" height="30" width="30" /><span><strong><a href="http://www.younow.com/'+message.profileUrlString+'">'+message.name+' ('+message.userLevel+')</a>: </strong>'+message.comment+'</span></li>');
        if (wasBottom)
        {
            this.elements["chatMessages"].animate({ scrollTop: this.elements["chatMessages"][0].scrollHeight}, 200)
        }
    };
    
    w.DarkMode.prototype.getProfilePicture = function(userid)
    {
        return this.youNow.config.broadcasterThumb+userid;
    };
    
    w.DarkMode.prototype.hijackAngular = function()
    {
        function allServices(mod, r) {
            var inj = angular.element(document).injector().get;
            if (!r) r = {};
            angular.forEach(angular.module(mod).requires, function(m) {allServices(m,r)});
            angular.forEach(angular.module(mod)._invokeQueue, function(a) {
                try { r[a[2][0]] = inj(a[2][0]); } catch (e) {}
            });
            return r;
        }
        
        var r = allServices('younow');
        console.log(r);
        this.youNow = {
            config : r.config,
            api: r.Api,
            session: r.session,
            pusher: r.pusher,
            search: r.searchService,
            urlRouter: r["$urlRouter"],
            state: r["$state"],
            view: r["$view"],
            swf: r.swf,
            modal: r["$modal"],
            broadcasterService: r["broadcasterService"],
        };
    };
    
    w.DarkMode.prototype.youNow = {};
    w.DarkMode.prototype.selectLanguage = function(s) 
    {
        // select preferred language (currently only de-DE is supported)
        if (s == null)
        {
            s = "de-DE";
        }
        this.language = this.config.languages[s];
    }
    w.DarkMode.prototype.inDarkMode = false;
    w.DarkMode.prototype.createButton = function()
    {
        var container = $(".user-actions");
        var button = $(".user-actions").children("[translate=header_golive]");
        var self = this;
        
        this.button = $("<button></button>");
        this.button.attr("class", button.attr("class"));
        
        if (this.inDarkMode == "1")
        {
            this.button.html(this.language["goLight"]);
            this.button.css('background-color', '#999');
            this.button.css('border-color', '#444');
        }
        else 
        {
            this.button.html(this.language["goDark"]);
            this.button.css('background-color', '#333');
            this.button.css('border-color', '#111');
        }
        this.button.css('height', '27');
        this.button.css('visibility', 'visible');
        
        this.button.insertBefore(button);
        
        this.button.click(function(){
            window.localStorage.setItem("inDarkMode", self.inDarkMode=="1"?"0":"1");
            if (self.inDarkMode == "1")
                window.location.href = window.location.href.replace("#","");
            else 
                window.location.href = window.location.href.replace("younow.com/","younow.com/#");
        });
        
        button.remove();
    };
    
    w.DarkMode.prototype.config = 
    {
        images:
        {
            "logo": "https://thatcrazytattooedbaldbroad.files.wordpress.com/2011/06/whore.png",
            "star": "http://www.fancyicons.com/free-icons/136/stars/png/16/star_black_16.png",
            "live": "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/webcam-icon.png",
            "disconnected": "http://png.findicons.com/files/icons/1581/silk/16/disconnect.png",
            "connected": "http://png.findicons.com/files/icons/1581/silk/16/connect.png",
            "youtube": "http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/16/Web-Youtube-alt-2-Metro-icon.png",
            "facebook": "http://icons.iconarchive.com/icons/danleech/simple/16/facebook-icon.png",
            "twitter": "http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/16/Web-Twitter-alt-2-Metro-icon.png",
            "googleplus": "http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/16/Web-Google-plus-alt-Metro-icon.png",
            "bars": "http://cdn2.younow.com/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png",
            "coins": "http://cdn2.younow.com/angularjsapp/src/assets/images/icons_v3/menu_user_coins1.png",
            "views": "http://png.findicons.com/files/icons/2448/wpzoom_developer/48/eye.png",
            "time": "http://icons.iconarchive.com/icons/icons8/windows-8/24/Very-Basic-Clock-icon.png",
            "fans": "http://icons.iconarchive.com/icons/icons8/windows-8/32/Users-Group-icon.png",
            "likes": "http://icons.iconarchive.com/icons/icons8/windows-8/24/Hands-Thumbs-Up-icon.png",
            "shares": "http://icons.iconarchive.com/icons/icons8/ios7/24/Very-Basic-Electric-Megaphone-Filled-icon.png",
        },
        languages: 
        {
            "de-DE":
            {
                "goDark": "In den Schatten!",
                "goLight": "Ins Licht!",
                "fans": "Sklaven",
                "usersFound": "Benutzer gefunden",
                "numberSeperator": ".",
                "trendingPeople": "Besonders bedürftig",
                "editorsPick": "Auserwählte",
                "friends": "Verfolgte",
                "trendingTags": "Erbärmliche Tags",
                "streamerOffline": "%1 ist offline.",
                "in": " in "
            }
        },
        maxMessages: 200,
        ticks:
        {
            trending: 5000,
            onlineFriends: 5000,
            routing: 100,
            reloadStreamData: 5000,
            updateStreamData: 1000,
            reloadTagTrending: 5000,
        }
    };
    
    WebFontConfig = {
        google: { families: [ 'Shadows+Into+Light::latin' ] },
        active: function()
        {
            var o = 0.0;
            ab = setInterval(function()
            {
                o += 0.05;
                if (o >= 1)
                {
                    o = 1;
                    clearInterval(ab);
                }
                document.getElementById("darkModeLoaderLabel").style.opacity = o;
            }, 20);
        }
    };
    (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
      
    })();
    
    if (window.location.href != "http://www.younow.com/explore/")
    {
        window.location.href = "http://www.younow.com/explore/";
        window.localStorage.setItem("browse", window.location.href.replace("http://www.younow.com/","").replace("hidden/",""));
    }
    var css = '.btn-primary { visibility: hidden;} ' +
    '#darkModeLoader { background: #000 url(https://absolutehacks.com/forum/uploads/profile/photo-1.gif) center center no-repeat; width: 100%; height: 100%; top: 0px; left: 0px; position: absolute; z-index:100000; }'+
    '#darkModeLoader span {display: block; position: absolute; top: calc(50% + 80px); transform: translateY(-50%); width: 100%; font-size: 30px; color:#aaa; text-align: center; font-family: \'Shadows Into Light\', cursive;}';
    var darkModeLoader = null;
    if (window.localStorage.getItem("inDarkMode") == "1")
    {
        css += 'body, html {background: #000; overflow: hidden;}'+
            '.navbar {border-bottom: 0px;background: #666; border-bottom: 1px solid #777;}'+
            '.nav-logo {float: left; width: 110px; margin-left: 10px; }'+
            '.navbar-content {width: 100% !important;min-width:0px !important; max-width: 100000px !important;}'+
            '#darkPage {position:absolute; top: 50px; left: 0px; z-index:100; width: 100%; height: calc(100% - 50px);}'+
            '#darkPage #left {float: left; width: 200px; border-right: 1px solid #999; height:100%; background:#333;}'+
            '#darkPage #right {float: left; width: calc(100% - 201px); height:100%; background:#000;}'+
            '#darkPage #userList {padding: 20px; float: left; width: 100%; height:100%; overflow-y:auto;}'+
            '#darkPage .userProfile {float: left; display: block; width: 142px; height: 180px; margin: 5px; background: #333; border: 1px solid #555; border-radius: 5px; padding: 5px; }'+
            '#darkPage .userProfile div {border: 1px solid #111; background: url(http://cdn2.younow.com/images/nothumb.jpg) no-repeat; background-size: 130px 130px; float: left; clear: both; width: 130px; height: 130px; overflow: hidden; }'+
            '#darkPage .userProfile div img {height: 130px; float: left; clear: both; display: block; position: relative; margin-top: 0px; }'+
            '#darkPage .userProfile div span {padding-left: 5px; position: relative; margin-top: -30px; float: left; clear: both; z-index:500; line-height: 30px; font-weight: bold; color: #fff; display: block; width:130px;height:30px; font-size:14px;background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#00000000\', endColorstr=\'#000000\',GradientType=0 ); }'+
            '#darkPage .userProfile img {float: left; margin-top:3px; margin-right: 3px; }'+
            '#darkPage .userProfile strong {color: #fff; white-space: nowrap; line-height: 22px; display: block; float: left; width: 130px; height:22px; overflow: hidden; text-overflow: ellipsis; clear: both; }'+
            '#darkPage .userProfile small {color: #999; display:block; float: left; clear: both; }'+
            '#darkPage h2 {color: #eee; margin-top:0px;}'+
            '#darkPage #left strong {color: #ddd; margin-top:0px; height: 25px; line-height: 25px; }'+
            '#darkPage #left { padding: 10px; }'+
            '#darkPage #left a { color: #aaa; }'+
            '#trendingPeople, #trendingTags, #featuredUsers, #friends { overflow: hidden; overflow-y: auto; }'+
            '#stream { width: 100%; height: 100%; }'+
            '#streamInfo { width: 100%; line-height: 40px; padding-left: 5px; color: #ddd; height: 40px; float: left; clear: both; background: #333; border-bottom: 1px solid #555;}'+
            '#stream .outer { width: 100%; height: calc(100% - 180px); float:left; clear:both; border-bottom: 1px solid #555; }'+
            '#stream .stream { width: calc(100% - 350px); height: 100%; float: left; }'+
            '#stream #streamView { width: 100%; height: calc(100% - 30px); }'+
            '#stream #streamBar { width: 100%; height: 30px; background: #333; color: #eee; border-top: 1px solid #555;}'+ 
            '#stream #streamBar .item { float: left; margin-top: 5px; margin-right: 5px; margin-left: 5px;}'+ 
            '#stream #streamBar .item img { float: left; margin-top:2px;height: 16px; margin-right: 5px; }'+ 
            '#stream #chat { float: right !important; width: 349px !important; border-left: 1px solid #333; height: 100%; float: right;}'+
            '#stream #chatMessages { padding: 5px; overflow-y: auto; overflow-x:hidden; height: calc(100% - 50px);}'+
            '#stream #chatMessages li { margin: 5px; clear: both; float: left; }'+
            '#stream #chatMessages li img { float: left; margin-right: 5px; }'+
            '#stream #chatMessages li span { font-family: Segoe UI; font-size: 12px; display: block; float: left; max-width: 270px;}'+
            '#stream #chat textarea { height: 50px; width: 349px; padding: 5px; border: 1px solid #555; color: #eee; background: #333; }'+
            '#stream #trendingList { height: 140px; padding: 10px; overflow-x: auto; white-space: nowrap; }'+
            '#stream #trendingList img { width: 100px; height: 100px; margin-right: 5px; display: inline-block; }'+
            '#tooltip { position: absolute; z-index: 100; background: #333; -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75); }'+
            '#tooltip .img { float: left; width: 128px; height: 128px; }'+
            '#tooltip .content { float: left; min-width: 200px; }'+
            '#tooltip .title { float: left; padding-top: 4px; padding-left: 5px; clear: both; width: 100%; height: 25px; background: #666; color: #ddd; font-weight: bold; font-size: 13px; }'+
            '#tooltip .value { float: left; clear: both; margin-left: 5px; margin-top: 5px; color: #999; }'+
            '#tooltip .value img { float: left; }'+
            '#tooltip .value span { float: left; margin-left: 5px; }'+
            '.dropdown-menu {background: #555 !important;}'+
            '.dropdown-menu li {border-top-color: #666 !important;}'+
            '.dropdown-menu li a {color: #eee !important;}'+
            '.dropdown-menu li a:hover {background: #666 !important;}'+
            '.dropdown-menu .active, .searchResult-more {background: #777 !important;}'+
            'span {color: #fff !important;}'+
            '.error {margin: 20px; border-radius:10px; border:1px solid #f00; background:#a00;padding:10px;font-size:20px;text-align:center;color: #fff !important;}'+
            '.line-clamp:after {background: none !important;}'+
            '.user {background: #777 !important; color: #eee !important;}'+
            '.ynicon-carrot-up {color: #777 !important;}'+
            '.ynicon-user, .ynicon-settings, .ynicon-audience, .ynicon-logout {color: #eee !important;}';
        darkModeLoader = document.createElement("div");
        darkModeLoader.setAttribute("id", "darkModeLoader");
        var span = document.createElement("span");
        span.style.opacity = 0;
        span.setAttribute("id", "darkModeLoaderLabel");
        span.innerHTML = "Loading...";
        darkModeLoader.appendChild(span);
        
        document.body.appendChild(darkModeLoader);
    }
    
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet)
        style.styleSheet.cssText = css;
    else 
        style.appendChild(document.createTextNode(css));
    head.appendChild(style);
    
    
    window.addEventListener("load", function() {
      var script1 = document.createElement("script");
      script1.addEventListener('load', function() {
          var script = document.createElement("script");
          script.addEventListener('load', function() {
              var script = document.createElement("script");
              script.textContent = "(" + callback.toString() + ")();";
              document.body.appendChild(script);
          }, false);
          script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
          document.body.appendChild(script);
      });
      script1.setAttribute("src", "http://releases.flowplayer.org/js/flowplayer-3.2.13.min.js");
      document.body.appendChild(script1);
    });
}

// Inject our main script. Yes, this is bad. But you are trying to do bad things either.
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')(window);';
document.body.appendChild(script);