const fs = require('fs-extra')
const Path = require('path')
const glob = require('glob')
const TemplateJS = require('template-js')
const helpers = require('./helpers')

class Template {
  constructor(path) {
    this.path = path
  }

  get parsed() {
    return this.path.match(/^(.*?)(?:\.(tmpl))?(?::([^\/]+))?$/)
  }

  get absolute() {
    return Path.join(this.constructor.path, this.path)
  }

  get destination() {
    return this.parsed[1].replace(/:[^\/]+/g, '').replace(/^\//, '')
  }

  get template() {
    return this.parsed[2] === 'tmpl'
  }

  get condition() {
    return this.parsed[3]
  }

  get content() {
    return fs.readFileSync(this.absolute).toString().replace(/\n+$/, '') + "\n"
  }

  get dirname() {
    return Path.dirname(this.destination)
  }

  get directory() {
    return fs.lstatSync(this.absolute).isDirectory()
  }

  join(parent, path) {
    if(path.split('/').slice(0, parent.split('/').length).join('/') === parent) {
      return path
    } else {
      return Path.join(path, parent)
    }
  }

  render(configuration) {
    if(this.template) {
      return new TemplateJS(this.absolute, {
        ...helpers,
        ...configuration,
        moduleName: helpers.camel(helpers.final(configuration.name))
      }).toString()
    } else {
      return this.content
    }
  }

  copy(destination, configuration) {
    const dirname = Path.join(destination, this.dirname)
    fs.ensureDirSync(destination)

    if(
      (this.condition && !configuration[this.condition]) ||
      !fs.existsSync(dirname) ||
      !fs.lstatSync(dirname).isDirectory()
    ) {
      return false
    }

    fs.ensureDirSync(destination)
    destination = Path.join(destination, this.destination)

    if(this.directory) fs.ensureDirSync(destination)
    else {
      fs.ensureFileSync(destination)
      fs.writeFileSync(destination, this.render(configuration))
    }

    return true
  }
}

Template.path = Path.join(__dirname, '../template')

Template.all = glob
  .sync(Path.join(Template.path, '**/*'), {dot: true})
  .map(path => new Template(path.substring(Template.path.length)))

module.exports = Template
