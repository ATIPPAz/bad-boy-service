const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

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

app.get('/', (req, res) => {
  res.json({welcome:'to my api'})
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
});

