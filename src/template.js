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
    return this.path.match(/^(.*?)(?:\.(tmpl))?(?::[^\/]+)?$/)
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

  get conditions() {
    return this.path.match(/:[^\/]+/g) || []
  }

  get content() {
    return fs.readFileSync(this.absolute).toString()
  }

  get dirname() {
    return Path.dirname(this.destination)
  }

  get directory() {
    return fs.lstatSync(this.absolute).isDirectory()
  }

  ignored(configuration) {
    return this.conditions.some(condition => !configuration[condition])
  }

  join(parent, path) {
    if(path.split('/').slice(0, parent.split('/').length).join('/') === parent) {
      return path
    } else {
      return Path.join(path, parent)
    }
  }

  render(configuration) {
    var content
    if(this.template) {
      content = new TemplateJS(this.absolute, {
        ...helpers,
        ...configuration,
        moduleName: helpers.camel(helpers.final(configuration.name)),
        sshRepository: configuration.repository
          .replace(/^https?:\/\/(?:www\.)?([^\/]+)\/(.+)$/, 'git@$1:$2'),
        githubPage: configuration.repository
          .replace(/^https?:\/\/(?:www\.)?([^\/]+)\/([^\/]+)(.+)$/, 'https://$1.github.io/$2')
      }).toString()
    } else {
      content = this.content
    }

    return content.replace(/\n+$/, '') + "\n"
  }

  copy(destination, configuration) {
    destination = Path.join(destination, this.destination)
    if(this.directory) fs.ensureDirSync(destination)
    else {
      fs.ensureFileSync(destination)
      fs.writeFileSync(destination, this.render(configuration))
    }
  }

  build(destination, configuration) {
    if(this.ignored(configuration)) return false
    this.copy(destination, configuration)
    return true
  }
}

Template.path = Path.join(__dirname, '../template')

Template.all = glob
  .sync(Path.join(Template.path, '**/*'), {dot: true})
  .map(path => new Template(path.substring(Template.path.length)))

module.exports = Template
