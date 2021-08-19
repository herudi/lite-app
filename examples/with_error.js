const { liteApp } = require('../index');

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
  .get('/', (req, res) => {
      //noop is not a function
      req.noop();
      res.end();
  })
  .listen(8080);