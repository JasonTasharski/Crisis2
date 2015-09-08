var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScenarioSchema = new Schema({
  title: String, //"Ukraine"
  teamOne: Object, //USA
  teamTwo: Object, //Russia
  introOne: String, //"A pro-Russian government has been overthrown by pro-Western protesters"
  introTwo: String, //"The CIA has overthrown a friendly government on our border! If we don't act soon, NATO will seize control of the Black Sea entirely!"
  startParameters: Array// initial situation parameters
});

var Scenario = mongoose.model('Scenario', ScenarioSchema);

module.exports = Scenario;