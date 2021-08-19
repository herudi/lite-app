const { liteApp, liteRouter } = require('../index');

const foo = liteRouter();
foo.get('/foo', (req, res) => {
  res.end('foo')
})

const bar = liteRouter();
bar.get('/bar', (req, res) => {
  res.end('bar')
})

liteApp()
  .use('/api/v1', [foo, bar])
  .get('/', (req, res) => {
    res.end('base')
  })
  .listen(3000);