// ==UserScript==
// @name JuhNau DarkMode
// @description Hides your presence within younow streams and offer some nice features to troll streamers.
// @version 0.5.9
// @match *://younow.com/*
// @match *://www.younow.com/*
// @namespace https://github.com/FluffyFishGames/JuhNau-Darkmode
// @grant    GM_getValue
// @grant    GM_setValue
// @updateURL https://FluffyFishGames.github.io/DarkMode.user.js
// @downloadURL https://FluffyFishGames.github.io/DarkMode.user.js
// ==/UserScript==
function main(w, dID, clientID) 
{
	// rerouting if in user is in dark mode
	if (window.localStorage.getItem(clientID+".inDarkMode") == "1" && window.location.href != "https://www.younow.com/explore/") 
	{
		window.location.href = "https://www.younow.com/explore/";
		window.localStorage.setItem(clientID+".browse", window.location.href.replace("https://www.younow.com/", ""));
	}
	else 
	{
		function boot(dID, clientID)
		{
			$.ajax('https://fluffyfishgames.github.io/DarkMode.Class.js',
			{
				dataType: "text",
				success: function(text, b, c)
				{
					$(document.body).append($('<script>'+text.replace(/window\.dID/g, '"'+dID+'"')+'</script>'));
				    window[dID] = new window[dID+"b"](dID, clientID, [
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
			});
		}
		
		WebFontConfig = {
			google: {
				families: ['Shadows+Into+Light::latin']
			},
			active: function() {
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
		
		function startDarkMode(dID, clientID) {
			var darkModeLoader = null;
			if (window.localStorage.getItem("inDarkMode") == "1") 
			{
				darkModeLoader = document.createElement("div");
				darkModeLoader.setAttribute("id", dID+"_Loader");
				darkModeLoader.setAttribute("style", "background: #000 url(https://absolutehacks.com/forum/uploads/profile/photo-1.gif) center center no-repeat; width: 100%; height: 100%; top: 0px; left: 0px; position: absolute; z-index:100000;");
				var span = document.createElement("span");
				span.style.opacity = 0;
				span.setAttribute("style", "display: block; position: absolute; top: calc(50% + 80px); transform: translateY(-50%); width: 100%; font-size: 30px; color:#aaa; text-align: center; font-family: 'Shadows Into Light', cursive;");
				span.setAttribute("id", dID+"_LoaderLabel");
				span.innerHTML = "Loading...";
				darkModeLoader.appendChild(span);
				document.body.appendChild(darkModeLoader);
			}

			var script = document.createElement("script");
			script.addEventListener('load', function() {
				var launch = document.createElement("script");
				launch.textContent = "(" + boot.toString() + ")('"+dID+"','"+clientID+"');";
				document.body.appendChild(launch);
			});
			script.setAttribute("src", "https://fluffyfishgames.github.io/libs/jquery.js");
			document.body.appendChild(script);
		}

		var waitForYouNow = setInterval(function() {
			if (document.body.getElementsByClassName("nav-logo").length > 0) {
				startDarkMode(dID, clientID);
				clearInterval(waitForYouNow);
			}
		}, 100);
	}
}

function generateRandom()
{
	var a = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var k = Math.floor(10 + Math.random() * 10);
	var c = "";
	for (var i = 0; i < k; i++)
	{
		var d = Math.random() * (a.length - 1);
		c += a.substring(d, d + 1);
	}
	return c;
}
var sessionID = generateRandom();
var clientID = GM_getValue("client");
if (clientID == null || clientID == "")
{
    clientID = generateRandom();
	GM_setValue("client", clientID);
}
// Inject our main script. Yes, this is bad. But you are trying to do bad things either.
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')(window,\''+sessionID+'\',\''+clientID+'\');';
document.body.appendChild(script);