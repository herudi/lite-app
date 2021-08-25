# Lite App

[![npm version](https://img.shields.io/badge/npm-1.0.4-blue.svg)](https://npmjs.org/package/lite-app) 
[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![download-url](https://img.shields.io/npm/dm/lite-app.svg)](https://npmjs.org/package/lite-app)

Fast ~4kb (express like) nodejs micro framework.

## Install
```bash
npm i lite-app
```

## Usage

```js
//example
const { liteApp } = require('lite-app');

//initialize app.
//like app = express()
const app = liteApp();

app.get('/', (req, res) => {
  res.end('lite');
});

app.listen(8080, () => {
  console.log('> Running on port 8080');
});
```
```js
//usage
app[METHOD](path, ...handlers);
```
## Middleware
```js
//example
const { liteApp } = require('lite-app');

liteApp()
  .use((req, res, next) => {
      console.log(`Logger ${req.url}`);
      next();
  })
  .get('/foo', (req, res) => {...})
  .get('/foo/:id', (req, res) => {...})
  .listen(8080);
```
```js
//usage
app.use(...fns);
app.use(path, ...fns);
app.use([fn1, fn2]);
//more
```

## Router
```js
//example
const { liteApp, liteRouter } = require('lite-app');

//same as foo = express.Router()
const foo = liteRouter();
foo.get('/foo', (req, res) => {...})

const bar = liteRouter();
bar.get('/bar', (req, res) => {...})

liteApp()
  .use('/api/v1', [foo, bar])
  .get('/', (req, res) => {...})
  .listen(8080);
```
```js
//usage
const app = liteRouter({ base?: string });
app.use(prefix, ...middleware, [router1, router1]);
app.use(prefix, [router1, router1]);
app.use([router1, router1]);
```
## Handle Error
```js
//example
const { liteApp } = require('lite-app');

//handle custom error
function onError(err, req, res, next) {
  res.statusCode = err.status || err.code || 500;
  res.end('my custom error ' + err.message);
}

//handle custom not found (404)
function on404(req, res, next) {
  res.statusCode = 404;
  res.end('my custom 404 ' + req.url);
}

//add error to options liteApp
liteApp({ onError, on404 })
  .get('/', (req, res) => {...})
  .listen(8080);
```
See [examples](https://github.com/herudi/lite-app/tree/master/examples)

## License

[MIT](LICENSE)