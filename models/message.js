var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: String,
  content: String
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;