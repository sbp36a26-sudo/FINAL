/* Hotel AI Register: the page's state machines, as pure functions.
   Plain script with no dependencies and no DOM. It runs in the page (inlined by build.mjs) and in the
   Node tests (tests/machines.test.mjs). src/app.js is the only caller in the page; it holds the current
   values and does the side effects (render, history, storage) after each transition. See CLEANUP.md.

   1. Route   where the user is: tab + view + tool.          route(), routeFromHistory(), historyEntry(), sameRoute()
   2. Dialog  at most one confirm box or copy box open.        dialogSend(), dialogHome()
   3. Host    how downloads are saved (hub bridge or link).    hostStart(), hostSend()
   4. Stored  the saved register: version check, migration.    readStored()
   5. Hash    the #add=<use id>&name=<tool name> link.         parseAddHash()                                  */
(function (root) {
  'use strict';

  // ---------- 1. Route ----------
  /* States: how | hotel | todo | watch | register/list | register/pick | register/tool (+ toolId).
     Events: go (a click), pop (Back/forward: history.state), start (reload: history.state), add (#add= link).
     Invariants: a view other than "list" exists only on the register tab; "tool" always names a tool that exists;
     every other route has toolId null. An unknown tab falls back to "how". */
  var TABS = ['how', 'hotel', 'register', 'todo', 'watch'];
  var VIEWS = ['list', 'pick', 'tool'];
  function route(tab, view, toolId, exists) {
    var r = { tab: TABS.indexOf(tab) >= 0 ? tab : 'how', view: VIEWS.indexOf(view) >= 0 ? view : 'list', toolId: null };
    if (r.tab !== 'register') r.view = 'list';
    if (r.view === 'tool') {
      if (toolId && typeof toolId === 'string' && (!exists || exists(toolId))) r.toolId = toolId;
      else r.view = 'list';
    }
    return r;
  }
  /* history.state written by this page is { reg: [tab, view, toolId] } (unchanged since phase 3). */
  function routeFromHistory(hs, exists) {
    var r = hs && hs.reg;
    if (!Array.isArray(r)) return null;
    return route(r[0], r[1], r[2], exists);
  }
  function historyEntry(r) { return { reg: [r.tab, r.view, r.toolId] }; }
  function sameRoute(a, b) { return !!a && !!b && a.tab === b.tab && a.view === b.view && a.toolId === b.toolId; }
  function routeName(r) { return r.tab === 'register' ? 'register/' + r.view : r.tab; }

  // ---------- 2. Dialog ----------
  /* States: none | confirm (kind: delete, reset, example, own, import) | copy (vendor email text).
     Events and transitions (anything not listed is ignored and leaves the state unchanged):
       none     ask -> confirm            copy -> copy
       confirm  cancel -> none            yes -> none, effect = kind      ask -> confirm (the newer one)   copy -> copy
       copy     close -> none             copy -> copy                    ask -> confirm
       any      navigate -> none
     Guards: ask "delete" needs a tool id; ask "import" needs the register read from the backup (payload).
     Effects are returned, never run here: app.js runs them once, so a confirm cannot fire twice. */
  var KINDS = ['delete', 'reset', 'example', 'own', 'import'];
  var NONE = { name: 'none' };
  var DIALOG = {
    none: { ask: 'confirm', copy: 'copy', navigate: 'none' },
    confirm: { cancel: 'none', yes: 'none', ask: 'confirm', copy: 'copy', navigate: 'none' },
    copy: { close: 'none', copy: 'copy', ask: 'confirm', navigate: 'none' }
  };
  function dialogSend(d, ev) {
    d = d && DIALOG[d.name] ? d : NONE;
    var next = DIALOG[d.name][ev && ev.type];
    if (!next) return { dialog: d, effect: null, ignored: true };
    if (ev.type === 'ask') {
      if (KINDS.indexOf(ev.kind) < 0) return { dialog: d, effect: null, ignored: true };
      if (ev.kind === 'delete' && !ev.id) return { dialog: d, effect: null, ignored: true };
      if (ev.kind === 'import' && !(ev.payload && Array.isArray(ev.payload.tools))) return { dialog: d, effect: null, ignored: true };
      return { dialog: { name: 'confirm', kind: ev.kind, id: ev.id || null, payload: ev.payload || null }, effect: null };
    }
    if (ev.type === 'copy') {
      if (!ev.title) return { dialog: d, effect: null, ignored: true };
      return { dialog: { name: 'copy', title: String(ev.title), text: String(ev.text || '') }, effect: null };
    }
    if (ev.type === 'yes') return { dialog: NONE, effect: { kind: d.kind, id: d.id, payload: d.payload } };
    return { dialog: NONE, effect: null };
  }
  /* Where each confirm box is drawn. A confirm asked for elsewhere would be invisible, so app.js moves to its home first. */
  function dialogHome(kind, r) {
    if (kind === 'delete') return r.tab === 'register' && r.view === 'tool';
    if (kind === 'reset' || kind === 'import') return r.tab === 'how';
    if (kind === 'example') return r.tab === 'how' || (r.tab === 'register' && r.view === 'list');
    if (kind === 'own') return (r.tab === 'register' && r.view === 'list') || r.tab === 'todo' || r.tab === 'hotel';
    return false;
  }
  function dialogName(d) { return !d || d.name === 'none' ? 'none' : d.name === 'confirm' ? 'confirm:' + d.kind : 'copy'; }

  // ---------- 3. Host (download bridge) ----------
  /* States: none (page not in a frame: plain download link) | pending (asked the hub page, waiting for its answer)
             | yes (the hub saves files) | no (plain download link).
     Events: pong (with downloads true/false), timeout (12 s without an answer).
     A frame whose parent is another origin cannot reach the hub, so it starts in "no" instead of waiting. yes/no/none are final. */
  var HOST = { pending: { pong: true, timeout: 'no' } };
  function hostStart(inFrame, parentSameOrigin) { return !inFrame ? 'none' : parentSameOrigin ? 'pending' : 'no'; }
  function hostSend(s, ev) {
    var row = HOST[s]; if (!row || !ev || !row[ev.type]) return s;
    if (ev.type === 'pong') return ev.downloads ? 'yes' : 'no';
    return row[ev.type];
  }

  // ---------- 4. Stored register ----------
  /* The saved register (localStorage hftp-ai-register-v1, and backup files) carries v: 1.
     readStored(raw) -> { status: 'empty' | 'ok' | 'unreadable', data, reason }.
     MIGRATE holds one step per old version (v -> v + 1); there is none yet because v: 1 is the only version.
     Anything else (damaged JSON, a newer version, no tools list) is "unreadable": app.js keeps a copy and never overwrites it silently. */
  var VERSION = 1;
  var MIGRATE = {};
  function readStored(raw) {
    if (raw == null || raw === '') return { status: 'empty', data: null };
    var o;
    try { o = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return { status: 'unreadable', data: null, reason: 'damaged' }; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return { status: 'unreadable', data: null, reason: 'shape' };
    var v = o.v;
    while (typeof v === 'number' && v < VERSION && MIGRATE[v]) { o = MIGRATE[v](o); v = o.v; }
    if (v !== VERSION) return { status: 'unreadable', data: null, reason: typeof v === 'number' && v > VERSION ? 'newer' : 'version' };
    if (!Array.isArray(o.tools)) return { status: 'unreadable', data: null, reason: 'shape' };
    return { status: 'ok', data: o };
  }

  // ---------- 5. #add= link ----------
  /* From the Readiness check and the AI Act guide: #add=<use id>&name=<tool name, URI-encoded>. A malformed name is ignored, never thrown. */
  function parseAddHash(hash) {
    var m = /(?:^|[#&])add=([a-z]+-\d+)(?:&name=([^&]*))?/.exec(hash || '');
    if (!m) return null;
    var name = '';
    if (m[2]) { try { name = decodeURIComponent(m[2]); } catch (e) { name = ''; } }
    return { useId: m[1], name: name };
  }

  var api = { TABS: TABS, VIEWS: VIEWS, route: route, routeFromHistory: routeFromHistory, historyEntry: historyEntry, sameRoute: sameRoute, routeName: routeName,
              DIALOG: DIALOG, KINDS: KINDS, dialogSend: dialogSend, dialogHome: dialogHome, dialogName: dialogName,
              HOST: HOST, hostStart: hostStart, hostSend: hostSend, VERSION: VERSION, MIGRATE: MIGRATE, readStored: readStored, parseAddHash: parseAddHash };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RegMachines = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
