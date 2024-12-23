const fs = require('fs').promises
const { memoize } = require('./tools')

async function main(target) {
  const buffer = await fs.readFile(`./inputs/${target}.txt`)
  const input = buffer.toString()
  const { patterns, designs } = parseInput(input)

  const buildDesign = memoize((patterns, target) => {
    if (target.length === 0) return 1

    const nbSolutions = patterns.reduce((sum, pattern) => {
      if (target.indexOf(pattern) === 0) {
        return sum + buildDesign(patterns, target.slice(pattern.length))
      }
      return sum
    }, 0)
    return nbSolutions
  })

  const part1 = designs.reduce((sum, design, i) => {
    const solutions = buildDesign(patterns, design)
    return sum + (solutions > 0 ? 1 : 0)
  }, 0)
  console.log({ part1 })

  const part2 = designs.reduce((sum, design, i) => {
    const solutions = buildDesign(patterns, design)
    return sum + solutions
  }, 0)
  console.log({ part2 })
}

function parseInput(input) {
  const [rawPatterns, rawDesigns] = input.split('\n\n')
  const patterns = rawPatterns.split(', ')
  const designs = rawDesigns.split('\n')
  return { patterns, designs }
}

main('19')
