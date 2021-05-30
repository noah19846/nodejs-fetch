const Headers = require('./headers')
const Body = require('./body')

class Response {
  #type
  #url
  #headers
  #status
  #statusText

  constructor(
    body = null,
    init = {
      status: 200,
      statusText: '',
      headers: new Headers(),
      url: ''
    }
  ) {
    if (init.status > 599 || init.status < 200) {
      throw new Error('status 超出范围')
    }

    Body.call(this, body)

    this.#type = 'default'
    this.#url = init.url
    this.#status = init.status
    this.#statusText = init.statusText
    this.#headers = new Headers(init.headers)
  }

  get type() {
    return this.#type
  }

  get url() {
    return this.#url
  }

  get redirected() {
    // TODO:
    return false
  }

  get status() {
    return this.#status
  }

  get ok() {
    return this.#status === 200
  }

  get statusText() {
    return this.#statusText
  }

  get headers() {
    return this.#headers
  }
}

Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  redirected: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true }
})

Body.mixin(Response.prototype)

module.exports = Response
