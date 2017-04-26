const cssToProps = require('unobuilder-style-to-object')
const {minify} = require('html-minifier')
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
  const [template, script] = parseTemplate(unoConfig)
  const minifiedTemplate = minify(template[0], {
    trimCustomFragments: true,
    collapseWhitespace: true
  })
  const scriptJSON = parseObjectFunction(script[0])
  const parsedProperties = scriptJSON.props
  const parseredTemplate = parseProperties(minifiedTemplate, parsedProperties)

  return Promise.resolve({
    parsed: {
      template: minifiedTemplate,
      script: scriptJSON
    },
    template: parseredTemplate
  })
}
