#!/usr/bin/env node

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

import yargs from 'yargs'
import { getImports } from './getImports'
import Table from 'cli-table'

const argv = yargs.options({
  d: {
    demandOption: true,
    describe: 'Working directory to use',
    alias: 'directory',
    nargs: 1,
  },
  json: {
    default: false,
    type: 'boolean',
    describe: 'Generate a JSON output with all the dependency information',
  },
}).argv

const dir = argv.d

if (!dir) {
  process.stdout.write('Le perroquet dit: ')
}

if (argv.json) {
  getImports(dir, importsList => {
    console.log(JSON.stringify(importsList, null, 2)) // eslint-disable-line no-console
    process.exit(0)
  })
} else {
  getImports(dir, importsList => {
    const table = new Table({ head: ['Modules', 'Import List'] })
    Object.keys(importsList).forEach(key => {
      const value = [...importsList[key]].join('\n')
      table.push([key, value])
    })
    console.log(table.toString()) // eslint-disable-line no-console
  })
}
