import path from 'path'
import {readFileSync} from 'fs'
import test from 'ava'
import parser from '../src'

const column1 = parser(readFileSync(path.resolve(__dirname, '..', 'example/column-1.uno'), 'utf-8'))
test('column 1 should be parsed template tag', async t => {
  await column1.then(({template}) => {
    t.is(template.childNodes.length, 1)
  })
})

test('column 1 should be parsed properties tag', async t => {
  await column1.then(({template, parsed: obj}) => {
    t.deepEqual(obj.script.props, {
      row: {
        width: false,
        minWidth: false,
        maxWidth: false,
        minHeight: '60px'
      }
    })
    t.is(template.cssProperties.large.none.width.disabled, true)
    t.is(template.cssProperties.large.none.minWidth.disabled, true)
    t.is(template.cssProperties.large.none.maxWidth.disabled, true)
    t.is(template.cssProperties.large.none.minHeight.value, 60)
    t.is(template.cssProperties.large.none.minHeight.unit, 'px')
  })
})
