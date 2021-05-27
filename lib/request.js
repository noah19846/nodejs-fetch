const Headers = require('./headers')

class Request {
  constructor(input, init) {
    const urlObj = new URL(input)
    
    init = normalizeInitObj(init)
    this.method = typeof input === 'string' ? 'GET' : init.method
    this.url = urlObj.href
    this.headers = init.headers
    this.body = init.body
  }
}

function normalizeInitObj(init) {
  if (!init || typeof init !== 'object') {
    init = {
      method: 'GET',
      headers: new Headers(),
      body: null
    }
  }

  const { method = 'GET', headers = new Headers(), body = null } = init

  return { method, headers, body }
}

module.exports = Request
