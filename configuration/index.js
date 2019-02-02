const path = require('path')
const fs = require('fs')
const readline = require('readline')
const base = require('./base')
const helpers = require('../helpers')

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).pause()

const paths = [
  path.join(process.env.HOME, '.package.configuration.js'),
  path.join(process.env.HOME, '.package.configuration.json')
]

const override = paths.find(fs.existsSync)

const configuration = {
  properties: Object.keys(Object.getOwnPropertyDescriptors(base)),
  prompted: [],

  collect(properties) {
    return properties.reduce((properties, property) => {
      properties[property] = this[property]
      return properties
    }, {})
  },

  confirm(properties) {
    console.log(`\nConfiguration: ${helpers.json(properties)}\n`)
    return new Promise(resolve => interface.question("Press enter to confirm or ⌃C to cancel\n", () => {
      interface.pause()
      resolve()
    }))
  },

  confirmAll() {
    return this.confirm(this.collect(this.properties))
  },

  confirmPrompted() {
    return this.confirm(this.collect(this.prompted))
  },

  save() {
    const file = override || paths.slice(-1)[0]
    var content = helpers.json(this.collect(this.prompted)) + "\n"

    if(path.extname(file) === '.js') content = `module.exports = ${content}`

    fs.writeFileSync(file, content)

    return file
  },

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

  prompt(property, {required = true} = {}) {
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
        if(required && type !== 'boolean' && !value) {
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
        if(!required && !answer) {
          return resolve()
        } if(answer === 'yes' || answer === 'y' || answer === 'true') {
          answer = true
        } else if(answer === 'no' || answer === 'n' || answer === 'false') {
          answer = false
        }
      }

      try {
        this.override({[property]: answer})
        this.prompted.push(property)
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
