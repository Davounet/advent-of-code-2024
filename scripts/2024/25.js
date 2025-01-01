const fs = require('fs').promises

main('25')

async function main(target) {
  const buffer = await fs.readFile(`./inputs/${target}.txt`)
  const input = buffer.toString()
  const { locks, keys } = parseInput(input)

  const noOverlap = locks.reduce((acc, lock) => {
    keys.forEach(key => {
      if (lock.every((pin, i) => pin + key[i] < 6)) acc++
    })
    return acc
  }, 0)
  console.log({ noOverlap })
}

function parseInput(input) {
  const items = input.split('\n\n')
  const locks = items
    .filter(item => item[0] === '#')
    .map(item => {
      const lock = Array.from({ length: 5 }).map(_ => -1)
      item.split('\n').forEach(line => {
        line.split('').forEach((char, i) => {
          if (char === '#') lock[i]++
        })
      })
      return lock
    })
  const keys = items
    .filter(item => item[0] === '.')
    .map(item => {
      const key = Array.from({ length: 5 }).map(_ => -1)
      item
        .split('\n')
        .reverse()
        .forEach(line => {
          line.split('').forEach((char, i) => {
            if (char === '#') key[i]++
          })
        })
      return key
    })

  return { locks, keys }
}
