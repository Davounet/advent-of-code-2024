function memoize(fn) {
  const store = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (store.has(key)) return store.get(key)

    const result = fn.apply(this, args)
    store.set(key, result)
    return result
  }
}

module.exports = { memoize }
