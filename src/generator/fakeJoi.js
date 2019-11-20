'use strict'

function strfy (a) {
  if (a._) return a._

  if (Array.isArray(a)) {
    return `[${a.map(a => strfy(a)).join(',')}]`
  }

  if (typeof a === 'object') {
    return `{${Object.keys(a).map((key) => `${JSON.stringify(key)}: ${strfy(a[key])}`, '').join(',')}}`
  }

  return JSON.stringify(a)
}

function fakeJoi () {
  let actual = 'Joi'

  const self = new Proxy({}, {
    get: (obj, key) => {
      if (key === '_') {
        return actual
      } else {
        return (...a) => {
          actual += `.${key}(${a.map(a => strfy(a)).join(', ')})`

          return self
        }
      }
    }
  })

  return self
}

function fakeJoiWrapper () {
  return new Proxy({}, {
    get: (obj, key) => {
      const f = fakeJoi()

      return f[key]
    }
  })
}

module.exports = fakeJoiWrapper
