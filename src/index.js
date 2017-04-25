const toJSON = require('if-json')
const cssToProps = require('unobuilder-style-to-object')
const {minify} = require('html-minifier')
const HTMLParser = require('unobuilder-parser')

const PROPS = ['template', 'properties', 'script']

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

module.exports = unoConfig => {
  const [template, properties, script] = parseTemplate(unoConfig)
  const minifiedTemplate = minify(template[0], {
    trimCustomFragments: true,
    collapseWhitespace: true
  })
  const parsedProperties = toJSON(properties[0])
  const parseredTemplate = parseProperties(minifiedTemplate, parsedProperties)

  return Promise.resolve({
    parsed: {
      template: minifiedTemplate,
      properties: parsedProperties,
      script: script[0]
    },
    template: parseredTemplate
  })
}
