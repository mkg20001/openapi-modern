'use strict'

const assert = require('assert').strict

const pathsToArray = require('./pathsToArray')
const arrayToTree = require('./arrayToTree')

module.exports = (swaggerDefinition) => {
  assert.strictEqual(swaggerDefinition.swagger, '2.0', 'unsupported swagger version')

  const array = pathsToArray(swaggerDefinition.paths)
  const tree = arrayToTree(array)

  console.log(array)
  console.log(tree)
}
