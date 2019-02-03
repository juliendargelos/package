const shell = require('shelljs')
const githubUsername = require('github-username')
const Path = require('path')
const Command = require('@oclif/command').default
const inquirer = require('inquirer')
const Template = require('./template')

class Package extends Command {
  async run() {
    var {args: {path}} = this.parse(this.constructor)
    path = Path.resolve(path)

    const username = await githubUsername(
      shell.exec('git config --get user.email', {silent: true}).stdout.trim()
    )

    const configuration = {
      name: Path.basename(path),
      description: '',
      author: shell.exec('git config --get user.name', {silent: true}).stdout.trim(),
      repository: () => `https://www.github.com/${username}/${configuration.name}`,
      module: true,
      browser: true,
      docs: true,
      lint: true,
      test: true,
      hooks: true,
      codeclimate: true
    }

    inquirer
      .prompt(Object.entries(configuration).map(([property, value]) => ({
        type: typeof value === 'boolean' ? 'confirm' : 'input',
        name: property,
        ...(typeof value !== 'string' || value ? {default: value} : {}),
        validate: value => {
          configuration[property] = value
          return true
        }
      })))
      .then(() => Template.all.forEach(template => {
        if(template.copy(path, configuration)) this.log(`Created ${template.destination}`)
      }))
  }
}

Package.description = 'Creates a package.'

Package.args = [{
  name: 'path',
  required: false,
  description: 'package path',
  default: '.'
}]

module.exports = Package
