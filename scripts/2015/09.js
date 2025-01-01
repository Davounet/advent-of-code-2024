import { getInput, permute } from '../../tools.js'
const input = await getInput(2015, 9)
const graph = parseInput(input)

const cities = Object.keys(graph)
const choices = permute(cities).map(order => {
  return order.reduce((sum, city, i) => {
    if (i === 0) return sum
    const previous = order[i - 1]
    const distance = graph[previous][city]
    return sum + distance
  }, 0)
})
console.log({ part1: Math.min(...choices) })
console.log({ part1: Math.max(...choices) })

function parseInput(input) {
  const distances = input.split('\n').map(line => {
    const [, c1, c2, d] = /^([a-zA-Z]+) to ([a-zA-Z]+) = (\d+)$/.exec(line)
    return { c1, c2, d: Number(d) }
  })

  const graph = distances.reduce((store, d) => {
    if (!store[d.c1]) store[d.c1] = {}
    if (!store[d.c2]) store[d.c2] = {}
    store[d.c1][d.c2] = d.d
    store[d.c2][d.c1] = d.d
    return store
  }, {})
  return graph
}
