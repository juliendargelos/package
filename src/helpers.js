module.exports = {
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
}
