'use strict'

const request = require('request')
const test = require('tape')
const urlinate = require('urlinate')
const cachinate = require('../')

const xqs = 'assigned via query string'
const xmidd = 'assigned when middleware is created'

const defaultHeaders = {
  'x-midd': xmidd,
  'x-both': xmidd
}

const qsHeaders = {
  'x-qs': xqs,
  'x-both': xqs
}

const reqUrl = urlinate('http://wtv.com', {
  asset: {
    $: ['http://wtv.com/img.jpg', {
      quality: 1
    }]
  },
  headers: qsHeaders
})

test('middleware', function (t) {
  const middleware = cachinate(defaultHeaders)
  const req = {
    originalUrl: reqUrl
  }
  var res = {}
  const next = function () {
    check(t, res)
    t.end()
  }
  middleware(req, res, next)
})

test('cachinator', function (t) {
  const source = 'http://perdu.com'
  const cachinateURL = 'http://localhost:3000'

  const cachinator = require('../lib/cachinator')
  var handle = cachinator.start(defaultHeaders, function () {
    var cached = urlinate(cachinateURL, {
      asset: source,
      headers: qsHeaders
    })
    request(cached, function (cachedError, cachedResponse, cachedBody) {
      if (cachedError) {
        t.fail(cachedError)
      }
      check(t, cachedResponse)
      const observed = cachedBody
      handle.close(function () {
        request(source, function (error, response, body) {
          if (error) {
            t.fail(error)
          }
          t.equal(body, observed, 'asset body is unchanged')
          t.end()
        })
      })
    })
  })
})

function check (t, res) {
  t.equal(res.headers['x-midd'], xmidd, 'headers specified on middleware creation are inserted')
  t.equal(res.headers['x-qs'], xqs, 'query string headers are inserted')
  t.equal(res.headers['x-both'], xqs, 'headers specified in query string squash those specified on middleware creation')
}
