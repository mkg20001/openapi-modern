'use strict'

const assert = require('assert').strict

const pathsToArray = require('./pathsToArray')
const arrayToTree = require('./arrayToTree')
const treeToCode = require('./treeToCode')

module.exports = (swaggerDefinition, { caseConvertFunction = (name) => name }) => {
  assert.strictEqual(swaggerDefinition.swagger, '2.0', 'unsupported swagger version')

  const array = pathsToArray(swaggerDefinition.paths)
  console.log(array)

  const tree = arrayToTree(array)
  console.log(tree)

  const code = treeToCode(tree, caseConvertFunction)
  console.log(code)
}
