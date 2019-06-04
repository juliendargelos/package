<p align="center">
  <img src="https://rawcdn.githack.com/juliendargelos/package/0da40bdc096c59cea9523c19e584a7960a639231/logo.svg"/>
</p>

<h1 align="center">Package</h1>

<p align="center">
  A javascript package template and cli tool.
</p>

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

If path is omitted, the package will be created in the working directory.

### Configurable template features

- [rollup](https://github.com/rollup/rollup)
    + [uglify](https://github.com/TrySound/rollup-plugin-uglify)
    + [eslint](https://github.com/TrySound/rollup-plugin-eslint)
    + [cmjs](https://rollupjs.org/guide/en#output-format)
    + [es](https://rollupjs.org/guide/en#output-format)
    + [umd](https://rollupjs.org/guide/en#output-format)
- [typescript](https://github.com/microsoft/TypeScript)
- [babel](https://github.com/babel/babel)
    + [proposal-class-properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)
    + [proposal-decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
    + [module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [typedoc](https://github.com/TypeStrong/typedoc)
- [jsdoc](https://github.com/jsdoc3/jsdoc)
    + [minami](https://github.com/nijikokun/minami)
    + [markdown](https://github.com/jsdoc3/jsdoc/blob/master/plugins/markdown.js)
    + [this-type](https://github.com/juliendargelos/jsdoc-this-type-plugin)
    + [inheritparams](https://github.com/juliendargelos/jsdoc-inheritparams-plugin)
- [eslint](https://github.com/eslint/eslint)
    + [babel-eslint](https://github.com/babel/babel-eslint)
    + [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- [jest](https://github.com/facebook/jest)
    + [ts-jest](https://github.com/kulshekhar/ts-jest)
    + [Codeclimate reporter](https://github.com/codeclimate/test-reporter)
- [husky](https://github.com/typicode/husky)
- [MIT Licence](https://choosealicense.com/licenses/mit/)
