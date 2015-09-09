var mongoose = require('mongoose'),
		Team = require('./team.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  room: String,
  team: String,
  faction: [Team.schema]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;