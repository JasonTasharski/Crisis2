var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  room: String,
  team: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;