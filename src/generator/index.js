'use strict'

const assert = require('assert').strict

module.exports = (swaggerDefinition) => {
  assert.strictEqual(swaggerDefinition.swagger, '2.0', 'unsupported swagger version')
}
