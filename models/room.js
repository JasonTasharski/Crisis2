var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Situation = require('./situation.js'),
    Scenario = require('./scenario.js');

var RoomSchema = new Schema({
	users: Number,
	scenario: [Scenario.schema],
	situation: [Situation.schema],
	oneFill: String,
	twoFill: String,
	started: Boolean,
	finished: Boolean
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;