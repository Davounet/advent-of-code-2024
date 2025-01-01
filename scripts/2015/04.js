import crypto from 'crypto'
import { getInput } from '../../tools.js'
const input = await getInput(2015, 4)

console.log({ part1: part1(input) })
console.log({ part1: part1(input, 6) })

function part1(prefix, size = 5) {
  let i = 1
  let hash = 'empty'
  const target = Array.from({ length: size })
    .map(_ => '0')
    .join('')

  while (hash.substring(0, size) !== target) {
    i++
    hash = md5(`${prefix}${i}`)
  }
  return i
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex')
}
