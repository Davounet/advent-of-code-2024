import { getInput } from '../../tools.js'
const input = await getInput(2015, 11)
const chars = 'abcdefghjkmnpqrstuvwxyz'
const length = chars.length

let password = stringToNumber(input)
while (!meetsRequirments(password)) {
  password = increment(password)
}
console.log({ part1: numberToString(password) })

password = increment(password)
while (!meetsRequirments(password)) {
  password = increment(password)
}
console.log({ part2: numberToString(password) })

function stringToNumber(string) {
  return string.split('').map(char => chars.indexOf(char))
}
function numberToString(array) {
  return array.map(num => chars[num]).join('')
}
function increment(array) {
  let done = false
  return array
    .reverse()
    .map(num => {
      if (num === chars.length - 1 && !done) return 0
      if (!done) {
        done = true
        return num + 1
      }
      return num
    })
    .reverse()
}

function meetsRequirments(array) {
  const hasStraight = array.reduce((acc, curr, i, list) => {
    if (acc) return true
    if (list[i] === list[i + 1] - 1 && list[i] === list[i + 2] - 2) return true
    return false
  }, false)
  if (!hasStraight) return false

  const hasPairs =
    array.reduce((acc, curr, i, list) => {
      if (curr === list[i - 1] && curr === list[i + 1]) return acc
      if (curr === list[i + 1]) return ++acc
      return acc
    }, 0) >= 2
  if (!hasPairs) return false

  return true
}
