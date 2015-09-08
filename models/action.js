var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActionSchema = new Schema({
	actor: String, //teamID of the side that implements it
  available: Boolean, //false, except WHEN conditions
  done: Boolean, //false, true when action is made
  text: String, //show on button
  details: String, //show on mouseover
  impact: Object, //numbers; index of number corresponds to situation key impacted; match keys to keys
  secret: Boolean, //deafult false; if true, no change to Intel
  // modifiers? id?
  timestamp: Date //with angular, filter to Zulu
});

var Action = mongoose.model('Action', ActionSchema);

module.exports = Action;