function createPlayerPair(members) {
  const pair = []
  members.forEach((x, indexX) => {
    pair.push([])
    members.forEach((y, indexY) => {
      const array = []
      array.push(x)
      if (indexY != indexX) {
        array.push(y)
      }
      if (members.length % 2 != 0 || array.length == 2) pair[indexX].push(array)
    })
  })
  console.log('create paired')
  const team = []
  let indexSelected = members.length
  pair.forEach(x => {
    const _team = []
    for (var i = 0; members.length - i > Math.floor(pair.length / 2); i++) {
      // console.log(indexSelected,i,indexSelected-1-i)
      _team.push(pair[i][indexSelected - 1 - i])
    }
    indexSelected--
    if (indexSelected == Math.floor(members.length / 2)) indexSelected = members.length
    team.push(_team)
  })
  console.log('check paired')
  const paired = []
  const c = pair.map(x => x.map(y => y.slice().sort()))
  let frames = ['. ', '.. ', '... ']
  let index = 0
  c.forEach((f, indexs) => {
    process.stdout.write(`\rchecking ${indexs} ${frames[index]}`)
    index = (index + 1) % frames.length
    // to fix to better way
    f.forEach(t => {
      if (!paired.some(x => x.join(',') == t.join(','))) {
        paired.push(t)
      }
    })

  })
  console.log('finish paired')
  console.clear()
  return paired
}
function mapTeam(members, pairedMember) {
  console.log('create team template')
  const teams = []
  let indexParent = 0
  let error = false
  let hasAdded = []
  const maxteam = Math.ceil(members.length / 2)
  for (let i = 0; i < members.length - 1; i++) {
    const compare = [pairedMember.filter(x => x[0] === members[0] && !teams.some(s => s[0] == x))[0]]
    if (error) { indexParent++ }
    let indexBody = indexParent
    error = false
    let indexChild = indexBody
    let isReturn = false
    for (let j = 0; j < maxteam - 1;) {
      process.stdout.write(`\rcouple ${i} is procressing... ${((j / maxteam) * 100).toFixed(2)}%`)
      const body = pairedMember.filter(x => !hasAdded.some(y => y == x)).filter(f => !f.some(v => compare.some(g => g.some(h => h === v))))

      if (body.length === 0) {
        compare.pop()
        indexBody++
        indexChild++
        j--
        isReturn = true
      }
      else {
        let index = indexChild == indexBody ? indexBody : indexChild > indexBody ? !isReturn ? indexBody : indexChild : indexBody
        if (index >= body.length) {
          j = maxteam
          error = true
          i -= 2
          teams.pop()
        }
        else {
          compare.push(body[index])
          isReturn = false
          indexBody = 0
          j++
        }
      }
    }
    if (error) {
      hasAdded = hasAdded.filter(x => (compare.length >= 0 ? compare.slice(1) : compare).some(c => c === x))
    }
    else {
      error = false
      indexChild = 0
      hasAdded.push(...compare)
      indexBody = 0
      indexParent = 0
      teams.push([...compare])
    }
  }
  console.clear()
  return teams
}
function main() {

  const startTime = new Date()
  const members = []
  const teamLock = []
  for (let i = 0; i < 100; i++) {
    members.push(`${i}`)
  }
  members.push(...teamLock)
  console.log(members)
  console.log(mapTeam(members, createPlayerPair(members)))
  console.log(Math.round((new Date() - startTime) / 1000) + " seconds in " + members.length + "s")
}
main()
