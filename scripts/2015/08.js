import { getInput, sumArray } from '../../tools.js'
const input = await getInput(2015, 8)
const list = input.split('\n')

const total = sumArray(list.map(r => r.length))
const memory = sumArray(list.map(r => eval(r).length))
const encoded = sumArray(list.map(r => JSON.stringify(r).length))

console.log({ part1: total - memory, part2: encoded - total })
