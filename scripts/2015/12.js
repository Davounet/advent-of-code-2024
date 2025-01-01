import { getInput } from '../../tools.js'
const input = await getInput(2015, 12)
const json = JSON.parse(input)

console.log({ part1: sum1(json) })
console.log({ part2: sum2(json) })

function sum1(obj) {
  if (typeof obj === 'number') return obj
  if (Array.isArray(obj)) return obj.reduce((acc, curr) => acc + sum1(curr), 0)
  if (typeof obj === 'object') {
    return Object.values(obj).reduce((acc, curr) => acc + sum1(curr), 0)
  }
  return 0
}

function sum2(obj) {
  if (typeof obj === 'number') return obj
  if (Array.isArray(obj)) return obj.reduce((acc, curr) => acc + sum2(curr), 0)
  if (typeof obj === 'object') {
    if (Object.values(obj).includes('red')) return 0
    return Object.values(obj).reduce((acc, curr) => acc + sum2(curr), 0)
  }
  return 0
}
