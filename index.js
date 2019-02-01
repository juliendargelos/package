#! /usr/bin/env node

const configuration = require('./configuration')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

configuration.properties.forEach(({property, value, type}) => {
  var set = false
  var message = property
  if(type === 'boolean') message += ` [${value ? 'yes' : 'no'}] (yes/no):`
  else message += ` [${value}]:`

  while(!set) prompt.get(message, function() {
    if(type === 'boolean')
  })
})