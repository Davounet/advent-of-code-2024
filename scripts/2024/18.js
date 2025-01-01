const fs = require('fs').promises
const LIMITS = { x: 70, y: 70 }
const MOVES = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 }
]
main('18')

async function main(file) {
  const buffer = await fs.readFile(`./inputs/${file}.txt`)
  const input = buffer.toString()
  const walls = parseInput(input)

  const part1 = bfs(walls.slice(0, 1024), { x: 0, y: 0 }, LIMITS)
  console.log({ part1 })

  let bottom = 0
  let limit = walls.length - 1
  while (bottom < limit) {
    const mid = Math.floor((limit + bottom) / 2)
    const bottomSearch = bfs(new Set(walls.slice(0, mid)), { x: 0, y: 0 }, LIMITS)
    const topSearch = bfs(new Set(walls.slice(0, limit)), { x: 0, y: 0 }, LIMITS)

    if (bottomSearch === -1) limit = mid - 1
    else if (topSearch === -1) bottom = mid + 1
  }
  const part2 = walls[bottom - 1]
  console.log({ part2 })
}

function bfs(walls, start, end) {
  const queue = []
  const visited = new Set()
  const blocked = new Set(walls)

  queue.push({ ...start, steps: 0 })
  visited.add(`${start.x},${start.y}`)

  while (queue.length !== 0) {
    const current = queue.shift()
    if (current === undefined) break

    // Reached the end
    if (current.x === end.x && current.y === end.y) return current.steps

    MOVES.forEach(direction => {
      const position = { x: current.x + direction.x, y: current.y + direction.y }
      if (
        outOfBounds(position) ||
        blocked.has(`${position.x},${position.y}`) ||
        visited.has(`${position.x},${position.y}`)
      )
        return

      queue.push({ ...position, steps: current.steps + 1 })
      visited.add(`${position.x},${position.y}`)
    })
  }

  // returns -1 if the end is unreachable
  return -1
}

function parseInput(input) {
  return input.trim().split('\n')
}
function outOfBounds(position) {
  return position.x < 0 || position.x > LIMITS.x || position.y < 0 || position.y > LIMITS.y
}
