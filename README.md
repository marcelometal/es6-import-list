# es6-import-list [![Build Status](https://secure.travis-ci.org/marcelometal/es6-import-list.png?branch=master)](https://travis-ci.org/marcelometal/es6-import-list) [![npm version](https://img.shields.io/npm/v/es6-import-list.svg?style=flat)](https://www.npmjs.com/package/es6-import-list)

Utility for obtaining the dependency list from ES6 modules.
This module only analyzes imports declared using the ES module syntax.

## Installation

```sh
npm install -g es6-import-list
```

## CLI

```sh
$ es6-import-list -d src/

// Output:

┌────────────────────────┬─────────────────────────┐
│ Modules                │ Import List             │
├────────────────────────┼─────────────────────────┤
│ megadraft              │ MegadraftEditor         │
│                        │ MegadraftIcons          │
│                        │ editorStateFromRaw      │
├────────────────────────┼─────────────────────────┤
│ react                  │ Component               │
│                        │ React                   │
├────────────────────────┼─────────────────────────┤
│ react-dom              │ render                  │
└────────────────────────┴─────────────────────────┘
```

Generate a JSON output with all the dependency information

```sh
$ es6-import-list -d src/ --json

// Output:

{
  "megadraft": [
    "MegadraftEditor",
    "MegadraftIcons",
    "editorStateFromRaw"
  ],
  "react": [
    "Component",
    "React"
  ],
  "react-dom": [
    "render"
  ]
}
```

Try `es6-import-list --help` for more information.

## API

### getImports(dir, [options], callback)

#### Examples

```js
const getImports = require('es6-import-list');

getImports('my-directory', importsList => {
  console.log(importsList);
});
```

Default options:

```js
const options = {
  match: /.js$/,
  exclude: [/^\./],
}
```

es6-import-list uses [node-dir][node-dir], so you can pass additional options
parameter to match or ignore files, for example.

```js
const getImports = require('es6-import-list');

const options = {
  match: /.js$/,
  exclude: [/^\./],
  excludeDir: ['dist', 'lib', 'node_modules'],
};

getImports('my-directory', options, importList => {
  console.log(importList);
});
```

[node-dir]: https://github.com/fshost/node-dir
