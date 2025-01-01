const fs = require('fs').promises
const DIRECTIONS = {
  '^': { x: 0, y: -1 },
  '>': { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 }
}
const NUMBER_KEYPAD = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 }
}
const DIRECTIONS_KEYPAD = {
  X: { x: 0, y: 0 },
  '^': { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  '<': { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  '>': { x: 2, y: 1 }
}

main('21')

async function main(file) {
  const buffer = await fs.readFile(`./inputs/${file}.txt`)
  const input = buffer.toString()
  const keycodes = input.trim().split('\n')

  const part1 = getComplexity(keycodes, 2)
  console.log({ part1 })
  const part2 = getComplexity(keycodes, 25)
  console.log({ part2 })
}

function getComplexity(keycodes, robots) {
  const store = {}
  const score = keycodes.reduce((sum, code) => {
    const number = parseInt(code.slice(0, -1))
    return sum + number * getKeyPresses(NUMBER_KEYPAD, code, robots, store)
  }, 0)
  return score
}

function getKeyPresses(input, code, robots, store) {
  const key = `${code},${robots}`
  if (store[key] !== undefined) return store[key]

  let current = 'A'
  let length = 0
  for (let i = 0; i < code.length; i++) {
    const moves = getCommand(input, current, code[i])
    if (robots === 0) length += moves[0].length
    else length += Math.min(...moves.map(move => getKeyPresses(DIRECTIONS_KEYPAD, move, robots - 1, store)))
    current = code[i]
  }

  store[key] = length
  return length
}

function getCommand(input, start, end) {
  const queue = [{ ...input[start], path: '' }]
  const distances = {}

  if (start === end) return ['A']

  const allPaths = []
  while (queue.length) {
    const current = queue.shift()
    if (current === undefined) break

    if (current.x === input[end].x && current.y === input[end].y) allPaths.push(current.path + 'A')
    if (
      distances[`${current.x},${current.y}`] !== undefined &&
      distances[`${current.x},${current.y}`] < current.path.length
    )
      continue

    Object.entries(DIRECTIONS).forEach(([direction, vector]) => {
      const position = { x: current.x + vector.x, y: current.y + vector.y }

      // Avoid cells with no button
      if (input.X.x === position.x && input.X.y === position.y) return

      const button = Object.values(input).find(button => button.x === position.x && button.y === position.y)
      if (button !== undefined) {
        const newPath = current.path + direction
        if (
          distances[`${position.x},${position.y}`] === undefined ||
          distances[`${position.x},${position.y}`] >= newPath.length
        ) {
          queue.push({ ...position, path: newPath })
          distances[`${position.x},${position.y}`] = newPath.length
        }
      }
    })
  }
  return allPaths.sort((a, b) => a.length - b.length)
}
