const http = require('http')
const https = require('https')
const { PassThrough, pipeline } = require('stream')

const { Headers, Request, Response, getNodeRequestArguments } = require('./lib')

function fetch(input, init) {
  return new Promise((resolve, reject) => {
    const request = new Request(input, init)
    const [url, requestOptions] = getNodeRequestArguments(request)
    const send = (url.protocol === 'https:' ? https : http).request

    send(request.url, requestOptions, res => {
      let error
      const { statusCode, statusMessage } = res

      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
      }

      if (error) {
        reject(error)
        res.resume()

        return
      }

      let body = pipeline(res, new PassThrough(), error => {
        reject(error)
      })

      resolve(
        new Response(body, {
          status: statusCode,
          statusText: statusMessage,
          headers: res.headers,
          url: request.url
        })
      )
    })
      .on('error', e => {
        reject(e)
      })
      .end()
  })
}

module.exports = {
  Headers,
  Request,
  Response,
  fetch
}
