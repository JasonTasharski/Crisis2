var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScenarioSchema = new Schema({
  title: String,
  teamOne: Object,
  teamTwo: Object,
  introOne: String,
  introTwo: String,
  startParameters: Object //make this a situation
});

var Scenario = mongoose.model('Scenario', ScenarioSchema);

module.exports = Scenario;