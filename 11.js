const input = '1 24596 0 740994 60 803 8918 9405859'
const test = '125 17'

const stones = input.split(' ').map(Number)
const store = {}

console.time('part1')
const stones1 = getStones(stones, 25)
console.timeEnd('part1')
console.log({ part1: stones1.length })

console.time('part1')
const count1 = stones.reduce((s, v) => s + getCount(v, 25), 0)
console.timeEnd('part1')
console.log({ count1, size: Object.keys(store).length })
console.time('part2')
const count2 = stones.reduce((s, v) => s + getCount(v, 75), 0)
console.timeEnd('part2')
console.log({ count2, size: Object.keys(store).length })

// Brute force
function getStones(start, count) {
  let state = structuredClone(start)
  let iter = 0
  while (iter < count) {
    iter++
    state = state.map(nextStones).flat()
  }
  return state
}

// Optimized
function getCount(stone, nbBlinks) {
  // Memoization
  const key = `${stone},${nbBlinks}`
  if (store[key]) return store[key]

  // Stop condition
  if (nbBlinks === 0) return 1

  const count = nextStones(stone).reduce((sum, v) => sum + getCount(v, nbBlinks - 1), 0)
  store[key] = count
  return count
}

function nextStones(stone) {
  if (!stone) return [1]
  if (stone.toFixed(0).length % 2 === 0) {
    const string = stone.toFixed(0)
    return [string.substring(0, string.length / 2), string.substring(string.length / 2)].map(Number)
  }
  return [stone * 2024]
}
