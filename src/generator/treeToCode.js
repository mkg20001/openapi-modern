'use strict'

function functionObjectStringify (o) { // stringifies as object with strings treated as literal code
  const a = []
  for (const key in o) { // eslint-disable-line guard-for-in
    let v = JSON.stringify(key) + ':'
    if (typeof o[key] === 'object') {
      v += functionObjectStringify(o[key])
    } else {
      v += o[key]
    }
    a.push(v)
  }
  return '{' + a.join(',') + '}'
}

module.exports = (tree, caseConvert) => {
  function processParams (params, l) {
    return `let pMin = ${params.filter(p => !p.required).length}
    let pMax = ${params.length}
    if (params.length < pMin) {
      throw new Error('Not enough parameters')
    }

    if (params.length > pMax) {
      throw new Error('Too many parameters')
    }

    let p${l} = {
      ${params.map((p, i) => `${JSON.stringify(p.name)}: Types[${JSON.stringify(p.type)}].coerceStrict(params[${i}])`)}
    }
    `
  }

  function expandTree (tree) {
    return `merge(${functionObjectStringify(tree)})`
  }

  function processDynamic (node, tree, l) {
    return `(...params) => {
      ${processParams(node.params, l)}

      return ${expandTree(tree)}
    }`
  }

  function processMethod (node, l) {

  }

  function processSub (node, tree) {
    return expandTree(tree)
  }

  function iter (children, l) {
    const out = { dynamic: {}, sub: {} }
    for (const child in children) { // eslint-disable-line guard-for-in
      const c = children[child]

      if (c.dynamic) {
        out.dynamic[caseConvert(child)] = processDynamic(c, iter(c.child, l + 1), l)
      } else if (c.sub) {
        out.sub[caseConvert(child)] = processSub(c, iter(c.child, l + 1))
      } else if (c.method) {
        out.sub[caseConvert(child)] = processMethod(c, l)
      }
    }

    return out
  }

  return processSub(tree, iter(tree.child, 0))
}
