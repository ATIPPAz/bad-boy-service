const { initialMatch } = require("../routes/match");
const { initialMatchSet } = require("../routes/matchSet");
const { initialRoom } = require("../routes/room");

function initialRouting(app) {
  initialMatch(app);
  initialMatchSet(app);
  initialRoom(app);
}
module.exports = { initialRouting };
