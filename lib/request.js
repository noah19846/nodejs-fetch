const Headers = require('./headers')

class Request {
  #url
  #method
  #headers
  constructor(input, init = {}) {
    if (input instanceof Request) {
      this.#url = input.url
    } else {
      const urlObj = new URL(input)

      this.#url = urlObj.href
    }

    this.#method = (init.method || input.method || 'GET').toUpperCase()
    this.#headers = new Headers(init.headers || input.headers || {})
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

module.exports = Request
