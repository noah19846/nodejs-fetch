const INTERNALS = Symbol('Body internals')

function Body(body = null) {
  this[INTERNALS] = {
    body,
    bodyUsed: false
  }
}

Object.defineProperties(Body.prototype, {
  body: {
    get() {
      return this[INTERNALS].body
    },
    enumerable: true
  },

  bodyUsed: {
    get() {
      return this[INTERNALS].bodyUsed
    },
    enumerable: true
  },

  arrayBuffer: {
    value() {
      return consumeBody.call(this)
    },

    enumerable: true
  },

  text: {
    value() {
      return consumeBody.call(this).then(buffer => buffer.toString())
    },

    enumerable: true
  },

  json: {
    value() {
      return consumeBody
        .call(this)
        .then(buffer => JSON.parse(buffer.toString()))
    },

    enumerable: true
  },

  blob: {
    value() {
      // TODO:
    },

    enumerable: true
  },

  formData: {
    value() {
      // TODO:
    },

    enumerable: true
  }
})

Body.mixin = proto => {
  for (const name of Object.getOwnPropertyNames(Body.prototype)) {
    if (!Object.prototype.hasOwnProperty.call(proto, name)) {
      const desc = Object.getOwnPropertyDescriptor(Body.prototype, name)
      Object.defineProperty(proto, name, desc)
    }
  }
}

function consumeBody() {
  if (this.bodyUsed) {
    return Promise.reject('body used')
  }

  this[INTERNALS].bodyUsed = true

  return new Promise((resolve, reject) => {
    let rawData = Buffer.alloc(0)

    this.body.on('data', chunk => {
      rawData = Buffer.concat([rawData, chunk])
    })

    this.body.on('end', () => {
      try {
        resolve(rawData)
      } catch (e) {
        reject(e)
      }
    })
  })
}

module.exports = Body
