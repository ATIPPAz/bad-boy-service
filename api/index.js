const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')
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

app.post('/room',(req,res)=>{
  if(req.body.roomName.trim() === ""){
    req.body.roomName = makeid(5)
  }
  const id = uuidv4()
  roomData.push({id,data:req.body})
  res.json({id,roomData})
})
app.get('/room',(req,res)=>{
  res.json( roomData)
})

app.get('/room/:roomId',(req,res)=>{
  res.json(roomData.find(e=>e.id===req.params.roomId))
})


app.get('/', (req, res) => {
  res.json({welcome:'to my api'})
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
});

