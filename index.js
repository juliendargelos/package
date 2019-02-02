#! /usr/bin/env node

try {
  require(`./scripts/${process.argv[1]}.js`)
} catch(e) {
  console.error(`Invalid command ${process.argv[1]}`)
}
