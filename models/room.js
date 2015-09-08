var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Scenario = require('./scenario.js');

var RoomSchema = new Schema({
	//id
	scenario = [Scenario.schema]
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;