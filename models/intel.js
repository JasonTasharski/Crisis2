var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IntelSchema = new Schema({
  recipient: Object, //team or team two?
  content: String, //lines that show up in the intel box
  timestamp: Date //with angular, filter to Zulu
});

var Intel = mongoose.model('Intel', IntelSchema);

module.exports = Intel;