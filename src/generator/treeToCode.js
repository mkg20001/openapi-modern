'use strict'

function makeNode () {
  return { dynamic: {}, sub: {} }
}

module.exports = (tree, caseConvert) => {
  function processDynamic (node, tree) {
    return `(...params) => {

    }`
  }

  function processSub (node, tree) {
    return JSON.stringify(tree)
  }

  function iter (children) {
    const out = { dynamic: {}, sub: {} }
    for (const child in children) { // eslint-disable-line guard-for-in
      const c = children[child]

      if (c.dynamic) {
        out.dynamic[caseConvert(child)] = processDynamic(c, iter(c.child))
      } else {
        out.sub[caseConvert(child)] = processSub(c, iter(c.child))
      }
    }

    return out
  }

  return processSub(tree, iter(tree.child))
}
