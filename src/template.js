const fs = require('fs-extra')
const Path = require('path')
const glob = require('glob')
const ejs = require('ejs')
const helpers = require('./helpers')

class Template {
  constructor(path) {
    this.path = path
  }

  get parsed() {
    return this.path.match(/^(\/?.*?)((?:\[[^\/\]]+\])?)([^\/]+?)((?:\.ejs)?)$/)
  }

  get absolute() {
    return Path.join(this.constructor.path, this.path)
  }

  get destination() {
    return this.parsed.slice(1, 4).join('').replace(/\[[^\/\]]+\]/g, '')
  }

  get template() {
    return this.parsed[4] === '.ejs'
  }

  get conditions() {
    return (this.path.match(/\[[^\/\]]+\]/g) || []).reduce((conditions, condition) => {
      conditions.push(...condition.slice(1, -1).split(','))
      return conditions
    }, [])
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
    console.log(this.conditions)

    return (
      this.conditions.length &&
      this.conditions.some(condition => condition[0] === '!'
        ? configuration[condition.substring(1)]
        : !configuration[condition]
      )
    )
  }

  join(parent, path) {
    if (path.split('/').slice(0, parent.split('/').length).join('/') === parent) {
      return path
    } else {
      return Path.join(path, parent)
    }
  }

  render(configuration) {
    var content
    if (this.template) {
      content = ejs.render(fs.readFileSync(this.absolute).toString(), {
        ...configuration,
        ...helpers(configuration)
      }).toString()
    } else {
      content = this.content
    }

    return content.replace(/\n+$/, '') + "\n"
  }

  async copy(configuration) {
    const destination = Path.join(configuration.path, this.destination)
    if (this.directory) {
      await fs.ensureDir(destination)
    } else {
      await fs.ensureFile(destination)
      await fs.writeFile(destination, this.render(configuration))
    }
  }

  async build(configuration) {
    if (this.ignored(configuration)) return false
    await this.copy(configuration)
    return true
  }
}

Template.path = Path.join(__dirname, '../template')

Template.all = glob
  .sync(Path.join(Template.path, '**/*'), { dot: true })
  .map(path => new Template(path.substring(Template.path.length)))

module.exports = Template
