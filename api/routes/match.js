const { createTeamPair } = require("../../utils/uniquePairing");
const { MatchDB, MatchSetDB } = require("../schema.db");
const { createRandomTeamParing } = require("../../utils/paring");
function initialMatch(app) {
  app.get("/team/:teamId", async (req, res) => {
    const teamId = req.params.teamId;
    try {
      const result = await MatchDB.findOne({ _id: teamId });
      if (result) {
        return res.json({
          roomId: result.roomId,
          teamId: result._id,
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

  app.get("/team", async (req, res) => {
    const roomId = req.query.roomId;
    try {
      const result = await MatchDB.find({ roomId: roomId });
      const reponse = result != null ? result : [];
      res.json(
        reponse.map((x) => {
          return {
            roomId: x.roomId,
            teamId: x._id,
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

  app.post("/team", async (req, res) => {
    try {
      const members = req.body.members ?? [];
      const limit = req.body.limit ?? 2;
      const start = req.body.start ?? 0;
      const random = req.body.random ?? false;
      const { isSet, limitSet } = req.body.matchSet;
      const { teamLock } = req.body;
      if (req.body.setName.trim() === "") {
        const now = new Date();
        const options = {
          timeZone: "Asia/Bangkok",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formattedDate = now.toLocaleString("th-TH", options);
        req.body.setName = `วันที่ ${formattedDate}`;
      }
      if (isSet) {
        const teams = await createTeamPair(
          members,
          limit,
          limitSet,
          start,
          random,
          req.body.teamLock.map((x) => x.teamMember)
        );

        const payload = {
          courtNumber: req.body.courtNumber,
          roomId: req.body.roomId,
          winScore: req.body.winScore,
          teamLimit: req.body.teamLimit,
          winStreak: req.body.winStreak,
          allTeam: teams.map((x, index) => {
            return {
              order: index + 1,
              set: x.map((y, idx) => {
                return {
                  order: idx + 1,
                  member: y,
                };
              }),
            };
          }),
          setName: req.body.setName,
        };
        const team = new MatchSetDB(payload);
        await team.save().then((e) => res.json({ isSet: true, id: e._id }));
      } else {
        const allteam = createRandomTeamParing(members, teamLock, limit);
        const payload = {
          courtNumber: req.body.courtNumber,
          roomId: req.body.roomId,
          winScore: req.body.winScore,
          teamLimit: req.body.teamLimit,
          winStreak: req.body.winStreak,
          allTeam: allteam.map((x, index) => {
            return { member: x, order: index + 1 };
          }),
          setName: req.body.setName,
        };
        return await MatchDB(payload)
          .save()
          .then((e) => res.json({ isSet: false, id: e._id }));
      }
    } catch (e) {
      console.log(e);
      res.json(500);
    }
    // member.value = shufferMember(members)
  });
  app.get("/deleteTeam/:teamId", async (req, res) => {
    try {
      await MatchDB.deleteOne({ _id: req.params.teamId });
      res.json(200);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
}
module.exports = { initialMatch };
