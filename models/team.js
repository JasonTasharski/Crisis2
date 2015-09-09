var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Action = require('./action.js');

var TeamSchema = new Schema({
  text: String,
  leader: String,
  regimeType: String, //democratic regimes have nothing to fear from change of government, but less control of public opinion; authoritarian regimes have more control, but collapse completely if approval reaches zero
  strength: Number, //modifier to proxy momentum when providing direct support
  baseApproval: Number, //public approval at start
  baseInfluence: Number, //influence at start
  actions: [Action.schema]
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;