function findRoute(url, mtd, route) {
  let fns = [], params = {}, arr = route[mtd] || [];
  if (route['ALL']) arr = arr.concat(route['ALL']);
  for (let [handlers, { rgx, isParam }] of arr) {
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
function createRegex(url) {
  const isParam = url.indexOf('/:') !== -1;
  url = url.replace(/\/$/, '').replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3');
  if (/\*|\./.test(url)) url = url.replace(/(\/?)\*/g, '($1.*)?').replace(/\.(?=[\w(])/, '\\.');
  return { rgx: new RegExp(`^${url}/*$`), isParam };
}
const findBase = ({ u, x = u.indexOf('/', 1) }) => x !== -1 ? u.substring(0, x) : u;
const is = (a, b) => typeof a === b;
const defError = (err, _, res) => { res.statusCode = err.status || 500; res.end(err.message) };
const liteApp = ({
  route = {}, subs = [], sub = false, wares = [], _static = {}, base = '',
  on404 = defError.bind(null, { status: 404, message: '404 not found' }),
  onError = defError,
  qsParse = (str) => Object.fromEntries(new URLSearchParams(str).entries()),
  urlParse = ({ url }) => url.indexOf('?', 1) !== -1 ? new URL('http://a.id' + url) : { pathname: url, search: '' }
} = {}) => ({
  subs, route,
  handle(req, res) {
    const { pathname, search: query } = urlParse(req), p = findBase({ u: pathname });
    let { fns, params } = findRoute(pathname, req.method, route), i = 0;
    req.path = pathname;
    req.search = query;
    req.params = params;
    req.query = query ? req.query || qsParse(query.substring(1)) : {};
    req.originalUrl = req.originalUrl || req.url;
    if (_static[p]) fns = _static[p].concat(fns);
    fns = wares.concat(fns, [on404]);
    const next = (err) => {
      let ret;
      try {
        ret = err
          ? onError(err, req, res, next)
          : !(res.finished || res.writableEnded) && fns[i++](req, res, next);
      } catch (e) {
        return err ? defError(e, req, res, next) : next(e);
      }
      if (ret && is(ret.then, 'function')) ret.then(void 0).catch(next);
    }
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
          (route[mtd] = route[mtd] || []).push([fns, createRegex(str + path)]);
        }
      }
    } else if (str !== '') {
      _static[str] = [(req, _, next) => {
        req.url = req.url.substring(str.length) || '/';
        req.path = req.path.substring(str.length) || '/';
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
        if (!sub) (route[mtd] = route[mtd] || []).push([fns, createRegex(path)]);
        else subs.push({ fns, path: base + path, mtd });
      }
      return route && rec;
    }
  })
});
exports.liteApp = liteApp;
exports.liteRouter = ({ base = '' } = {}) => liteApp({ sub: true, base });