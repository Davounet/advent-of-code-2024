import { getInput } from '../../tools.js'
const input = await getInput(2015, 1)

const position = input.split('').reduce((p, char) => {
  const change = char === '(' ? 1 : -1
  return p + change
}, 0)
console.log({ part1: position })

const part2 = input.split('').reduce(
  (state, char, i) => {
    if (state.first !== undefined) return state
    const change = char === '(' ? 1 : -1
    state.position = state.position + change
    if (state.position === -1) state.first = i
    return state
  },
  { position: 0, first: undefined }
)
console.log({ part2: part2.first + 1 })
