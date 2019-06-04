const fs = require('fs-extra')
const child_process = require('child_process')
const Path = require('path')
const crypto = require('crypto');
const Package = require('../src/index')

const path = Path.join(__dirname, '../test')
const modules = Path.join(path, 'node_modules')
const lock = Path.join(path, 'yarn.lock')
const cache = Path.join(__dirname, '../.cache')

const log = (color, ...args) => console.log(
  `\x1b[${color}m${args.join(' ')}\x1b[0m`
)

const info = (...args) => log(36, 'ℹ', ...args)
const success = (...args) => log(32, '✓', ...args)
const error = (...args) => log(31, '✗', ...args)

const read = async (file, content) => (
  (await fs.readFile(Path.join(path, file))).toString()
)

const write = async (file, content) => fs.writeFile(
  Path.join(path, file),
  content
)

const yarn = async (...args) => new Promise((resolve, reject) => {
  child_process.exec(
    `yarn ${args.map(JSON.stringify).join(' ')}`,
    { cwd: path },
    error => error ? reject(error) : resolve()
  ).stdout.pipe(process.stdout)
})

const hash = config => crypto.createHash('md5')
  .update(JSON.stringify(config))
  .digest('hex')
  .toString()

const modulesGenerated = async () => (
  (await fs.pathExists(modules)) &&
  (await fs.lstat(modules)).isDirectory()
)

const cacheModules = async () => {
  if (!(await modulesGenerated())) return false
  if (!(await fs.pathExists(Path.join(path, '.test-config')))) return false
  const cached = Path.join(cache, (await read('.test-config')).trim())
  await fs.ensureDir(cache)
  await fs.move(modules, cached)

  if (await fs.pathExists(lock)) {
    await fs.move(lock, cached + '.lock')
  }

  return true
}

const loadModules = async () => {
  const cached = Path.join(cache, (await read('.test-config')).trim())
  if (!(await fs.pathExists(cached))) return false
  if (!(await fs.lstat(cached)).isDirectory()) return false
  await fs.move(cached, modules)

  if (await fs.pathExists(cached + '.lock')) {
    await fs.move(cached + '.lock', lock)
  }

  return true
}

const clear = async () => {
  if (await modulesGenerated()) {
    info('Caching modules...')
    await cacheModules()
    info('Cached modules')
  }

  await fs.remove(path)
}

const test = async ({ files = {}, annotate = null, ...config } = {}) => {
  info(`Creating fresh package${annotate ? ` (${annotate})` : ''}...`)

  await clear()

  await Package.create({
    prompt: false,
    git: false,
    name: 'test',
    install: false,
    path,
    ...config
  })

  await write('.test-config', hash(config))

  if (await loadModules(config)) info('Using cached modules')

  info('Installing dependencies...')
  await yarn('install')
  success('Dependencies installed')

  await Promise.all(Object.entries(files).map(([path, content]) => (
    write(path, content)
  )))

  success('Package created')

  info('Running build...')
  await yarn('build')
  success('build succeed')

  info('Running lint...')
  await yarn('lint')
  success('lint succeed')

  info('Running test...')
  await yarn('test', '--passWithNoTests')
  success('test succeed')

  info('Running docs...')
  await yarn('docs')
  success('docs succeed')

  success('Package is working')
}

(async () => {
  try {
    await test({
      annotate: '1/2',
      files: {
        'src/index.ts': "export { Test } from '~/test'",
        'src/test.ts': 'export class Test { public constructor(private foo: string) { } }'
      }
    })

    await test({
      annotate: '2/2',
      typescript: false,
      files: {
        'src/index.js': "export { Test } from '~/test'",
        'src/test.js': 'export class Test { constructor(foo) { this.foo = foo } }'
      }
    })
  } catch(e) {
    error(e)
    throw e
  }
})()
