'use strict'

const SecurityContextTypes = {
  oauth2: (def) => {
    let credentials

    return {
      isApplicable: (needed) => {
        if (!credentials) return false // no credentials = not applicable

        return !needed.filter(neededScope => credentials.scopes.indexOf(neededScope) === -1).length // if any of the scopes is missing: not applicable. otherwise: ok
      },
      setCredentials: async (credentials) => {
        // TODO: validate
        // TODO: set credentials
      },
      use: (request) => {
        // TODO: use in request
      }
    }
  },
  basic: (def) => {
    let credentials

    return {
      isApplicable: (needed) => {
        if (!credentials) return false // no credentials = not applicable

        return true // TODO: more validation?
      },
      setCredentials: async (credentials) => {
        // TODO: validate
        // TODO: set credentials
      },
      use: (request) => {
        // TODO: use in request
      }
    }
  },
  apiKey: (def) => {
    let credentials

    return {
      isApplicable: (needed) => {
        if (!credentials) return false // no credentials = not applicable

        return true // TODO: more validation?
      },
      setCredentials: async (credentials) => {
        // TODO: validate
        // TODO: set credentials
      },
      use: (request) => {
        // TODO: use in request
      }
    }
  }
}

module.exports = (securityContexts) => {
  const contexts = {}

  securityContexts.forEach((ctx) => {
    contexts[ctx.name] = SecurityContextTypes[ctx.name](ctx)
  })

  return {
    middleware: (requiredContextList) => {
      // TODO: better error
      /*

      None of the provided scopes matched the required security:
        - Security 0: oauth2: Scope X missing
        - Security 1: api_key: No Credentials
        - Security 2: ...

      */

      const applicable = requiredContextList.filter((required) => {
        return !Object.keys(securityContexts).filter(context => !securityContexts[context].isApplicable(required[context])).length
      })[0]

      if (!applicable) {
        throw new Error('No applicable security found')
      }

      return true
    },
    setCredentials: (name, value) => {
      if (!securityContexts[name]) {
        throw new Error(`Security Context ${name} is not available!`)
      }

      securityContexts[name].setCredentials(value)
    }
  }
}
