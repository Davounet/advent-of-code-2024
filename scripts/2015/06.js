import { getInput, sumArray } from '../../tools.js'
const input = await getInput(2015, 6)
const instructions = parseInput(input)

const grid1 = Array.from({ length: 1000 }).map(() => Array.from({ length: 1000 }).map(() => false))
instructions.forEach(({ instruction, points }) => {
  Array.from({ length: points[1][1] - points[0][1] + 1 }).forEach((_, j) => {
    Array.from({ length: points[1][0] - points[0][0] + 1 }).forEach((_, i) => {
      const x = points[0][0] + i
      const y = points[0][1] + j
      if (instruction === 'toggle') grid1[y][x] = !grid1[y][x]
      if (instruction === 'turn on') grid1[y][x] = true
      if (instruction === 'turn off') grid1[y][x] = false
    })
  })
})
console.log({ part1: sumArray(grid1.map(r => r.filter(Boolean).length)) })

const grid2 = Array.from({ length: 1000 }).map(() => Array.from({ length: 1000 }).map(() => 0))
instructions.forEach(({ instruction, points }) => {
  Array.from({ length: points[1][1] - points[0][1] + 1 }).forEach((_, j) => {
    Array.from({ length: points[1][0] - points[0][0] + 1 }).forEach((_, i) => {
      const x = points[0][0] + i
      const y = points[0][1] + j
      if (instruction === 'toggle') grid2[y][x] += 2
      if (instruction === 'turn on') grid2[y][x] += 1
      if (instruction === 'turn off') grid2[y][x] = grid2[y][x] >= 1 ? grid2[y][x] - 1 : 0
    })
  })
})
console.log({ part1: sumArray(grid2.map(r => sumArray(r))) })

function parseInput(input) {
  const regex = /^(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)$/
  const list = input.split('\n').map(string => {
    const [, instruction, x1, y1, x2, y2] = regex.exec(string)
    const x = [Number(x1), Number(x2)].sort((a, b) => a - b)
    const y = [Number(y1), Number(y2)].sort((a, b) => a - b)
    const points = [
      [x[0], y[0]],
      [x[1], y[1]]
    ]
    return { instruction, points }
  })
  return list
}
