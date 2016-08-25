# cachinate

Fetches an asset, adding cache headers

<!-- VDOC.badges travis; standard; npm; coveralls -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
[![Build Status](https://travis-ci.org/vigour-io/cachinate.svg?branch=master)](https://travis-ci.org/vigour-io/cachinate)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/cachinate.svg)](https://badge.fury.io/js/cachinate)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/cachinate/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/cachinate?branch=master)

<!-- VDOC END -->

## Usage

<!-- VDOC.jsdoc toMiddleware -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
#### var middleware = toMiddleware(headers, [end])
- **headers** (*object*) - headers to merge into into `res.headers`
- **[end]** (*boolean*) - Whether the middleware has the responsibility of ending the request. Defaults to `false`. If you set this to true, make sure the requests will have a query string parameter called `asset` and holding a URL.
- **returns** (*function*) middleware - merges the provided headers into `res.headers`.

<!-- VDOC END -->

```javascript
const cachinate = require('cachinate')

const middleware = cachinate({
  'cache-control': 'public, no-transform, max-age=31540000'
  'Edge-Control': '!no-cache, max-age=31540000'
})
app.use(middleware)
app.use(function (req, res, next) {
  assert(res.headers['cache-control'] === 'public, no-transform, max-age=31540000')
  assert(res.headers['Edge-Control'] === '!no-cache, max-age=31540000')
})
```

## npm start

Launches a production-ready http server using this middleware and expecting the following query string parameters to be provided with each request (preferably via [urlinate](npmjs.org/package/urlinate)):
  - **asset** {*string*} - Required! URL of asset to `GET` and stream back as response)
  - [**headers**] {*object*} - Optional. headers to be merged into `res.headers`

There are also default headers, see [defaultHeaders.js](defaultHeaders.js)

## Examples

The following examples suppose there is a cachinator running at http://cachinator.cdn. As the URL suggests, this could also be the URL of a CDN having a cachinator as origin server. This is a nice way to allow shared caching between clients who share the same edge server.

By default, cachinate will add headers to cache for a year
```javascript
var urlinate = require('urlinate')
var url = urlinate('http://cachinate.cdn', {
  asset: 'http://wtv.com/asset.jpg'
})
http.get(url, function (res) {
  // res.headers['cache-control'] === 'public, no-transform, max-age=31540000'
  // res.headers['Edge-Control'] === ''!no-cache, max-age=31540000'
})
```

But you can override the default cache duration by setting those headers to something different. In fact, you can just set any headers you want

```javascript
var urlinate = require('urlinate')
var url = urlinate('http://cachinator.cdn', {
  asset: 'http://wtv.com/asset.jpg',
  headers: {
    'cache-control': `no-cache`,
    'Edge-Control': 'no-cache',
    'X-Proxy-User-Agent': 'Cachinator!!!'
  }
})
http.get(url, function (res) {
  // res.headers['cache-control'] === 'no-cache'
  // res.headers['Edge-Control'] === 'no-cache'
  // res.headers['X-Proxy-User-Agent'] === 'Cachinator!!!'
})
```

### Deployment

```sh
now
```
See [nowjs.org](nowjs.org)

Also works out of the box on **Heroku**

```sh
git remote add <your_heroku_remote>
git push heroku master
```