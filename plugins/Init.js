w[dID][dID+"x"]("readyInit", function() {
	var b = window.localStorage.getItem("browse");
	if (b != null && b != "") {
		window.history.pushState({
			"html": "",
			"pageTitle": ""
		}, "", "https://www.younow.com/" + b);
		window.localStorage.setItem("browse", "");
	}
});