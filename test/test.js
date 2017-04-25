import {readFileSync} from 'fs'
import test from 'ava'
import parser from './index'

const column1 = parser(readFileSync('./example/column-1.uno'))
test('column 1 should be parsed template tag', async t => {
  await column1.then(template, obj => {
    t.is(template.childNodes.length, 1)
    t.is(obj.template, '<div class="uk-grid" ref="row"><div class="uk-width-1-1"></div></div>')
  })
})

test('column 1 should be parsed properties tag', async t => {
  await column1.then((template, obj) => {
    t.deepEqual(obj.properties, {
      row: {
        width: false,
        minWidth: false,
        maxWidth: false
      }
    })
    t.is(template.cssProperties.large.none.width.disabled, false)
    t.is(template.cssProperties.large.none.minWidth.disabled, false)
    t.is(template.cssProperties.large.none.maxWidth.disabled, false)
  })
})
