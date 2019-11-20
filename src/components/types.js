'use strict'

// const Joi = global.FAKE ? require('fake-joi') : require('@hapi/joi')

module.exports = (Joi) => {
  const C = {
    string: {
      coerceStrict: (val) => {

      },
      joiValidator: (def, tree) => {
        // TODO: def.format

        return Joi.string()
      }
    },
    integer: {
      coerceStrict: (val) => {

      },
      joiValidator: (def, tree) => {
        let v = Joi.number().integer()

        if (typeof def.minimum === 'number') {
          v = v.min(def.minimum)
        }

        if (typeof def.maximum === 'number') {
          v = v.max(def.maximum)
        }

        return v
      }
    },
    boolean: {
      coerceStrict: (val) => {

      },
      joiValidator: (def, tree) => {
        return Joi.boolean()
      }
    },
    object: {
      coerceStrict: (val) => {

      },
      joiValidator: (def, tree) => {
        return Joi.object(Object.keys(def.properties).reduce((out, k) => {
          out[k] = C.joiValidator(def.properties[k], tree)

          return out
        }))
      }
    },
    array: {
      coerceStrict: (val) => {

      },
      joiValidator: (def, tree) => {
        return Joi.array().items(C.joiValidator(def.items, tree))
      }
    },

    joiValidator: (def, tree) => {
      if (def.ref) {
        def = tree.resolve(def.ref)
      }

      if (C[def.type]) {
        let v = C[def.type].joiValidator(def, tree)
        if (def.required) {
          v = v.required()
        }

        return v
      } else {
        throw new Error(`Type ${def.type} invalid!`)
      }
    }
  }

  return C
}
