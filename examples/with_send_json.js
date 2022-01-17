const { liteApp } = require('../index');

liteApp()
  .get('/', (req, res) => {
    res.json({ name: 'john' })
  })
  .listen(3000);