var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
	name	: {type: String, required: true},
	time 	: {type: Date, required: true},
	dscr 	: {type: String, required: true},
	image	: {type: String, required: true}
});

var Model = mongoose.model('Model', modelSchema);

module.exports = Model;

