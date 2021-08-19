const { liteApp } = require('../index');

const sendJson = (req, res, next) => {
  res.json = (obj) => {
    const data = JSON.stringify(obj);
    res.setHeader('content-type', 'application/json');
    res.setHeader('content-length', '' + Buffer.byteLength(data));
    res.end(data);
  }
  next();
}

liteApp()
  .use(sendJson)
  .get('/', (req, res) => {
    res.json({ name: 'john' })
  })
  .listen(3000);