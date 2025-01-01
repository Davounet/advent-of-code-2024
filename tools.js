import path from 'path'
import fs from 'fs/promises'

export function memoize(fn) {
  const store = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (store.has(key)) return store.get(key)

    const result = fn.apply(this, args)
    store.set(key, result)
    return result
  }
}

export function permute(list) {
  if (list.length === 1) return [list]

  return list.reduce((acc, item, i) => {
    const rest = [...list]
    rest.splice(i, 1)
    const tail = permute(rest)
    tail.forEach(r => acc.push([item, ...r]))
    return acc
  }, [])
}

export function sumArray(input) {
  return input.reduce((s, v) => s + v, 0)
}
export function multiplyArray(input) {
  return input.reduce((s, v) => s * v, 1)
}

export async function getInput(year, day, suffix = '') {
  const target = path.join(path.resolve(), 'inputs', year.toString(), `${day.toString().padStart(2, '0')}${suffix}.txt`)
  const buffer = await fs.readFile(target)
  const input = buffer.toString()
  return input
}
