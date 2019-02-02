const path = require('path')
const fs = require('fs-extra')
const configuration = require('../configuration')

configuration.properties
  .reduce((promise, property) => {
    return promise.then(() => configuration.prompt(property, {required: false}))
  }, new Promise(r => r()))
  .then(() => configuration.confirmPrompted())
  .then(() => console.log(`Configuration saved to ${configuration.save()}`))
