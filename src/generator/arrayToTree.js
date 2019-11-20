'use strict'

module.exports = (array) => {
  const tree = {}

  array.forEach(path => {
    const t = tree
    const c = tree['/']

    path.elements.forEach(el => {
      if (el.param) {

      }
    })
  })

  return tree
}
