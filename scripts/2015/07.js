import { getInput } from '../../tools.js'
const input = await getInput(2015, 7)
const instructions = parseInput(input)

const a = part1(instructions)
console.log({ part1: a })
console.log({ part1: part2(instructions, a) })

function part1(instructions) {
  const list = structuredClone(instructions)
  const state = {}
  while (list.length) {
    list.forEach((line, index) => {
      if (line.gate === 'AND' && isResolved(line.i1, state) && isResolved(line.i2, state)) {
        state[line.o] = resolve(line.i1, state) & resolve(line.i2, state)
        list.splice(index, 1)
      }
      if (line.gate === 'OR' && isResolved(line.i1, state) && isResolved(line.i2, state)) {
        state[line.o] = resolve(line.i1, state) | resolve(line.i2, state)
        list.splice(index, 1)
      }
      if (line.gate === 'LSHIFT' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state) << Number(line.v)
        list.splice(index, 1)
      }
      if (line.gate === 'RSHIFT' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state) >> Number(line.v)
        list.splice(index, 1)
      }
      if (line.gate === 'NOT' && isResolved(line.i, state)) {
        state[line.o] = 65535 - resolve(line.i, state)
        list.splice(index, 1)
      }
      if (line.gate === 'SET' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state)
        list.splice(index, 1)
      }
    })
  }
  return state.a
}

function part2(instructions, b) {
  const list = structuredClone(instructions)
  const state = {}
  while (list.length) {
    list.forEach((line, index) => {
      if (line.gate === 'AND' && isResolved(line.i1, state) && isResolved(line.i2, state)) {
        state[line.o] = resolve(line.i1, state) & resolve(line.i2, state)
        list.splice(index, 1)
      }
      if (line.gate === 'OR' && isResolved(line.i1, state) && isResolved(line.i2, state)) {
        state[line.o] = resolve(line.i1, state) | resolve(line.i2, state)
        list.splice(index, 1)
      }
      if (line.gate === 'LSHIFT' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state) << Number(line.v)
        list.splice(index, 1)
      }
      if (line.gate === 'RSHIFT' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state) >> Number(line.v)
        list.splice(index, 1)
      }
      if (line.gate === 'NOT' && isResolved(line.i, state)) {
        state[line.o] = 65535 - resolve(line.i, state)
        list.splice(index, 1)
      }
      if (line.gate === 'SET' && isResolved(line.i, state)) {
        state[line.o] = resolve(line.i, state)
        if (line.o === 'b') state[line.o] = b
        list.splice(index, 1)
      }
    })
  }
  return state.a
}

function resolve(key, state) {
  if (!Number.isNaN(Number(key))) return Number(key)
  if (state[key] !== undefined) return state[key]
  return false
}
function isResolved(key, state) {
  return !Number.isNaN(Number(key)) || state[key] !== undefined
}

function parseInput(input) {
  return input.split('\n').map(line => {
    if (line.includes('AND')) {
      const [i1, , i2, , o] = line.split(' ') // x AND y -> d
      return { gate: 'AND', i1, i2, o }
    }
    if (line.includes('OR')) {
      const [i1, , i2, , o] = line.split(' ') // x OR y -> d
      return { gate: 'OR', i1, i2, o }
    }
    if (line.includes('LSHIFT')) {
      const [i, , v, , o] = line.split(' ') // p LSHIFT 2 -> q
      return { gate: 'LSHIFT', i, v, o }
    }
    if (line.includes('RSHIFT')) {
      const [i, , v, , o] = line.split(' ') // p RSHIFT 2 -> q
      return { gate: 'RSHIFT', i, v, o }
    }
    if (line.includes('NOT')) {
      const [, i, , o] = line.split(' ') // NOT x -> h
      return { gate: 'NOT', i, o }
    }
    const [i, , o] = line.split(' ') // 123 -> x
    return { gate: 'SET', i, o }
  })
}
