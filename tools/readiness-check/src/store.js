/* Where readiness checks are saved.
   Inside the hub on claude.ai: the hub page's shared database (collection "readiness"), reached through
   the hub bar's bridge, because only an artifact's main page can use the database.
   Anywhere else (opened on its own, or locally): this browser only, so the pages still work for testing. */
(function (root) {
  'use strict';
  var KEY = 'hftp-readiness-checks-v1', seq = 0, calls = {}, mode = null, waiters = [];
  function local() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveLocal(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
  if (root.parent !== root) {
    root.addEventListener('message', function (e) {
      var m = e.data;
      if (e.source !== root.parent || !m || m.hub !== 'db-result' || !calls[m.id]) return;
      var cb = calls[m.id]; delete calls[m.id]; cb(m);
    });
  }
  function ask(op, doc, data) {
    return new Promise(function (resolve, reject) {
      if (root.parent === root) { reject({ code: 'no_hub' }); return; }
      var id = 'q' + (++seq), t = setTimeout(function () { delete calls[id]; reject({ code: 'timeout' }); }, 8000);
      calls[id] = function (m) { clearTimeout(t); if (m.ok) resolve(m); else reject(m); };
      try { root.parent.postMessage({ hub: 'db', id: id, op: op, col: 'readiness', doc: doc, data: data }, root.location.origin); }
      catch (err) { clearTimeout(t); delete calls[id]; reject({ code: 'no_hub' }); }
    });
  }
  /* Find out once whether the shared database answers. */
  function ready() {
    if (mode) return Promise.resolve(mode);
    return new Promise(function (res) {
      waiters.push(res);
      if (waiters.length > 1) return;
      ask('list').then(function () { mode = 'shared'; }, function () { mode = 'local'; }).then(function () { waiters.splice(0).forEach(function (f) { f(mode); }); });
    });
  }
  var api = {
    mode: function () { return mode; },
    ready: ready,
    list: function () {
      return ready().then(function (m) {
        if (m === 'shared') return ask('list').then(function (r) { return r.docs; });
        var o = local(); return Object.keys(o).map(function (k) { return Object.assign({ _id: k }, o[k]); });
      });
    },
    save: function (id, doc) {
      return ready().then(function (m) {
        if (m === 'shared') return ask('set', id, doc).then(function () { return 'shared'; });
        var o = local(); o[id] = doc; if (!saveLocal(o)) throw { code: 'storage_blocked' }; return 'local';
      });
    },
    remove: function (id) {
      return ready().then(function (m) {
        if (m === 'shared') return ask('delete', id);
        var o = local(); delete o[id]; saveLocal(o);
      });
    }
  };
  root.RCStore = api;
})(typeof self !== 'undefined' ? self : this);
