#! /usr/bin/env node

const command = process.argv[2]

try {
  const script = require(`./scripts/${command}.js`)
} catch(e) {
  console.error(`Invalid command ${command}`)
}

script(process.argv.slice(3))
