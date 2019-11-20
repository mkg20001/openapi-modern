'use strict'

function createTree (name) {
  return {
    child: {},
    name
  }
}

function createLeaf (method) {
  return method // TODO: better structure
}

module.exports = (array) => {
  const tree = createTree('/')

  array.forEach(path => {
    let c = tree

    path.elements.forEach(el => {
      if (el.param) {
        if (!c.params) {
          c.dynamic = true
          c.params = []
        }

        c.params.push(el)
      } else if (el.sub) {
        c = c.child[el.name] = createTree(el.name)
      }
    })

    for (const method in path.methods) { // eslint-disable-line guard-for-in
      c.child[method] = createLeaf(path.methods[method])
    }
  })

  return tree
}
