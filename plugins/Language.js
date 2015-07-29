w[dID][dID+"x"]("bootLanguage", function(callback) {
	var c = this[dID]("getConfig");
	c.currentLanguage = "de-DE"; // REPLACE THIS WITH LANGUAGE SELECTION TO EXPAND THIS TO US MARKET
});

w[dID][dID+"x"]("getLang", function(key) {
	var c = this[dID]("getConfig");
	return c.languages[c.currentLanguage][key];
});