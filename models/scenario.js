var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScenarioSchema = new Schema({
  title: String,
  teamOne: Object,
  teamTwo: Object,
  introOne: String,
  introTwo: String,
  startParameters: Object
});

var Scenario = mongoose.model('Scenario', ScenarioSchema);

module.exports = Scenario;