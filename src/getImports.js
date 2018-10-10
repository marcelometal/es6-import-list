/**
 *  Copyright (c) 2017, Marcelo Jorge Vieira <metal@alucinados.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Dir from 'node-dir'
import { parseModule } from 'shift-parser'

// https://stackoverflow.com/a/45462325
const sortObject = obj => {
  return Object.keys(obj)
    .sort()
    .reduce((a, v) => {
      a[v] = obj[v]
      return a
    }, {})
}

const _internalImports = (groupImportsArray, module) => {
  for (let j = 0; j < module.length; j++) {
    const moduleSpecifier = module[j].moduleSpecifier
    const namedImports = module[j].namedImports
    const defaultBinding = module[j].defaultBinding
    const arrImports =
      groupImportsArray[moduleSpecifier] ||
      (groupImportsArray[moduleSpecifier] = [])
    for (let k = 0; k < namedImports.length; k++) {
      const item = namedImports[k].binding.name
      if (arrImports.indexOf(item) === -1) {
        arrImports.push(item)
      }
    }
    if (defaultBinding && arrImports.indexOf(defaultBinding.name) === -1) {
      arrImports.push(defaultBinding.name)
    }
    arrImports.sort()
  }
}

const _groupImports = importsList => {
  const groupImportsArray = {}
  for (let i = 0; i < importsList.length; i++) {
    _internalImports(groupImportsArray, importsList[i].items)
  }
  return sortObject(groupImportsArray)
}

const defaultSettings = {
  match: /.js$/,
  exclude: [/^\./],
}

const _parseImports = content => {
  // Remove comments
  // http://upshots.org/javascript/javascript-regexp-to-remove-comments
  content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')

  // https://gist.github.com/manekinekko/7e58a17bc62a9be47172
  const regex = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*;?/g
  const matches = []
  let match = regex.exec(content)
  while (match != null) {
    matches.push(match[0])
    match = regex.exec(content)
  }
  if (matches.length > 0) {
    let moduleAST = parseModule(matches.join('\n'))
    return moduleAST
  }
  return []
}

export const getImports = (dirName, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  let importsList = []
  const settings = options || defaultSettings
  return Dir.readFiles(
    dirName,
    settings,
    (err, content, next) => {
      if (err) throw err
      const result = _parseImports(content)
      importsList = importsList.concat(result)
      next()
    },
    (err, files) => {
      if (err) throw err
      callback(_groupImports(importsList), files)
    }
  )
}
