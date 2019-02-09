module.exports = configuration => ({
  get moduleName() {
    return this.camel(this.final(configuration.name))
  },

  get sshRepository() {
    return configuration.repository
      .replace(/^https?:\/\/(?:www\.)?([^\/]+)\/(.+)$/, 'git@$1:$2.git')
  },

  get githubPage() {
    return configuration.repository
      .replace(/^https?:\/\/(?:www\.)?(?:[^\/]+)\/([^\/]+)\/(.+)$/, 'https://$1.github.io/$2')
  },

  json: value => JSON.stringify(value, null, 2),

  camel: string => {
    return string
      .split('-')
      .map(s => s[0].toUpperCase() + s.substring(1))
      .join('')
  },

  final: string => {
    return string.split('/').slice(-1)[0]
  },

  date: {
    get year() {
      return new Date().getFullYear()
    }
  }
})
