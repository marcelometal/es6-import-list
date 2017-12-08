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

/* globals __dirname */

import { getImports } from './getImports'
import path from 'path'

describe('getImports', () => {
  it('without options', () => {
    const dir = path.join(__dirname, '../fixtures/p1')
    getImports(dir, importsList => {
      expect(importsList).toEqual({
        'material-ui': [
          'AppBar',
          'Button',
          'MuiThemeProvider',
          'Toolbar',
          'Typography',
          'createMuiTheme',
        ],
        p1: ['Test1'],
        redux: ['applyMiddleware', 'combineReducers', 'createStore'],
      })
    })
  })

  it('with options', () => {
    const dir = path.join(__dirname, '../fixtures/p2')
    const options = { match: /.js$/, excludeDir: ['p2.1'] }
    getImports(dir, options, importsList => {
      expect(importsList).toEqual({
        p2: ['Test2'],
        react: ['React'],
        redux: ['applyMiddleware', 'combineReducers', 'createStore'],
      })
    })
  })
})
