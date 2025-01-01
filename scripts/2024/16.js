const fs = require('fs').promises

main('16')

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 }
]

async function main(file) {
  const buffer = await fs.readFile(`./inputs/${file}.txt`)
  const input = buffer.toString()
  const { start, end, forward, backward } = parseInput(input)
  const distances = dijkstra(forward, start)
  const endKey = `${end.x},${end.y}`
  console.log({ part1: distances[endKey] })

  const toEnd = dijkstra(backward, end, true)
  const target = distances[endKey]
  const spaces = new Set()

  Object.keys(distances).forEach(position => {
    if (position !== endKey && distances[position] + toEnd[position] === target) {
      const [x, y] = position.split(',')
      spaces.add(`${x},${y}`)
    }
  })
  console.log({ part2: spaces.size })
}

function parseInput(input) {
  const grid = input.split('\n')
  const limits = { x: grid[0].length, y: grid.length }

  let start = { x: 0, y: 0 }
  let end = { x: 0, y: 0 }
  const forward = {}
  const backward = {}
  for (let y = 0; y < limits.y; y++) {
    for (let x = 0; x < limits.x; x++) {
      if (grid[y][x] === 'S') start = { x, y }
      if (grid[y][x] === 'E') end = { x, y }

      if (grid[y][x] !== '#') {
        DIRECTIONS.forEach((direction, i) => {
          const key = `${x},${y},${i}`
          const position = { x: x + direction.x, y: y + direction.y }
          const moveKey = `${position.x},${position.y},${i}`

          if (inBounds(position, limits) && grid[position.y][position.x] !== '#') {
            if (forward[key] === undefined) forward[key] = {}
            if (backward[moveKey] === undefined) backward[moveKey] = {}

            forward[key][moveKey] = 1
            backward[moveKey][key] = 1
          }

          for (const rotateKey of [`${x},${y},${(i + 3) % 4}`, `${x},${y},${(i + 1) % 4}`]) {
            if (forward[key] === undefined) forward[key] = {}
            if (backward[rotateKey] === undefined) backward[rotateKey] = {}

            forward[key][rotateKey] = 1000
            backward[rotateKey][key] = 1000
          }
        })
      }
    }
  }

  DIRECTIONS.forEach((_, i) => {
    const key = `${end.x},${end.y}`
    const rotateKey = `${end.x},${end.y},${i}`

    if (forward[rotateKey] === undefined) forward[rotateKey] = {}
    if (backward[key] === undefined) backward[key] = {}

    forward[rotateKey][key] = 0
    backward[key][rotateKey] = 0
  })

  return { start, end, forward, backward }
}

function dijkstra(graph, start, directionless = false) {
  const queue = new MinHeap()
  const distances = {}

  let startingKey = `${start.x},${start.y},0`
  if (directionless) startingKey = `${start.x},${start.y}`

  queue.insert({ score: 0, node: startingKey })
  distances[startingKey] = 0

  while (queue.size() != 0) {
    const current = queue.extractMin()

    if (distances[current.node] < current.score) continue

    if (graph[current.node] === undefined) continue

    Object.entries(graph[current.node]).forEach(([next, weight]) => {
      const newScore = current.score + weight
      if (distances[next] === undefined || distances[next] > newScore) {
        distances[next] = newScore
        queue.insert({ score: newScore, node: next })
      }
    })
  }

  return distances
}

function inBounds(coords, limits) {
  return coords.x >= 0 && coords.x < limits.x && coords.y >= 0 && coords.y < limits.y
}

class MinHeap {
  heap
  constructor() {
    this.heap = []
  }

  insert(element) {
    this.heap.push(element)
    let index = this.heap.length - 1

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[index].score >= this.heap[parentIndex].score) break

      const temp = this.heap[parentIndex]
      this.heap[parentIndex] = this.heap[index]
      this.heap[index] = temp
      index = parentIndex
    }
  }

  extractMin() {
    if (this.heap.length === 1) return this.heap.pop()
    const min = this.heap[0]
    this.heap[0] = this.heap.pop()
    let index = 0

    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let smallest = index

      if (leftChild < this.heap.length && this.heap[leftChild].score < this.heap[smallest].score) smallest = leftChild
      if (rightChild < this.heap.length && this.heap[rightChild].score < this.heap[smallest].score)
        smallest = rightChild
      if (smallest === index) break

      const temp = this.heap[smallest]
      this.heap[smallest] = this.heap[index]
      this.heap[index] = temp
      index = smallest
    }

    return min
  }

  size() {
    return this.heap.length
  }
}
