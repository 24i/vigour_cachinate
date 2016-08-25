'use strict'

const http = require('http')
const connect = require('connect')
const cachinate = require('./')

module.exports = exports = {
  start: function start (defaultHeaders, cb) {
    var app = connect()
    app.use(cachinate(defaultHeaders, true))
    return http.createServer(app).listen(process.env.CACHINATOR_PORT || 0, cb)
  }
}
