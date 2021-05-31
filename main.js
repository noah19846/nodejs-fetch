const http = require('http')
const { PassThrough, pipeline } = require('stream')

const { Headers, Request, Response } = require('./lib')

function fetch(input, init) {
  return new Promise((resolve, reject) => {
    const request = new Request(input, init)
    const headers = {}

    request.headers.forEach((key, value) => (headers[key] = value))

    http
      .request(
        request.url,
        {
          method: request.method,
          headers
        },
        res => {
          let error
          const { statusCode, statusMessage } = res

          if (statusCode !== 200) {
            error = new Error(
              'Request Failed.\n' + `Status Code: ${statusCode}`
            )
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
        }
      )
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
