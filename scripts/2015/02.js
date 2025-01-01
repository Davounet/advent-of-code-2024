import { getInput, sumArray, multiplyArray } from '../../tools.js'
const input = await getInput(2015, 2)
const list = parseInput(input)

const paper = list.map(sizes => {
  const ordered = sizes.sort((a, b) => a - b)
  const areas = [ordered[0] * ordered[1], ordered[1] * ordered[2], ordered[2] * ordered[0]]
  const total = areas[0] + 2 * sumArray(areas)
  return total
})
console.log({ part1: sumArray(paper) })

const ribbon = list.map(sizes => {
  const ordered = sizes.sort((a, b) => a - b)
  return 2 * (ordered[0] + ordered[1]) + multiplyArray(ordered)
})
console.log({ part2: sumArray(ribbon) })

function parseInput(input) {
  const items = input.split('\n').map(raw => raw.split('x').map(Number))
  return items
}
