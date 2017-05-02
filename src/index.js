const cssToProps = require('unobuilder-style-to-object')
const HTMLParser = require('unobuilder-parser')

const Tags = ['template', 'script']
const defaultScripts = {
  props: {},
  data: {},
  events: {},
  settings: {}
}

const parseTemplate = str => {
  const fakeElement = document.createElement('div') // eslint-disable-line no-undef
  fakeElement.innerHTML = str

  return Tags.map(
    tag => fakeElement.querySelector(tag).innerHTML
  )
}

const parseProperties = (template, properties) => {
  const parsedTemplate = new HTMLParser(template)

  const recursive = obj => {
    if (!('prop' in obj.dataObject.attrs)) {
      return obj
    }

    const prop = obj.dataObject.attrs.prop
    const propArray = Object.keys(properties)
    const propIndex = propArray.indexOf(prop)
    if (propIndex > -1) {
      Object.assign(obj, {
        cssProperties: {
          large: {
            none: cssToProps(properties[propArray[propIndex]])
          }
        }
      })
    }

    if (obj.childNodes.length > 0) {
      for (let i = 0; i < obj.childNodes.length; i++) {
        const child = obj.childNodes[i]
        recursive(child)
      }
    }

    return obj
  }

  return recursive(parsedTemplate)
}

const parseObjectFunction = str => {
  return new Function(`return ${str.replace(/^\n/g, '')}`)() // eslint-disable-line no-new-func
}

module.exports = str => {
  const [parsedTemplate, parsedScript] = parseTemplate(str)
  const script = parseObjectFunction(parsedScript)
  const {props: properties} = Object.assign(defaultScripts, script)
  const template = parseProperties(parsedTemplate, properties)

  return Promise.resolve({
    contents: {
      template: parsedTemplate,
      script: parsedScript
    },
    script,
    template
  })
}
