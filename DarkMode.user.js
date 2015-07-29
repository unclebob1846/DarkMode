﻿// ==UserScript==
// @name JuhNau DarkMode
// @description Hides your presence within younow streams and offer some nice features to troll streamers.
// @version 0.6.1
// @match *://younow.com/*
// @match *://www.younow.com/*
// @namespace https://github.com/FluffyFishGames/JuhNau-Darkmode
// @grant none
// @updateURL https://FluffyFishGames.github.io/DarkMode.user.js
// @downloadURL https://FluffyFishGames.github.io/DarkMode.user.js
// ==/UserScript==
function main(w, dID) {
    w[dID] = new w[dID+"b"]([
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

// Inject our main script. Yes, this is bad. But you are trying to do bad things either.
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')(window);';
document.body.appendChild(script);