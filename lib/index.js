'use strict'

const url = require('url')
const request = require('request')
const urlinate = require('urlinate')
const _merge = require('lodash.merge')

/**
 * @id cachinate
 * @function cachinate
 * @param headers {object} - headers to merge into into `res.headers`
 * @param [end] {boolean} - Whether the middleware has the responsibility of ending the request. Defaults to `false`. If you set this to true, make sure the requests will have a query string parameter called `asset` and holding a URL.
 * @returns middleware {function} - merges the provided headers into `res.headers`.
 */
module.exports = exports = function cachinate (headers, end) {
  return function middleware (req, res, next) {
    const parsed = url.parse(req.originalUrl)
    const query = urlinate.parse(parsed.query)
    if (!query || !query.asset) {
      res.statusCode === 400
      res.write('Missing `asset` in query string')
      res.end()
      return
    }
    if (headers) {
      res.headers = _merge(res.headers, headers, query && query.headers)
    }
    if (end) {
      request(query.asset)
        .on('error', function (err) {
          console.error('wtf', err)
        })
        .on('response', function (response) {
          response.headers = _merge(response.headers, res.headers)
        })
        .pipe(res)
    } else {
      next()
    }
  }
}
