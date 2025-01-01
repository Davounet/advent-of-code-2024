const fs = require('fs').promises
const MOVES = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 }
]

main('20')

async function main(file) {
  const buffer = await fs.readFile(`./inputs/${file}.txt`)
  const input = buffer.toString()
  const { grid, limits, end } = parseInput(input)
  const distances = bfs(grid, end, limits)
  const part1 = getCheats(distances, 2)
  console.log({ part1 })
  const part2 = getCheats(distances, 20)
  console.log({ part2 })
}

function bfs(grid, start, limits) {
  const queue = []
  const distances = {}

  queue.push({ ...start, steps: 0 })
  distances[`${start.x},${start.y}`] = 0

  while (queue.length !== 0) {
    const current = queue.shift()
    if (current === undefined) break

    MOVES.forEach(direction => {
      const position = { x: current.x + direction.x, y: current.y + direction.y }
      if (outOfBounds(position, limits) || grid[position.y][position.x] === '#') return

      const newDistance = current.steps + 1
      const key = `${position.x},${position.y}`
      if (distances[key] === undefined || distances[key] > newDistance) {
        queue.push({ ...position, steps: current.steps + 1 })
        distances[`${position.x},${position.y}`] = newDistance
      }
    })
  }

  return distances
}

function getCheats(distances, length) {
  let count = 0

  const walkable = Object.keys(distances).map(k => k.split(',').map(Number))
  walkable.forEach(cell1 => {
    const neighbours = walkable.filter(cell2 => dist(cell1, cell2) <= length)
    neighbours.forEach(cell2 => {
      const offset = dist(cell1, cell2)
      if (distances[cell1.join(',')] - distances[cell2.join(',')] - offset >= 100) count++
    })
  })

  return count
}

function outOfBounds(position, limits) {
  return position.x < 0 || position.x > limits.x || position.y < 0 || position.y > limits.y
}

function dist(cell1, cell2) {
  return Math.abs(cell1[0] - cell2[0]) + Math.abs(cell1[1] - cell2[1])
}

function parseInput(input) {
  const grid = input
    .trim()
    .split('\n')
    .map(line => line.split(''))

  const limits = { x: grid[0].length, y: grid.length }

  let end
  for (let y = 0; y < limits.y; y++) {
    for (let x = 0; x < limits.x; x++) {
      if (grid[y][x] === 'E') {
        end = { x, y }
        grid[y][x] = '.'
      }
    }
  }
  return { grid, limits, end }
}
