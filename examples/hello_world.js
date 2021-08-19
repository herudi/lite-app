const { liteApp } = require('../index');

liteApp()
  .get('/', (req, res) => {
    res.end('hello world')
  })
  .listen(3000);