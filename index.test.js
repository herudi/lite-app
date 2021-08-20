const { liteApp, liteRouter } = require("./index");
const http = require('http');
const test = require('ava');

const app = liteApp();
const router = liteRouter();

test('app is object', t => {
  t.is(typeof app, 'object');
});

test('router is object', t => {
  t.is(typeof router, 'object');
});

test('app method is function', t => {
  t.is(typeof app.all, 'function');
  t.is(typeof app.use, 'function');
  t.is(typeof app.handle, 'function');
  t.is(typeof app.listen, 'function');
  http.METHODS.forEach(el => t.is(typeof app[el], 'function'));
});

test('router method is function', t => {
  t.is(typeof router.all, 'function');
  http.METHODS.forEach(el => t.is(typeof router[el], 'function'));
});

app
  .get('/*', () => { })
  .post('/item', () => { })
  .put('/item/:id', () => { })
  .delete('/item/:id', () => { })
  .patch('/item/:extname.(png|jpg)', () => { });

const METHOD_URL_MATCH = [
  ['GET', '/exact/all'],
  ['POST', '/item'],
  ['PUT', '/item/543'],
  ['DELETE', '/item/789'],
  ['PATCH', '/item/file.jpg'],
];

test('count route method to be 5', t => {
  t.is(Object.keys(app.route).length, 5);
});

METHOD_URL_MATCH.forEach(([mtd, url]) => {
  for (const [_, { rgx }] of app.route[mtd]) {
    test(`match for ${mtd}${url} from ${rgx.toString()}`, (t) => {
      t.is(rgx.test(url), true);
    });
  }
});