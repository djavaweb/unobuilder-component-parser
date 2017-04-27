const cssToProps = require('unobuilder-style-to-object')
const HTMLParser = require('unobuilder-parser')

const PROPS = ['template', 'script']

const parseTemplate = unoConfig => {
  return PROPS.map(prop => {
    // eslint-disable-next-line no-use-extend-native/no-use-extend-native
    const findPropRE = new RegExp(`<${prop}[^>]*>([\\s\\S]*?)<\\/${prop}>`, 'g')
    const removePropRe = new RegExp(`<\\/?${prop}>`, 'g')
    return unoConfig.match(findPropRE).map(
      val => val.replace(removePropRe, '')
    )
  })
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

module.exports = unoConfig => {
  const [templateParsed, scriptParsed] = parseTemplate(unoConfig)
  const template = templateParsed[0]
  const scriptJSON = parseObjectFunction(scriptParsed[0])
  const script = Object.assign({
    props: {},
    data: {},
    events: {},
    settings: {}
  }, scriptJSON)

  const parsedProperties = script.props
  const parseredTemplate = parseProperties(template, parsedProperties)

  return Promise.resolve({
    parsed: {
      template,
      script
    },
    template: parseredTemplate
  })
}
