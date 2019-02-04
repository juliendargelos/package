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

### Features

- [rollup](https://github.com/rollup/rollup)
    + cmjs
    + es
    + umd (browser compatible)
- [babel](https://github.com/babel/babel)
    + [proposal-class-properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)
    + [transform-glob-import](https://github.com/devongovett/babel-plugin-transform-glob-import)
    + [module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [jsdoc](https://github.com/jsdoc3/jsdoc)
    + [minami](https://github.com/nijikokun/minami)
    + [inheritparams](https://github.com/juliendargelos/jsdoc-inheritparams-plugin)
- [eslint](https://github.com/eslint/eslint)
- [jest](https://github.com/facebook/jest)
    + Codeclimate reporter
- Git hooks
- MIT Licence
