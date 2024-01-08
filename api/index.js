const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nasakun13201:pan28060@badminton.bkjs5n4.mongodb.net/', {
  useNewUrlParser: true
})
const Schema = mongoose.Schema

const setSchma = new Schema({
  roomId: String,
  setName: String,
  allTeam: [{ member: [String], order: Number }],
  courtNumber: Number,
  teamLimit: Number,
  winScore: Number,
  winStreak: Number
}, { versionKey: false })
const roomShema = new Schema({
  roomName: String,
  roomCreateOn: Date,
  roomDescription: String
}, { versionKey: false })
const SetDB = mongoose.model('Set', setSchma)
const RoomDB = mongoose.model('Room', roomShema)
const app = express()
app.use(cors())
app.use(bodyParser.json())
function makeid(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

// app.get('/pollingGetData', (req, res) => {
//   const i = Math.floor(Math.random() * 2)
//   let response = ''
//   if(i==0){
//     response = {event:'score',data:{date:new Date().toLocaleString(),score:`${Math.floor(Math.random() * 21)+0} vs ${Math.floor(Math.random() * 21)+0}`}}
//   }
//   if(i==1){

//     response = {event:'roomCourt',data:{date:new Date().toLocaleString(),court:`court${Math.floor(Math.random() * 2)+1} , court${Math.floor(Math.random() * 9)+1}`}}
//   }
//   if(i==2){
//     response = {event:'nextTeam',data:{date:new Date().toLocaleString(),team:`team${Math.floor(Math.random() * 2)+1} , team${Math.floor(Math.random() * 10)+0}`}}
//   }
//   res.json(response)
// });
function shufferMember(member) {
  for (let i = member.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[member[i], member[j]] = [member[j], member[i]]
  }
  return member
}

app.get('/getRoomId', async (req, res) => {
  try {
    const result = await RoomDB.find()
    if (result != null) {
      const response = result.map(x => x._id)
      return res.status(200).json(response)
    }
    return res.json([])
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

app.post('/room', async (req, res) => {
  const roomData = {
    roomName: req.body.roomName,
    roomCreateOn: new Date(),
    roomDescription: req.body.description
  }
  console.log(roomData)
  try {
    const room = new RoomDB(roomData)
    await room.save().then(e => {
      res.json({ id: e._id })
    })
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

app.get('/room', async (req, res) => {
  try {
    const result = await RoomDB.find()
    if (result != null) {
      const response = result.map(x => {
        return {
          roomName: x.roomName,
          roomDescription: x.roomDescription,
          roomCreateOn: x.roomCreateOn,
          roomId: x._id
        }
      })
      return res.status(200).json(response)
    }
    return res.json([])
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

app.get('/team/:teamId', async (req, res) => {
  const teamId = req.params.teamId
  try {
    const result = await SetDB.findOne({ _id: teamId })
    if (result) {
      return res.json({
        roomId: result.roomId,
        teamId: result._id,
        teamName: result.setName,
        courtNumber: result.courtNumber,
        allTeam: result.allTeam,
        winScore: result.winScore,
        teamLimit: result.teamLimit,
        winStreak: result.winStreak
      })
    }
    return res.json(500)
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

app.get('/team', async (req, res) => {
  const roomId = req.query.roomId
  try {
    const result = await SetDB.find({ roomId: roomId })
    const reponse = result != null ? result : []
    res.json(reponse.map(x => {
      return {
        roomId: x.roomId,
        teamId: x._id,
        teamName: x.setName,
        courtNumber: x.courtNumber,
        allTeam: x.allTeam,
        winScore: x.winScore,
        teamLimit: x.teamLimit,
        winStreak: x.winStreak
      }
    }))
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

app.post('/team', async (req, res) => {
  const members = req.body.members
  try {
    const oldteam = await SetDB.find({ roomId: req.body.roomId })
    let teamPaired = members
    if (oldteam != null) {
      teamPaired = []
      const oldTeams = oldteam.map(x => x.allTeam.map(m => m.member)).flatMap(x => x)
      const hasPair = []
      members.forEach(x=>{
        if(!hasPair.some(h=>h==x)){
          const memberHasPaired = oldTeams.filter(y=>y.some(s=>s===x)).flatMap(f=>f).filter(f=>f!=x)
          const canPairMember = members.filter(f=>!memberHasPaired.some(s=>s==f) && f!=x && !hasPair.some(s=>s==f))
          if(canPairMember.length == 0){
            console.log(members)
            console.log(memberHasPaired)
            console.log(hasPair)
          }
          const randomDecimal = Math.random()
          const indexPair = Math.floor(randomDecimal * (canPairMember.length))
          const newPairMember = canPairMember[indexPair>canPairMember.length?indexPair-1:indexPair]
if(memberHasPaired.some(s=>s==newPairMember)){

}
          // if(newPairMember == undefined){
          //   console.log(indexPair);
          //   console.log(canPairMember);

          // }
          const memberPaired = [x]
          if(newPairMember!= undefined){
            memberPaired.push(newPairMember)
            hasPair.push(newPairMember)
          }
          teamPaired.push(memberPaired)
          hasPair.push(x)
        }
      })
    }
    req.body.teamLock.forEach(x=>{
      teamPaired.push(x)
    })
    console.log(teamPaired);
    const teamShuffered = shufferMember(teamPaired).map((x,index)=>{
      return { order: index+1, member: x }
    })
   
    if (req.body.setName.trim() === "") {
      const now = new Date()
      const options = {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
      const formattedDate = now.toLocaleString('th-TH', options)
      req.body.setName = `วันที่ ${formattedDate}`
    }
    const payload = {
      courtNumber: req.body.courtNumber,
      roomId: req.body.roomId,
      winScore: req.body.winScore,
      teamLimit: req.body.teamLimit,
      winStreak: req.body.winStreak,
      allTeam: teamShuffered,
      setName: req.body.setName
    }
    const team = new SetDB(payload)
    await team.save().then(e => {
      res.json({ id: e._id })
    })
  }
  catch (e) {
    console.log(e)
    res.json(200)
  }
  // member.value = shufferMember(members)
})
app.get('/deleteTeam/:roomId',async(req,res)=>{
    try{
    await SetDB.deleteMany({roomId:req.params.roomId})
    res.json(200)
  }
  catch(e){
    console.log(e);
    res.json(500)
  }
})
app.get('/room/:roomId', async (req, res) => {
  try {
    const roomData = await RoomDB.findOne({ _id: req.params.roomId })
    if (roomData != null) {
      return res.json({
        roomId: roomData._id,
        roomName: roomData.roomName,
        roomCreateOn: roomData.roomCreateOn,
        roomDescription: roomData.roomDescription
      })
    }
    return res.json()
  }
  catch (e) {
    console.log(e)
    res.json(500)
  }
})

// app.post('/room', async(req,res)=>{
//   if(req.body.roomName.trim() === ""){
//     const now = new Date();
//     const options = {
//       timeZone: 'Asia/Bangkok',
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//     };
//     const formattedDate = now.toLocaleString('th-TH', options);
//     req.body.roomName = `วันที่ ${formattedDate}`
//   }
// const roomData = {roomData:req.body}
// try{
//   const court = new Court(roomData);
//   await court.save().then(e=>{
//       res.json({id:e._id})
//   });
// }
// catch(e){
//   console.log(e);
//   res.json(500)
// }

//   // roomData.push({id,data:req.body})
// })
// app.get('/room',async(req,res)=>{
//   try{
//     res.json( await Court.find())

//   }
//   catch(e){
//     console.log(e);
//     res.json(500)
//   }
// })

// app.get('/room/:roomId',async(req,res)=>{
//   try{
//     const result = await Court.findOne({_id: req.params.roomId })
//     res.json(result)
//   }
//   catch(e){
//     console.log(e);
//     res.json(500)
//   }

// })

// app.delete('/room',async(req,res)=>{
//   try{
//     await Court.deleteMany({id:{$ne:''}})
//     res.json(200)
//   }
//   catch(e){
//     console.log(e);
//     res.json(500)
//   }
// })

// app.get('/deleteEmergency',async(req,res)=>{
//   try{
//     await Court.deleteMany({id:{$ne:''}})
//     res.json(200)
//   }
//   catch(e){
//     console.log(e);
//     res.json(500)
//   }
// })

// app.get('/', (req, res) => {
//   res.json({welcome:'to my api'})
// });

app.listen(3001, async () => {
  console.log('Server is running on port 3001')
});

