const fs = require('fs').promises
const MAX = 45

main('24')

async function main(target) {
  const buffer = await fs.readFile(`./inputs/${target}.txt`)
  const input = buffer.toString()
  const { initial, gates } = parseInput(input)
  const state = compute({ initial, gates })
  const z = getNumber(state)
  console.log({ number1: z })

  analyse({ initial, gates })

  /* const x = getNumber(state, 'x')
  const y = getNumber(state, 'y')
  console.log({ x, y, z }) */
}

function compute({ initial, gates }) {
  const state = { ...initial }
  const toCompute = [...gates]
  while (toCompute.length > 0) {
    let index = 0
    while (state[toCompute[index].i1] === undefined || state[toCompute[index].i2] === undefined) {
      index++
    }

    const gate = toCompute.splice(index, 1)[0]
    state[gate.out] = computeGate(gate, state)
  }
  return state
}

function analyse({ initial, gates }) {
  /* 
    For each bit except the first one we have the following:
    sK = xK XOR yK
    rK = xK AND yK
    tK = sK AND cK-1
    cK = rK OR tK
    zK = sK XOR cK-1
  */

  // Build the target gates in an ideal world
  const targets = [
    { i1: 'x00', i2: 'y00', operator: 'XOR', out: 'z00' },
    { i1: 'x00', i2: 'y00', operator: 'AND', out: 'C00' }
  ]
  for (let i = 1; i < MAX; i++) {
    const stage = [
      { i1: getKey('x', i), i2: getKey('y', i), operator: 'XOR', out: getKey('S', i) },
      { i1: getKey('x', i), i2: getKey('y', i), operator: 'AND', out: getKey('R', i) },
      { i1: getKey('C', i - 1), i2: getKey('S', i), operator: 'AND', out: getKey('T', i) },
      { i1: getKey('R', i), i2: getKey('T', i), operator: 'OR', out: getKey('C', i) },
      { i1: getKey('C', i - 1), i2: getKey('S', i), operator: 'XOR', out: getKey('z', i) }
    ]
    targets.push(...stage)
  }

  const incorrect = []
  for (let i = 0; i < MAX; i++) {
    // Retrieve the first gates from the X and Y inputs
    const xor = gates.find(g => g.operator === 'XOR' && g.i1 === getKey('x', i) && g.i2 === getKey('y', i))
    const and = gates.find(g => g.operator === 'AND' && g.i1 === getKey('x', i) && g.i2 === getKey('y', i))

    // The AND gate must go to a OR gate (except for the first one)
    const isOr = gates.find(g => g.i1 === and.out || g.i2 === and.out)
    if (i > 0 && isOr && isOr.operator !== 'OR') incorrect.push(and.out)

    // The XOR gate is never connector to an OR gate
    const notOr = gates.find(g => g.i1 === xor.out || g.i2 === xor.out)
    if (notOr && notOr.operator === 'OR') incorrect.push(xor.out)

    // Every gate that points to Z is a XOR
    const z = gates.find(g => g.out === getKey('z', i))
    if (z && z.operator !== 'XOR') incorrect.push(z.out)
  }

  // The XOR gates are either from X and Y or to Z
  const badXor = gates
    .filter(g => {
      if (g.operator !== 'XOR') return false
      return g.out[0] !== 'z' && (g.i1[0] !== 'x' || g.i2[0] !== 'y')
    })
    .map(g => g.out)
  incorrect.push(...badXor)

  console.log({ bad: incorrect.sort().join(',') })
}

function getKey(letter, number) {
  return `${letter}${number.toString().padStart(2, '0')}`
}

function getNumber(state, letter = 'z') {
  let number = 0
  for (let i = 0; i < MAX; i++) {
    number += (state[getKey(letter, number)] ?? 0) * Math.pow(2, i)
  }
  return number
}

function computeGate(gate, state) {
  if (gate.operator === 'AND') {
    return state[gate.i1] & state[gate.i2]
  }
  if (gate.operator === 'OR') {
    return state[gate.i1] | state[gate.i2]
  }
  if (gate.operator === 'XOR') {
    return state[gate.i1] ^ state[gate.i2]
  }
}

function parseInput(input) {
  const parts = input.split('\n\n')
  const initial = parts[0]
    .split('\n')
    .map(line => line.split(': '))
    .reduce((acc, [key, value]) => {
      acc[key] = Number(value)
      return acc
    }, {})

  const regex = /(.+) (XOR|OR|AND) (.+) -> (.+)/
  const gates = parts[1].split('\n').map(line => {
    const [, first, operator, second, out] = regex.exec(line)
    const [i1, i2] = [first, second].sort()
    return { i1, i2, operator, out }
  })

  return { initial, gates }
}
