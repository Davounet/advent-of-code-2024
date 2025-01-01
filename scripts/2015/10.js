import { getInput } from '../../tools.js'
const input = await getInput(2015, 10)

const after40 = Array.from({ length: 40 }).reduce(string => lookAndSay(string), input)
const after50 = Array.from({ length: 10 }).reduce(string => lookAndSay(string), after40)
console.log({ part1: after40.length, part2: after50.length })

function lookAndSay(input) {
  const next = input.split('').reduce(
    (state, current, i) => {
      if (current === state.char) {
        state.count++
      } else {
        state.result += state.char === undefined ? '' : `${state.count}${state.char}`
        state.char = current
        state.count = 1
      }

      if (i === input.length - 1) state.result += `${state.count}${state.char}`
      return state
    },
    { result: '', char: undefined, count: 0 }
  )
  return next.result
}
