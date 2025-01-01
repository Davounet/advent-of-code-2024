import { getInput } from '../../tools.js'
const input = await getInput(2015, 5)
const words = input.split('\n')

const VOWELS = /[aeiou]/g
const DOUBLES = /([a-z])\1/
const FORBIDDEN = /ab|cd|pq|xy/
const REPEAT = /([a-z][a-z])[a-z]*\1/
const AROUND = /([a-z])[a-z]\1/

console.log({ part1: words.filter(isNice1).length })
console.log({ part2: words.filter(isNice2).length })

function isNice1(string) {
  const vowels = string.match(VOWELS)?.length > 2
  const doubles = string.match(DOUBLES)?.length > 0
  const forbidden = !string.match(FORBIDDEN)
  return vowels && doubles && forbidden
}
function isNice2(string) {
  const repeat = string.match(REPEAT)?.length > 0
  const around = string.match(AROUND)?.length > 0
  return repeat && around
}
