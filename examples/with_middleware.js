const { liteApp } = require('../index');

liteApp()
  .use((req, res, next) => {
    req.foo = 'foo';
    next();
  })
  .get('/', (req, res) => {
    res.end(req.foo)
  })
  .listen(3000);