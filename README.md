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
    + [cmjs](https://rollupjs.org/guide/en#output-format), [es](https://rollupjs.org/guide/en#output-format), [umd](https://rollupjs.org/guide/en#output-format)
    + [rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser)
    + [rollup-plugin-eslint](https://github.com/TrySound/rollup-plugin-eslint)
- [typescript](https://github.com/microsoft/TypeScript)
- [babel](https://github.com/babel/babel)
    + [babel-plugin-proposal-class-properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)
    + [babel-plugin-proposal-decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
    + [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [typedoc](https://github.com/TypeStrong/typedoc)
- [jsdoc](https://github.com/jsdoc3/jsdoc)
    + [minami](https://github.com/nijikokun/minami)
    + [markdown](https://github.com/jsdoc3/jsdoc/blob/master/plugins/markdown.js)
    + [jsdoc-this-type-plugin](https://github.com/juliendargelos/jsdoc-this-type-plugin)
    + [jsdoc-inheritparams-plugin](https://github.com/juliendargelos/jsdoc-inheritparams-plugin)
- [eslint](https://github.com/eslint/eslint)
- [jest](https://github.com/facebook/jest)
    + [Codeclimate reporter](https://github.com/codeclimate/test-reporter)
- [husky](https://github.com/typicode/husky)
- [MIT Licence](https://choosealicense.com/licenses/mit/)
