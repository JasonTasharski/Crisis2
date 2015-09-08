var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SituationSchema = new Schema({
	active: Boolean, //false at first; 30-second timer; when false, only chat and initial intel are available, and the action list is unclickable (grayed out). When true, actions become doable
  escalation: Number, //0 How close to direct war the two player-sides are
  balance: Number, //1 Ground situation between proxies
  momentumOne: Number, //2 offensive capacity of proxies; higher means more casualties for the other side; higher than the other side means balance shifts
  momentumTwo: Number, //3
  approvalOne: Number, //4 domestic approval
  approvalTwo: Number, //5
  influenceOne: Number, //6 global influence; default victory condition
  influenceTwo: Number, //7
  timestampt: Date //timestamp is renewed (as this.Date?) every time Situation changes; with angular, filter to Zulu
});

var Situation = mongoose.model('Situation', SituationSchema);

module.exports = Situation;