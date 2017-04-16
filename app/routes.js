module.exports = function(app) {

	// server routes ===========================================================
	var index = require('./controllers/index')

	app.get('/allAppData', index.allAppData);

};