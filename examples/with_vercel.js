const { liteApp } = require('../index');

const app = liteApp();

app.get('/', (req, res) => {
    res.end('hello vercel')
});

app.post('/post', (req, res) => {
    console.log(req.body);
    res.statusCode = 201;
    res.end('Created');
});

module.exports = app.handle;