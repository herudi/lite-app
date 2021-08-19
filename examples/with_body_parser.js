// install body-parser first
// npm i body-parser

const { urlencoded, json } = require('body-parser');
const { liteApp } = require('../index');

const app = liteApp();

// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));

// parse application/json
app.use(json());

app.post('/save', (req, res) => {
  console.log(req.body);
  res.statusCode = 201;
  res.end('Created')
});

app.listen(3000, () => {
  console.log('> Running on port 3000');
});