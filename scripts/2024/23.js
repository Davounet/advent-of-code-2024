const fs = require('fs').promises

main('23')

async function main(target) {
  const buffer = await fs.readFile(`./inputs/${target}.txt`)
  const input = buffer.toString()
  const { links } = parseInput(input)

  const graph = links.reduce((graph, [from, to]) => {
    if (!graph[from]) graph[from] = []
    if (!graph[to]) graph[to] = []
    graph[from].push(to)
    graph[to].push(from)
    return graph
  }, {})

  const groups3 = findGroups3(graph)
  const filteredGroups = filterGroupsT(groups3)
  console.log({ part1: filteredGroups.length })

  const group = findBiggestGroup(links, graph)
  console.log({ part2: group.sort().join(',') })
}

function findGroups3(graph) {
  const groups = new Set()
  Object.entries(graph).forEach(([node, neighbors]) => {
    neighbors.forEach(neighbor1 => {
      const neighbors2 = graph[neighbor1]
      const commons = neighbors.filter(neighbor => neighbors2.includes(neighbor))
      commons.forEach(neighbor2 => {
        const computers = [node, neighbor1, neighbor2].sort()
        const key = computers.join(',')
        groups.add(key)
      })
    })
  })
  return groups
}

function filterGroupsT(groups) {
  return [...groups].filter(key => {
    const computers = key.split(',')
    return !!computers.find(computer => computer[0] === 't')
  })
}

function findBiggestGroup(links, graph) {
  let groups = new Set(links.map(computers => computers.sort().join(',')))

  while (groups.size > 1) {
    const temp = new Set()
    groups.forEach(group => {
      const comps = group.split(',')
      const commons = comps.map(c => graph[c]).reduce((a, b) => a.filter(c => b.includes(c)))
      if (commons.length > 0) {
        commons.forEach(common => temp.add([...comps, common].sort().join(',')))
      }
    })
    groups = temp
  }
  return Array.from(groups)
}

function parseInput(input) {
  const links = input.split('\n').map(line => line.split('-'))
  return { links }
}
