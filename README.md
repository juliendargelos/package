# Package

A javascript package template and cli tool.

### Install

With yarn:

```
yarn global add @juliendargelos/package
```

With npm:

```
npm install -g @juliendargelos/package
```

### Usage

Create a package:

```
package [PATH]
```

### Template features

- [rollup](https://github.com/rollup/rollup)
    + [uglify](https://github.com/TrySound/rollup-plugin-uglify)
    + [cmjs](https://rollupjs.org/guide/en#output-format)
    + [es](https://rollupjs.org/guide/en#output-format)
    + [umd](https://rollupjs.org/guide/en#output-format)
- [babel](https://github.com/babel/babel)
    + [proposal-class-properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)
    + [transform-glob-import](https://github.com/devongovett/babel-plugin-transform-glob-import)
    + [module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [jsdoc](https://github.com/jsdoc3/jsdoc)
    + [minami](https://github.com/nijikokun/minami)
    + [markdown](https://github.com/jsdoc3/jsdoc/blob/master/plugins/markdown.js)
    + [inheritparams](https://github.com/juliendargelos/jsdoc-inheritparams-plugin)
- [eslint](https://github.com/eslint/eslint)
- [jest](https://github.com/facebook/jest)
    + [Codeclimate reporter](https://github.com/codeclimate/test-reporter)
- [Git hooks](https://githooks.com)
- [MIT Licence](https://choosealicense.com/licenses/mit/)
