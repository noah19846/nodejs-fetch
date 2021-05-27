const http = require('http')

const { Headers, Request, Response } = require('./lib')

function fetch(input, init) {
  return new Promise((resolve, reject) => {
    const request = new Request(input, init)
    const { headers = {} } = request

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

          let rawData = Buffer.alloc(0)

          res.on('data', chunk => {
            rawData = Buffer.concat([rawData, chunk])
          })

          res.on('end', () => {
            try {
              resolve(
                new Response(rawData, {
                  status: statusCode,
                  statusText: statusMessage,
                  headers: res.headers,
                  url: request.url
                })
              )
            } catch (e) {
              reject(e)
            }
          })
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
