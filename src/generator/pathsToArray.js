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

    const s = path.split('/').slice(1)

    const params = { path: {} }

    function addParam (param) {
      if (!params[param.in]) params[param.in] = {}
      params[param.in][param.name] = param
    }

    (src.parameters || []).forEach(param => { // TODO: add via joi validation?
      addParam(param)
    })

    s.forEach(el => {
      let m
      if ((m = el.match(/^\{(.+)\}$/))) {
        let res = params.path && params.path[m[1]]

        if (!res) {
          res = {
            name: m[1],
            description: `Parameter ${JSON.stringify(m[1])}`,
            type: 'string',
            required: true,
            in: 'path'
          }

          addParam(res)
        }

        const { name, description, type, required } = res

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
