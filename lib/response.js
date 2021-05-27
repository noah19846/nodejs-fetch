const Headers = require('./headers')
const Body = require('./body')

class Response extends Body {
  constructor(body = null, init = {
    status: 200,
    statusText: '',
    headers: new Headers(),
    url: ''
  }) {
    super()
    if (init.status > 599 || init.status < 200) {
      throw new Error('status 超出范围')
    }

    this.headers = new Headers(init.headers)
    this.status = init.status
    this.statusText = init.statusText
    this.url = init.url
    this.body = body
  }

  get bodyUsed() {
    return false
  }

  get ok() {
    return this.status === 200
  }

  get redirected() {
    // TODO:
    return false
  }
}

module.exports = Response