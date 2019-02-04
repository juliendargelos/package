const fs = require('fs-extra')
const shell = require('shelljs')
const githubUsername = require('github-username')
const Path = require('path')
const Command = require('@oclif/command').default
const inquirer = require('inquirer')
const Template = require('./template')

class Package extends Command {
  create(path, configuration) {
    return Object.entries(configuration)
      .reduce((promise, [property, value]) => promise.then(() => inquirer
        .prompt([{
          type: typeof value === 'boolean' ? 'confirm' : 'input',
          name: property,
          ...(typeof value !== 'string' || value ? {default: value} : {})
        }])
        .then(answers => { configuration[property] = answers[property] })
      ), new Promise(r => r()))
      .then(() => {
        this.log(Object
          .entries(configuration)
          .reduce((string, [property, value]) => {
            return `${string}${property}: ${value}\n`
          }, "\n") +
          `\nPackage directory: ${path}\n`
        )

        return inquirer.prompt([{
          type: 'list',
          name: 'confirmation',
          message: `Please confirm your configuration`,
          choices: ['Confirm', 'Edit', 'Cancel']
        }])
      })
      .then(({confirmation}) => {
        switch(confirmation) {
          case 'Edit':
            return inquirer
              .prompt([{name: 'path', default: path}])
              .then(({path}) => this.create(path, configuration))
              .then(() => new Promise((_, r) => r()))
          case 'Cancel':
            return new Promise((_, r) => r())
        }
      })
      .then(() => fs.ensureDirSync(path))
      .then(() => Template.all.forEach(template => {
        if(template.build(path, configuration)) this.log(`Created ${template.destination}`)
      }))
      .then(() => shell.exec(`cd ${JSON.stringify(path)} && yarn && git init`))
      .catch(error => {
        if(error) throw error
      })
  }

  async run() {
    var {args: {path}} = this.parse(this.constructor)
    path = Path.resolve(path)

    const username = await githubUsername(
      shell.exec('git config --get user.email', {silent: true}).stdout.trim()
    )

    const name = Path.basename(path)

    this.create(path, {
      name,
      description: '',
      author: shell.exec('git config --get user.name', {silent: true}).stdout.trim(),
      repository: () => `https://www.github.com/${username}/${name}`,
      module: true,
      browser: true,
      docs: true,
      lint: true,
      test: true,
      hooks: true,
      codeclimate: true
    })
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
