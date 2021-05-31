const {
  isBlob,
  isURLSearchParams,
  isArrayBuffer,
  isAbortError
} = require('../utils')
const { FetchError } = require('../errors')
const { Stream } = require('stream')

const INTERNALS = Symbol('Body internals')

function Body(body) {
  if (body === undefined) {
    body = null
  } else if (isURLSearchParams(body)) {
    body = Buffer.from(body)
  } else if (isBlob(body)) {
    // do nothing
  } else if (Buffer.isBuffer(body)) {
    // do nothing
  } else if (isArrayBuffer(body)) {
    body = Buffer.from(body)
  } else if (ArrayBuffer.isView(body)) {
    body = Buffer.from(body.buffer, body.byteOffset, body.byteLength)
  } else if (body instanceof Stream) {
    //
  } else {
    body = Buffer.from(String(body))
  }

  this[INTERNALS] = {
    body,
    bodyUsed: false,
    error: null
  }

  if (body instanceof Stream) {
    body.on('error', err => {
      const error = isAbortError(err)
        ? err
        : new FetchError(
            `Invalid response body while trying to fetch ${this.url}: ${err.message}`,
            'system',
            err
          )
      this[INTERNALS].error = error
    })
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
      return consumeBody
        .call(this)
        .then(({ buffer, byteOffset, byteLength }) =>
          buffer.slice(byteOffset, byteOffset + byteLength)
        )
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
    return Promise.reject(new TypeError(`body used already for: ${this.url}`))
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

function getContentType(body = null) {
  if (body === null) {
    return null
  }

  if (typeof body === 'string') {
    return 'text/plain;charset=UTF-8'
  }

  if (isURLSearchParams(body)) {
    return 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  if (isBlob(body)) {
    return body.type || null
  }

  if (
    Buffer.isBuffer(body) ||
    isArrayBuffer(body) ||
    ArrayBuffer.isView(body)
  ) {
    return null
  }

  if (body && typeof body.getBoundary === 'function') {
    return `multipart/form-data;boundary=${body.getBoundary()}`
  }

  if (body instanceof Stream) {
    return null
  }

  return 'text/plain;charset=UTF-8'
}

module.exports = {
  Body,
  getContentType
}
