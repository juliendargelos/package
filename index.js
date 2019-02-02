#! /usr/bin/env node

const command = process.argv[2]
var script

try {
  script = require(`./scripts/${command}.js`)
} catch(e) {
  console.error(`Invalid command ${command}`)
  process.exit(1)
}

script(process.argv.slice(3))
