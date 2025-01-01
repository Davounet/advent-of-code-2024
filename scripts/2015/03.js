import { getInput } from '../../tools.js'
const input = await getInput(2015, 3)
const moves = {
  '>': [1, 0],
  '<': [-1, 0],
  '^': [0, -1],
  v: [0, 1]
}

const part1 = input.split('').reduce(
  ({ map, coords }, char) => {
    const move = moves[char]
    coords[0] += move[0]
    coords[1] += move[1]
    map.add(coords.join(','))
    return { map, coords }
  },
  { map: new Set(['0,0']), coords: [0, 0] }
)
console.log({ part1: part1.map.size })

const part2 = input.split('').reduce(
  (state, char, i) => {
    const move = moves[char]
    const key = i % 2 ? 'c0' : 'c1'
    state[key][0] += move[0]
    state[key][1] += move[1]
    state.map.add(state[key].join(','))
    return state
  },
  { map: new Set(['0,0']), c0: [0, 0], c1: [0, 0] }
)
console.log({ part1: part2.map.size })
