const { MatchDB, MatchSetDB, RoomDB } = require("../schema.db");
function initialRoom(app) {
  app.get("/deleteRoom/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    try {
      await MatchSetDB.deleteMany({ roomId: roomId });
      await MatchDB.deleteMany({ roomId: roomId });
      res.json(200);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
  app.get("/getRoomId", async (req, res) => {
    try {
      const result = await RoomDB.find();
      if (result != null) {
        const response = result.map((x) => x._id);
        return res.status(200).json(response);
      }
      return res.json([]);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });

  app.post("/room", async (req, res) => {
    const roomData = {
      roomName: req.body.roomName,
      roomCreateOn: new Date(),
      roomDescription: req.body.description,
    };
    console.log(roomData);
    try {
      const room = new RoomDB(roomData);
      await room.save().then((e) => {
        res.json({ id: e._id });
      });
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });

  app.get("/room", async (req, res) => {
    try {
      const result = await RoomDB.find();
      if (result != null) {
        const response = result.map((x) => {
          return {
            roomName: x.roomName,
            roomDescription: x.roomDescription,
            roomCreateOn: x.roomCreateOn,
            roomId: x._id,
          };
        });
        return res.status(200).json(response);
      }
      return res.json([]);
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });

  app.get("/room/:roomId", async (req, res) => {
    try {
      const roomData = await RoomDB.findOne({ _id: req.params.roomId });
      if (roomData != null) {
        return res.json({
          roomId: roomData._id,
          roomName: roomData.roomName,
          roomCreateOn: roomData.roomCreateOn,
          roomDescription: roomData.roomDescription,
        });
      }
      return res.json();
    } catch (e) {
      console.log(e);
      res.json(500);
    }
  });
}
module.exports = { initialRoom };
