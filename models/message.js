var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  room: String,
  from: String,
  content: String,
  timestamp: Date //with angular, filter to Zulu
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;