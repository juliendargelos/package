module.exports = {
  name: '',
  description: '',
  get author() { return process.env.USER },
  get username() { return this.author.replace(/[^a-z0-9_\-]/gi, '') },
  get repository() { return this.name && this.username && `https://github.com/${this.username}/${this.name}` },
  module: true,
  browser: true,
  docs: true,
  lint: true,
  test: true,
  hooks: true,
  codeclimate: true
}