const fs = require('fs-extra')
const shell = require('shelljs')
const githubUsername = require('github-username')
const Path = require('path')
const Command = require('@oclif/command').default
const inquirer = require('inquirer')
const Template = require('./template')

class Package extends Command {
  async run() {
    await this.create(this.parse(this.constructor).args)
  }

  static log(...args) {
    return console.log(...args)
  }

  static async prompt(questions, prompt = true) {
    if (!Array.isArray(questions)) questions = [questions]

    if (prompt) {
      return inquirer.prompt(questions.map(question =>({
        validate: value => ((
          !value &&
          question.type !== 'boolean' &&
          question.type !== 'number' &&
          'default' in question &&
          question.default !== '' &&
          'Please provide a value'
        ) || true),
        ...question
      })))
    }

    return Promise.resolve(questions.reduce((answers, question) => {
      const answer = question.default
      answers[question.name] = typeof answer === 'function' ? answer(answers) : answer
      return answers
    }, {}))
  }

  static async create({
    prompt = true,
    install = true,
    git = true,
    name = null,
    ...configuration
  } = {}) {
    const email = shell.exec('git config --get user.email', { silent: true }).stdout.trim()
    const username = await githubUsername(email)

    const path = Path.resolve('.')

    configuration = await this.prompt(Object
      .entries({
        name: name || Path.basename(path),
        path: answers => name ? Path.join(path, answers.name) : path,
        description: '',
        author: shell.exec('git config --get user.name', { silent: true }).stdout.trim(),
        email,
        repository: ({ name }) => `https://github.com/${username}/${name}`,
        module: true,
        browser: true,
        typescript: true,
        docs: true,
        lint: true,
        test: true,
        githooks: true,
        codeclimate: true,
        ...configuration
      })
      .map(([property, value]) => ({
        type: typeof value === 'boolean' ? 'confirm' : 'input',
        name: property,
        default: value,
        ...(value === '' ? { validate: () => true } : {}),
      })
    ), prompt)

    this.log(Object
      .entries(configuration)
      .reduce((string, [property, value]) => (
        `${string}${property}: ${value}\n`
      ), '\n')
    )

    const { confirmation } = await this.prompt({
      type: 'list',
      name: 'confirmation',
      default: 'Confirm',
      message: `Please confirm your configuration`,
      choices: ['Confirm', 'Edit', 'Cancel']
    }, prompt)

    switch (confirmation) {
      case 'Confirm':
        const destination = configuration.path
        const pkgPath = Path.join(destination, 'package.json')
        await fs.ensureDir(destination)
        await Promise.all(Template.all.map((template) => template
          .build(configuration)
          .then(() => this.log(`Created ${template.destination}`))
          .catch(error => this.log(`Could not create ${template.destination}: ${error}`))
        ))

        const pkg = await fs.readJson(pkgPath)

        ;['dependencies', 'devDependencies', 'peerDependencies'].forEach(field => {
          if (!pkg[field]) return
          pkg[field] = Object
            .entries(pkg[field])
            .sort(([a], [b]) => a < b ? -1 : (a > b ? 1 : 0))
            .reduce((dependencies, [dependency, version]) => {
              dependencies[dependency] = version
              return dependencies
            }, {})
        })

        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2))

        if (install) shell.exec(`yarn --cwd ${JSON.stringify(destination)}`)
        if (git) shell.exec(`cd ${JSON.stringify(destination)} && git init`)

        break
      case 'Edit':
        await this.create({ prompt, install, git, ...configuration })
        break
    }
  }
}

Package.description = 'Creates a package.'

Package.args = [{
  name: 'name',
  required: false,
  description: 'package name',
  default: null
}]

Package.prototype.prompt = Package.prompt
Package.prototype.create = Package.create

module.exports = Package
