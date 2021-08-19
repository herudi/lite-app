// install serve-static first
// npm i serve-static

const { liteApp } = require('../index');
const serveStatic = require('serve-static');

liteApp()
  .use('/assets', serveStatic('my_assets_folder'))
  .get('/', (req, res) => {
    res.end('hello')
  })
  .listen(3000);