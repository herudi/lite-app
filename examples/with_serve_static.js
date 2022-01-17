// install serve-static first
// npm i serve-static

const { liteApp } = require('../index');
const serveStatic = require('serve-static');

liteApp()
  .use('/assets', serveStatic('my_folder'))
  .listen(3000);