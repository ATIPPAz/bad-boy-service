function createIdTeam(memberLength) {
  const members = []
  for (let i = 0; i < memberLength; i++) {
    members.push(i)
  }
  return members
}
function createTeamHeaderAndBody(members) {
  const header = []
  const body = []
  let key = 0
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      if (i == 0) {
        header.push({ index: key, data: [members[i], members[j]], indexStater: [] })
      }
      else {
        body.push({ index: key, data: [members[i], members[j]] })
      }
      key++
    }
  }
  const limitTeam = 2
  header.forEach(x => {
    while (x.indexStater.length < (members.length / limitTeam) - 1) {
      x.indexStater.push(0)
    }
  })
  return {
    header: header,
    body: body
  }
}
function createUniquePair({ header, body }, estimate) {
  const team = []
  if (estimate == null || estimate > header.length - 1) {
    estimate = header.length - 1
  }
  for (let i = 0; i < header.length; i++) {
    if (team.length == estimate) {
      return team.map(x => x.map(f => f.data))
    }
    const teamPair = []
    teamPair.push(header[i])
    const _filterPaired = body.filter(x => !x.data.some(s => header[i].data.some(f => f == s))).filter(f => !team.some(s => s.some(g => g.index == f.index)))
    let hasError = false
    for (let index = 0; index < header[i].indexStater.length; index++) {
      let indexChild = header[i].indexStater[index]
      const filterPaired = _filterPaired.filter(x => !x.data.some(g => teamPair.some(s => s.data.some(f => f == g))))
      if (filterPaired.length <= indexChild) {
        if (header[i] == teamPair.pop()) {
          header[i - 1].indexStater[(members.length / limitTeam) - 2] += 1
          header = header.map((x, indexP) => (indexP > i - 1) ? { indexStater: x.indexStater.map(x => 0), data: x.data, index: x.index } : x)
          i -= 2
          hasError = true
          break
        }
        else {
          header[i].indexStater[index - 1]++
          header[i].indexStater = header[i].indexStater.map((x, indexP) => indexP > index - 1 ? 0 : x)
          index -= 2
        }
      }
      else {
        teamPair.push(filterPaired[indexChild])
      }
    }
    if (!hasError) {
      team.push(teamPair)
    }
    else {
      team.pop()
    }
  }
  return team.map(x => x.map(f => f.data))
}
function createPairTemplate(memberLength, estimate = 4) {
  const ids = createIdTeam(memberLength)
  const template = createTeamHeaderAndBody(ids)
  return createUniquePair(template, estimate)
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
async function test(member,limit,start,random,memberLock=[]) {
  const cateria = { memberLength: member.length, limit: limit, start: start, random: random }

 
    const result = createPairTemplate(cateria.memberLength, cateria.limit ?? null).filter((_, index) => index + 1 > cateria.start)
    const ids = []
    result.forEach(x => {
      x.forEach(y => {
        y.forEach(v => {
          if (ids.findIndex(fid => fid == v) == -1) {
            ids.push(v)
          }
        })
      })
    })
    if (cateria.random) {
      member = shuffleArray(member)
    }
    const memberList = ids.map((x, index) => { return { name: member[index] ?? `nodata Name ${x}`, value: x } })
    const mapUserIdAndName = (result.map(x => x.map(g => g.map(c => memberList.find(f => f.value == c).name))) ?? [])
    memberLock.forEach(teamLock => {
      mapUserIdAndName.forEach(teamPaired => {
        teamPaired.push(teamLock)
        teamPaired = shuffleArray(teamPaired)
        console.log(teamPaired)
      })
    })
  
}
function main(){
  let member = ["prem", "ten", 'non', 'not', 'day', 'bam', 'game', 'rin', 'dofe', 'mark', 'ood', 'may', 'rug', 'win', 'mawin', 'hen', 'us', 'fish', 'goom', 'gem']
  const memberLock = [["ggkk", "jjj"]]

  test
}
main()

