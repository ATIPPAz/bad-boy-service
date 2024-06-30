const { MatchSetDB } = require("../schema.db");
function initialMatchSet(app) {
  app.get("/deleteSet/:setId", async (req, res) => {
    try {
      await MatchSetDB.deleteOne({ _id: req.params.setId });
      res.json(200);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
  app.get("/set", async (req, res) => {
    const roomId = req.query.roomId;
    try {
      const result = await MatchSetDB.find({ roomId: roomId });
      const reponse = result != null ? result : [];
      res.json(
        reponse.map((x) => {
          return {
            roomId: x.roomId,
            setId: x._id,
            teamName: x.setName,
            courtNumber: x.courtNumber,
            allTeam: x.allTeam,
            winScore: x.winScore,
            teamLimit: x.teamLimit,
            winStreak: x.winStreak,
          };
        })
      );
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
  app.get("/set/:setId", async (req, res) => {
    const setId = req.params.setId;
    try {
      const result = await MatchSetDB.findOne({ _id: setId });
      if (result) {
        return res.json({
          roomId: result.roomId,
          setId: result._id,
          teamName: result.setName,
          courtNumber: result.courtNumber,
          allTeam: result.allTeam,
          winScore: result.winScore,
          teamLimit: result.teamLimit,
          winStreak: result.winStreak,
        });
      }
      return res.json(500);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
}
module.exports = { initialMatchSet };
