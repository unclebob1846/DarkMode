// ==UserScript==
// @name JuhNau DarkMode
// @description Hides your presence within younow streams and offer some nice features to troll streamers.
// @version 0.5.9
// @match *://younow.com/*
// @match *://www.younow.com/*
// @namespace https://github.com/FluffyFishGames/JuhNau-Darkmode
// @grant none
// @updateURL https://FluffyFishGames.github.io/DarkMode.user.js
// @downloadURL https://FluffyFishGames.github.io/DarkMode.user.js
// ==/UserScript==
function main(w, dID) {

	function callback(dID)
	{
		window.dID = dID;
		window[dID] = new window[dID+"b"]([
			"Init",
			"Config",
			"Language",
			"Ticker",
			"Request",
			"YouNow",		
			"Design", 
			"MassLiker",
			"Leveller"
		]);
	}
	
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
			css += 
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
					var script3 = document.createElement("script");
					script3.setAttribute("src", "https://FluffyFishGames.github.io/DarkMode.Class.js");
					script3.addEventListener('load', function() {
						var script = document.createElement("script");
						script.textContent = "(" + callback.toString() + ")();";
						document.body.appendChild(script);
					});
					document.body.appendChild(script3);
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
var a = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var k = Math.floor(5 + Math.random() * 10);
var c = "";
for (var i = 0; i < k; i++)
{
	var d = Math.random() * (a.length - 1);
	c += a.substring(d, d + 1);
}
// Inject our main script. Yes, this is bad. But you are trying to do bad things either.
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')(window,\''+c+'\');';
document.body.appendChild(script);