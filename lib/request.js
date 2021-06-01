const Headers = require('./headers')
const { Body, getContentType, getTotalBytes } = require('./body')
const { isVoid } = require('../utils')

class Request {
  #url
  #method
  #headers
  constructor(input, init = {}) {
    if (isRequest(input)) {
      this.#url = input.url
    } else {
      const urlObj = new URL(input)

      this.#url = urlObj.href
    }

    this.#method = (init.method || input.method || 'GET').toUpperCase()

    if (
      (!isVoid(init.body) || (isRequest(input) && !isVoid(input.body))) &&
      (this.#method === 'GET' || this.#method === 'HEADER')
    ) {
      throw new TypeError('Request with GET/HEAD method cannot have body')
    }

    const inputBody =
      init.body != null
        ? init.body
        : isRequest(input) && input.body !== null
        ? input.body
        : null

    Body.call(this, inputBody)
    this.#headers = new Headers(init.headers || input.headers || {})

    if (!isVoid(inputBody) && !this.#headers.has('Content-Type')) {
      const contentType = getContentType(inputBody)

      if (contentType) {
        this.#headers.append('Content-Type', contentType)
      }
    }
  }

  get url() {
    return this.#url
  }

  get method() {
    return this.#method
  }

  get headers() {
    return this.#headers
  }
}

Body.mixin(Request.prototype)

function isRequest(value) {
  return value instanceof Request
}

function getNodeRequestArguments(request) {
  const url = new URL(request.url)

  // Fetch step 1.3
  if (!request.headers.has('Accept')) {
    request.headers.set('Accept', '*/*')
  }

  if (!/^https?:$/.test(url.protocol)) {
    throw new TypeError('Only HTTP(S) protocols are supported')
  }

  // HTTP-network-or-cache fetch steps 2.4-2.7
  let contentLengthValue = null
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = '0'
  }

  if (request.body !== null) {
    const totalBytes = getTotalBytes(request)

    if (typeof totalBytes === 'number') {
      contentLengthValue = String(totalBytes)
    }
  }

  if (contentLengthValue) {
    request.headers.set('Content-Length', contentLengthValue)
  }

  // HTTP-network-or-cache fetch step 2.11
  if (!request.headers.has('User-Agent')) {
    request.headers.set('User-Agent', 'nodejs-fetch/0.1')
  }

  let { agent } = request
  if (typeof agent === 'function') {
    agent = agent(url)
  }

  if (!request.headers.has('Connection') && !agent) {
    request.headers.set('Connection', 'close')
  }

  const headers = {}

  request.headers.forEach((key, value) => (headers[key] = value))

  // HTTP-network fetch step 4.2
  // chunked encoding is handled by Node.js

  return [
    url,
    {
      method: request.method,
      headers,
      agent
    }
  ]
}

module.exports = { Request, getNodeRequestArguments }
