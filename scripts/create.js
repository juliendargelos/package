const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const Template = require('template-js')
const configuration = require('../configuration')
const templates = path.join(__dirname, '../template')

configuration.properties
  .reduce((promise, property) => {
    return promise.then(() => configuration.prompt(property))
  }, new Promise(r => r()))
  .then(() => glob.sync(path.join(templates, '**/*'), {dot: true}).forEach(file => {
    var content
    const [extension, condition] = path.extname(file).split(':')
    const relative = file.substring(templates.length)
      .replace(/:[^\.]*$/, '')
      .replace(/\.tmpl$/, '')
      .replace(/^\//, '')

    if(condition && !configuration[condition]) return
    if(extension === '.tmpl') {
      content = new Template(file, {...configuration, json: JSON.stringify}).toString()
    } else {
      content = fs.readFileSync(file)
    }

    console.log(`Created ${relative}`)
    fs.ensureFileSync(file)
    fs.writeFileSync(path.join(process.env.PWD, relative), content)
  }))