 
function Cal(pairs){
  const startTime = new Date()
  const members = []
  for(let i = 0; i< pairs;i++){
     members.push(i) 
  }
  const limitTeam = 2
  const pair = []
  let teamHeader = []
  let key = 0;
 
  for(let i  = 0;i< members.length;i++){
  for(let j = i+1;j<members.length;j++){
      if(i==0){
          teamHeader.push({index:key,data:[members[i],members[j]],indexStater:[]})
      }
      else{
      pair.push({index:key,data:[members[i],members[j]]})
      }
      key++
  }
  }
  const team = []
  let first17 = true
  teamHeader.forEach(x=>{
  while(x.indexStater.length<(members.length/limitTeam)){
  x.indexStater.push(0)
  }
  })
  teamHeader.sort().reverse()
  for(let i = 0;i< teamHeader.length;i++){
  const teamPair = []
  teamPair.push(teamHeader[i])
  let hasError = false
  for (let index = 0; index < teamHeader[i].indexStater.length; index++) {
    // console.log(i,index,teamHeader[i].indexStater[index])
    
    let indexChild = teamHeader[i].indexStater[index]
  
    if(i===17 && first17){
      indexChild = 99999
      teamHeader[i].indexStater[index] = 16
      indexChild = 16
      first17 = false
    }
    
    const filterPaired = pair.filter(x=>!x.data.some(s=>teamHeader[i].data.some(f=>f==s))).filter(x=>!x.data.some(g=>teamPair.some(s=>s.data.some(f=>f==g)))).filter(f=>!team.some(s=>s.some(g=>g.index == f.index)))
    let isd=0;
    if(filterPaired.length>=18 && i == 17){
      lsd = 0;
    }
    // if(i == 17 && index<2){
    //   console.log(i,index, "["+teamHeader[i].indexStater[0]+']',"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds Go back to the previous pair.")
    // }
    if(index==0 && i == 17 && indexChild==(filterPaired.length-1)){
      isd = 1;
      ;
    }
    if(teamPair.length ==teamHeader[i].indexStater.length){
      break;
    }
    if(filterPaired.length<=indexChild){
        if(teamHeader[i]==teamPair.pop()){
            teamHeader[i-1].indexStater[(members.length/limitTeam)-2]+=1
            // teamHeader = teamHeader.map((x,indexP)=>{
            //   if(indexP>i){
            //     x.indexStater.map(x=>0)
            //   }
            // })
            teamHeader= teamHeader.map((x,indexP)=>{
              if(indexP>i-1){
                return {indexStater:x.indexStater.map(x=>0),data:x.data,index:x.index}
              }
              else{
                  return x
              }
            })
            i-=2
            hasError = true
            break;
        }
        else{
          teamHeader[i].indexStater[index-1]++;
          // teamHeader[i].indexStater.filter((x,indexk)=>indexk>index-1).forEach(x=>x=0)
          // tofix index infinity loop
          teamHeader[i].indexStater= teamHeader[i].indexStater.map((x,indexP)=>{
            if(indexP>index-1){
              return 0
            }
            else{
              return x
            }
          })
          index-=2;
  // console.log(i, "["+teamHeader[i].indexStater.join(',')+']',"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds Go back to the previous pair.")
}
    }
    else{
        teamPair.push(filterPaired[indexChild])
    }
  }
  if(!hasError){
  team.push(teamPair)
  // console.log(team)
  // console.log(i,"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds")

  }
  else{
    team.pop()
  // console.log(i,"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds is error!!")
    
  }
  }
  const teamFinish = team.map(x=>x.map(f=>f.data))
  for (let index = 0; index < team.length+1; index++) {
  let summation = 0
  const data = teamFinish.map(x=>x.find(f=>f.some(s=>s==index)))
  data.forEach(x=>{
    summation+=parseInt([...x.filter(f=>f!=index)])
  })
  }
  const endDate = new Date()
  const diff = endDate - startTime
  const elaped = Math.round((diff) / 1000)
  // console.log(pairs+"member use " + diff/1000 + " seconds")
  return teamFinish
  }
  function main(){
  const cateria = [20]

  cateria.forEach( x=>{
      console.log('result',Cal(x))
  })
  
  }
  main()
  
  