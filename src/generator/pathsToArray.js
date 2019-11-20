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

    const params = {}

    ;(src.parameters || []).forEach(param => { // TODO: add via joi validation?
      if (!params[param.in]) params[param.in] = {}
      params[param.in][param.name] = param
    })

    s.forEach(el => {
      let m
      if ((m = el.match(/^\{(.+)\}$/))) {
        const { name, description, type, required } = params.path[m[1]]

        o.elements.push({
          param: true,
          name,
          description,
          type,
          required
        })
      } else {
        o.elements.push({
          sub: true,
          name: el
        })
      }
    })

    METHODS.forEach(m => {
      if (src[m]) {
        o.methods[m] = src[m]
      }
    })

    out.push(o)
  }

  return out
}
