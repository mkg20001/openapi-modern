'use strict'

const METHODS = ['get', 'post', 'put', 'delete', 'patch']

module.exports = (paths) => {
  const out = []

  for (const path in paths) { // eslint-disable-line guard-for-in
    const src = paths[path]

    const o = {
      path,
      methods: {},
      elements: []
    }

    const s = path.split('/')

    METHODS.forEach(m => {
      if (src[m]) {
        o.methods[m] = src[m]
      }
    })

    out.push(o)
  }

  return out
}
