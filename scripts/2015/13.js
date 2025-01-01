import { getInput, permute } from '../../tools.js'
const input = await getInput(2015, 13)

const { graph } = parseInput(input)
const names = Object.keys(graph)

// Could optimize this by blocking the first element before permuting
const choices1 = permute(names).filter(choice => choice[0] === names[0])
const scores1 = choices1.map(choice => getScore(choice, graph))
console.log({ part1: getMax(scores1) })

const choices2 = permute([...names, 'Me']).filter(choice => choice[0] === names[0])
const scores2 = choices2.map(choice => getScore(choice, graph))
console.log({ part1: getMax(scores2) })

function getScore(list, graph) {
  return list.reduce((acc, curr, i, list) => {
    const prev = list[i - 1] || list[list.length - 1]
    const next = list[i + 1] || list[0]
    return acc + (graph?.[curr]?.[prev] ?? 0) + (graph?.[curr]?.[next] ?? 0)
  }, 0)
}
function getMax(array) {
  return array.reduce((acc, curr) => Math.max(acc, curr), -Infinity)
}

function parseInput(input) {
  const links = input
    .split('\n')
    .map(line => {
      const [_, n1, action, amount, n2] = line.match(
        /(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\./
      )
      return { n1, n2, amount: action === 'gain' ? Number(amount) : -Number(amount) }
    })
    .sort((a, b) => b.amount - a.amount)

  const graph = links.reduce((acc, link) => {
    if (!acc[link.n1]) acc[link.n1] = {}
    acc[link.n1][link.n2] = link.amount
    return acc
  }, {})

  return { links, graph }
}
