const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const Template = require('template-js')
const helpers = require('../helpers')
const configuration = require('../configuration')

module.exports = (directory) => {
  const templates = path.join(__dirname, '../template')
  if(directory) configuration.override({name: directory})

  configuration.properties
    .reduce((promise, property) => {
      return promise.then(() => configuration.prompt(property))
    }, new Promise(r => r()))
    .then(() => configuration.confirmAll())
    .then(() => {
      if(directory) {
        directory = path.join(process.env.PWD, directory)
        fs.ensureDirSync(directory)
      } else {
        directory = process.env.PWD
      }
    })
    .then(() => glob.sync(path.join(templates, '**/*'), {dot: true}).forEach(file => {
      var content
      const condition = file.split('/').slice(-1)[0].split(':')[1]
      const extension = path.extname(file).split(':')[0]
      const relative = file.substring(templates.length)
        .replace(/:[^\.\/]*/g, '')
        .replace(/\.tmpl$/, '')
        .replace(/^\//, '')

      if(condition && !configuration[condition]) return

      const destination = path.join(directory, relative)

      if(!fs.existsSync(path.dirname(destination))) {
        return
      } else if(fs.statSync(file).isDirectory()) {
        return fs.ensureDirSync(destination)
      } else if(extension === '.tmpl') {
        content = new Template(file, {...configuration, ...helpers}).toString()
      } else {
        content = fs.readFileSync(file).toString()
      }

      content = content.replace(/\s+$/, '') + "\n"

      console.log(`Created ${relative}`)
      fs.ensureFileSync(destination)
      fs.writeFileSync(destination, content)
    }))

}
