function match(url, mtd, route) {
  let fns = [], params = {}, arr = route[mtd] || [];
  if (route['ALL']) arr = route['ALL'].concat(arr);
  for (const [handlers, rgx, isParam] of arr) {
    if (rgx.test(url)) {
      if (isParam) params = rgx.exec(url).groups || {};
      fns = handlers;
      break;
    }
  }
  return { fns, params };
}
function findFns(arr) {
  let ret = [], i = 0, len = arr.length;
  while (i < len) {
    if (Array.isArray(arr[i])) ret = ret.concat(findFns(arr[i]));
    else if (is(arr[i], 'function')) ret.push(arr[i]);
    i++;
  };
  return ret;
}
const createRegex = (path) => [
  new RegExp(`^${path.replace(/\/$/, '')
    .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')
    .replace(/(\/?)\*/g, '($1.*)?')
    .replace(/\.(?=[\w(])/, '\\.')
    }/*$`),
  path.indexOf('/:') !== -1
];
const is = (a, b) => typeof a === b;
const defError = (err, _, res) => { res.statusCode = err.status || 500; res.end(err.message) };
const liteApp = ({
  route = {}, subs = [], sub = false, wares = [], asset, base = '',
  on404 = defError.bind(null, { status: 404, message: '404 not found' }),
  onError = defError,
  qsParse = (str) => Object.fromEntries(new URLSearchParams(str).entries()),
  urlParse = ({ url }) => url.indexOf('?', 1) !== -1 ? new URL('http://a.id' + url) : { pathname: url, search: '' }
} = {}) => ({
  subs, route,
  handle(req, res) {
    const { pathname: path, search: query } = urlParse(req);
    let { fns, params } = match(path, req.method, route), i = 0;
    req.path = path; req.search = query;
    req.params = params; req.originalUrl = req.originalUrl || req.url;
    req.query = query ? req.query || qsParse(query.substring(1)) : {};
    res.json = res.json || ((d) => {
      d = JSON.stringify(d);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Length', '' + Buffer.byteLength(d));
      res.end(d);
    });
    res.send = res.send || ((d) => is(d, 'object') ? res.json(d) : res.end(d));
    if (asset) Object.keys(asset).forEach(el => {
      if (path.startsWith(el)) fns = asset[el].concat(fns);
    });
    fns = wares.concat(fns, [on404]);
    const next = (err) => err ? onError(err, req, res, next) : !(res.finished || res.writableEnded) && fns[i++](req, res, next);
    next();
  },
  use(...as) {
    let str = is(as[0], 'string') ? as[0] : '', last = as[as.length - 1], _fns = findFns(as);
    if (str === '/') str = '';
    if (is(last, 'object') && (last.subs || last[0].subs)) {
      last = Array.isArray(last) ? last : [last];
      for (let i = 0; i < last.length; i++) {
        for (let j = 0; j < last[i].subs.length; j++) {
          let { mtd, path, fns } = last[i].subs[j]; fns = _fns.concat(fns);
          if (path === '/' && str !== "") path = "";
          (route[mtd] = route[mtd] || []).push([fns, ...createRegex(str + path)]);
        }
      }
    } else if (str !== '') {
      (asset = asset || {})[str] = [(req, _, next) => {
        req.url = req.url.replace(str, "") || "/";
        req.path = req.path.replace(str, "") || "/";
        next();
      }].concat(_fns);
    } else wares = wares.concat(_fns);
    return this;
  },
  listen(port, ...args) {
    require('http').createServer(this.handle).listen(port, ...args);
  },
  __proto__: new Proxy({}, {
    get: (_, prop, rec) => (path, ...args) => {
      if (is(prop, 'string')) {
        let mtd = prop.toUpperCase(), fns = findFns(args);
        if (path === '/' && base !== "") path = "";
        if (!sub) (route[mtd] = route[mtd] || []).push([fns, ...createRegex(base + path)]);
        else subs.push({ fns, path: base + path, mtd });
      }
      return route && rec;
    }
  })
});
exports.liteApp = liteApp;
exports.liteRouter = ({ base = '' } = {}) => liteApp({ sub: true, base });