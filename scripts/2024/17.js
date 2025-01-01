const fs = require('fs').promises
const A = 0
const B = 1
const C = 2
const OPCODES = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv']
const INSTRUCTIONS = {
  adv: (state, arg) => {
    state.registers[A] = state.registers[A] >> getArg(state, arg)
    return false
  },
  bxl: (state, arg) => {
    state.registers[B] = state.registers[B] ^ arg
    return false
  },
  bst: (state, arg) => {
    state.registers[B] = getArg(state, arg) & 7n
    return false
  },
  jnz: (state, arg) => {
    if (state.registers[A] !== 0n) state.counter = Number(arg)
    return state.registers[A] !== 0n
  },
  bxc: (state, arg) => {
    state.registers[B] = state.registers[B] ^ state.registers[C]
    return false
  },
  out: (state, arg) => {
    state.output.push(getArg(state, arg) & 7n)
    return false
  },
  bdv: (state, arg) => {
    state.registers[B] = state.registers[A] >> getArg(state, arg)
    return false
  },
  cdv: (state, arg) => {
    state.registers[C] = state.registers[A] >> getArg(state, arg)
    return false
  }
}

main('17')

async function main(file) {
  const buffer = await fs.readFile(`./inputs/${file}.txt`)
  const input = buffer.toString()
  const { registers, instructions } = parseInput(input)
  const { output } = run(registers[0], instructions)
  console.log({ part1: output.join(',') })

  const part2 = search(0n, instructions.length - 1, instructions)
  console.log({ part2 })
}

function parseInput(input) {
  const [first, second] = input.split('\n\n')
  const registers = first.split('\n').map(line => BigInt(line.split(': ')[1]))
  const instructions = second
    .split(': ')[1]
    .split(',')
    .map(num => BigInt(num))
  return { registers, instructions }
}

function run(a, instructions) {
  const state = {
    registers: [a, 0n, 0n],
    counter: 0,
    output: []
  }

  while (true) {
    const instruction = instructions[state.counter]
    const arg = instructions[state.counter + 1]
    const isJump = INSTRUCTIONS[OPCODES[Number(instruction)]](state, arg)
    state.counter += isJump ? 0 : 2

    if (state.counter < 0 || state.counter >= instructions.length) break
  }

  return state
}
function getArg(state, arg) {
  if (arg <= 3n) return arg
  if (arg === 4n) return state.registers[A]
  if (arg === 5n) return state.registers[B]
  if (arg === 6n) return state.registers[C]
  return 0n
}

function search(value, current, instructions) {
  if (current < 0) return value

  for (let i = value << 3n; i < (value << 3n) + 8n; i++) {
    const { output } = run(i, instructions)
    if (output[0] === instructions[current]) {
      const final = search(i, current - 1, instructions)
      if (final !== -1n) return final
    }
  }
  return -1n
}
