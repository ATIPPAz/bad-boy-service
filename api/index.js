const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nasakun13201:pan28060@badminton.bkjs5n4.mongodb.net/', {
  useNewUrlParser: true
});
const Schema = mongoose.Schema;

const courtSchma = new Schema({
  roomData:{
    roomName:String,
    allTeam: [{member: [String], order: Number}],
    courtNumber: Number,
    teamLimit: Number,
    winScore:Number,
    winStreak:Number
  } 
});

const Court = mongoose.model('Court',courtSchma);
const app = express();
app.use(cors());
app.use(bodyParser.json())
const roomData = []
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.get('/pollingGetData', (req, res) => {
  const i = Math.floor(Math.random() * 2)
  let response = ''
  if(i==0){
    response = {event:'score',data:{date:new Date().toLocaleString(),score:`${Math.floor(Math.random() * 21)+0} vs ${Math.floor(Math.random() * 21)+0}`}}
  }
  if(i==1){

    response = {event:'roomCourt',data:{date:new Date().toLocaleString(),court:`court${Math.floor(Math.random() * 2)+1} , court${Math.floor(Math.random() * 9)+1}`}}
  }
  if(i==2){
    response = {event:'nextTeam',data:{date:new Date().toLocaleString(),team:`team${Math.floor(Math.random() * 2)+1} , team${Math.floor(Math.random() * 10)+0}`}}
  }
  res.json(response)
});

app.post('/room', async(req,res)=>{
  if(req.body.roomName.trim() === ""){
    req.body.roomName = makeid(5)
  }
const roomData = {roomData:req.body}
try{
  const court = new Court(roomData);
  await court.save().then(e=>{
      res.json({id:e._id})
  });
}
catch(e){
  console.log(e);
  res.json(500)
}
  
  // roomData.push({id,data:req.body})
})
app.get('/room',async(req,res)=>{
  try{
    res.json( await Court.find())

  }
  catch(e){
    console.log(e);
    res.json(500)
  }
})

app.get('/room/:roomId',async(req,res)=>{
  try{
    const result = await Court.findOne({_id: req.params.roomId })
    res.json(result)
  }
  catch(e){
    console.log(e);
    res.json(500)
  }
  
})

app.delete('/room',async(req,res)=>{
  try{
    roomData.splice(0,roomData.length)
    await Court.deleteMany({id:{$ne:''}})
    res.json(200)
  }
  catch(e){
    console.log(e);
    res.json(500)
  }
})

app.get('/', (req, res) => {
  res.json({welcome:'to my api'})
});

app.listen(3001, async() => {
  console.log('Server is running on port 3000');
});

