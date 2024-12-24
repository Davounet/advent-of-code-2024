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

  const swaps = []
  const translationIn = {}
  const translationOut = {}
  const updatedGates = structuredClone(gates).map(g => ({ ...g, checked: false }))

  targets.forEach(target => {
    // Good inputs and operator
    const gate = updatedGates.find(gate => sameInputs(gate, target) && gate.operator === target.operator)
    if (gate) {
      gate.checked = true
      const swapped = rename(gate.out, target.out, updatedGates, translationIn, translationOut)
      if (swapped.length) {
        swaps.push(...swapped)
        swapGates(swapped, updatedGates, translationOut)
      }
    }

    // Xor gate with a Z output
    if (target.operator === 'XOR' && target.out[0] === 'z') {
      const index = Number(target.out.slice(1))
      const sInput = getKey('S', index)
      const gate = updatedGates.find(g => g.operator === 'XOR' && (g.i1 === sInput || g.i2 === sInput))
      if (gate) {
        gate.checked = true
        if (gate.i1 === sInput) {
          gate.i1 = gate.i2
          gate.i2 = sInput
        }
        rename(gate.i1, getKey('C', index - 1), updatedGates, translationIn, translationOut)
        const swapped = rename(gate.i1, getKey('C', index - 1), updatedGates, translationIn, translationOut)
        if (swapped.length) {
          swaps.push(...swapped)
          swapGates(swapped, updatedGates, translationOut)
        }
      }
    }
  })

  console.log(swaps)
  findInconsistencies(updatedGates)
  console.log(updatedGates.filter(g => !g.checked))
}

function swapGates([wire1, wire2], store, tOut) {
  // Swap the two names in ouputs
  /* console.log(`Swapping ${wire1} and ${wire2} (${tOut[wire2]})`)
  console.log(tOut)
  const g1 = store.find(g => g.out === wire1 || g.out === tOut[wire1])
  const g2 = store.find(g => g.out === wire2 || g.out === tOut[wire2])
  console.log({ g1, g2 })
  g1.out = wire2
  g2.out = wire1 */
}
function rename(oldName, newName, store, tIn, tOut) {
  if (oldName === newName) return []
  if (oldName[0] === 'z' || newName[0] === 'z') {
    console.log(`Trying to rename ${oldName} in ${newName}`)
    const translated = tOut[newName] ?? newName
    return [oldName, translated]
  }

  tIn[oldName] = newName
  tOut[newName] = oldName
  store.forEach(g => {
    if (g.i1 === oldName) g.i1 = newName
    if (g.i2 === oldName) g.i2 = newName
    if (g.out === oldName) g.out = newName

    const [i1, i2] = [g.i1, g.i2].sort()
    g.i1 = i1
    g.i2 = i2
  })
  return []
}
function sameInputs(g1, g2) {
  return (g1.i1 === g2.i1 && g1.i2 === g2.i2) || (g1.i1 === g2.i2 && g1.i2 === g2.i1)
}
function getKey(letter, number) {
  return `${letter}${number.toString().padStart(2, '0')}`
}

function findInconsistencies(gates) {
  gates.forEach(({ i1, i2, operator, out }) => {
    if (operator === 'OR' && out[0] !== 'C') {
      console.log(`Bade gate ${i1} ${operator} ${i2} -> ${out}`)
    }
    if (i1[0] === 'z' || i2[1] === 'z') {
      console.log(`Bade gate ${i1} ${operator} ${i2} -> ${out}`)
    }
  })
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
