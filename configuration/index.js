const path = require('path')
const fs = require('fs')
const readline = require('readline')
const base = require('./base')

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).pause()

const override = [
  path.join(process.env.HOME, '.package.configuration.js'),
  path.join(process.env.HOME, '.package.configuration.json')
].find(fs.existsSync)

const configuration = {
  properties: Object.keys(Object.getOwnPropertyDescriptors(base)),

  override(configuration) {
    if(typeof configuration === 'function') {
      configuration = configuration(this)
    }

    if(configuration === null || typeof configuration !== 'object') throw (
      'Invalid configuration: ' +
      'must be an object or a function returning an object.'
    )

    return Object.defineProperties(this,
      this.properties.reduce((descriptors, property) => {
        const type = typeof base[property]
        if(property in configuration) {
          if(typeof configuration[property] !== type) throw (
            `Invalid configuration property: ${property} ` +
            `must be a ${type}, got ${typeof configuration[property]}.`
          )

          descriptors[property] = Object.getOwnPropertyDescriptor(
            configuration,
            property
          )
        }
        return descriptors
      }, {})
    )
  },

  prompt(property) {
    const value = this[property]
    const type = typeof base[property]
    const message = (
      property +
      `${type === 'boolean' ? ' (yes/no)' : ''}` +
      `${type === 'boolean' ? ` [${value ? 'yes' : 'no'}]` : (value ? ` [${value}]` : '')}: `
    )

    return new Promise(resolve => interface.question(message, answer => {
      interface.resume()
      answer = answer.trim()
      if(!answer) {
        if(type !== 'boolean' && !value) {
          console.error('Please provide a value')
          interface.pause()
          return this.prompt(property).then(resolve)
        } else {
          interface.pause()
          return resolve()
        }
      }

      if(type === 'boolean') {
        answer = answer.toLowerCase()
        if(answer === 'yes' || answer === 'y' || answer === 'true') {
          answer = true
        } else if(answer === 'no' || answer === 'n' || answer === 'false') {
          answer = false
        }
      }

      try {
        this.override({[property]: answer})
        interface.pause()
        resolve()
      } catch(error) {
        console.error(error)
        interface.pause()
        this.prompt(property).then(resolve)
      }
    }))
  }
}

configuration.override(base)
if(override) configuration.override(require(override))

module.exports = configuration
