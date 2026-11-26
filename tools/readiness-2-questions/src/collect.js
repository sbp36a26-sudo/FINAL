/* "Can AI solve your problems?" v2.8.1: R2Collect, the public build's data sending (owner, 26 Nov 2026). Pure apart from the
   functions it is given, so it runs in the Node tests (tests/collect.test.mjs). Only the public build (build.mjs --public) includes
   this file; the claude.ai artifact build sends nothing.
   What is sent, one event at a time (the columns of hosting/apps-script/Code.gs, sheet "events"):
     { check_id, event: 'step_done' | 'result', step: '1'..'5' | 'result' | 'stop', version, at (the time, as text),
       hotel_type, role, country, hotel_name (only if typed), use_case, verdict, score,
       step2: { q1..q5: 'Yes' | 'No' | 'Not sure' }, must: { m1..m10: 'Yes' | 'Planned' | 'No' }, answers: { <question id>: same } }
   No IP address or browser name is put in the payload, and no cookie is set. How it goes: fetch(url, POST, mode 'no-cors',
   Content-Type text/plain, credentials 'omit', keepalive), and navigator.sendBeacon when fetch is missing, throws or fails.
   Failures are silent and never stop the tool. An empty url sends nothing. The opt-out ("Don't send my answers") is kept per
   browser under OPT_KEY (localStorage, else this page's memory) and is read at every send, so it is respected at once. */
(function (root) {
  'use strict';
  var OPT_KEY = 'hftp-readiness2q-nosend', MAX_BYTES = 50000;
  var STEP_NO = { hotel: '1', q: '2', must: '3', where: '4', tailored: '5' };
  var Q_WORD = { y: 'Yes', n: 'No', u: 'Not sure' }, A_WORD = { y: 'Yes', pl: 'Planned', n: 'No' };
  function str(v, n) { return typeof v === 'string' ? v.slice(0, n || 200) : ''; }
  function words(src, ids, W) { var o = {}; (ids || []).forEach(function (id) { var v = src && src[id]; if (W[v]) o[id] = W[v]; }); return o; }
  /* The payload of one event. rec: the check (R2Flow record); x: { step (the step completed, or 'result' / 'stop'), version,
     verdict, score, qIds, mustIds, tailIds (the step-5 question ids of its use case), now }. */
  function payload(event, rec, x) {
    var H = (rec && rec.hotel) || {}, use = rec && rec.use ? String(rec.use) : '';
    return {
      check_id: str(rec && rec.id, 60), event: event, step: STEP_NO[x.step] || str(x.step, 20), version: str(x.version, 20), at: x.now || new Date().toISOString(),
      hotel_type: str(H.type, 40), role: str(H.role, 40), country: str(H.country, 60), hotel_name: str(H.name, 120).trim(),
      use_case: str(use, 20), verdict: str(x.verdict || '', 20), score: typeof x.score === 'number' && isFinite(x.score) ? x.score : null,
      step2: words(rec && rec.Q, x.qIds, Q_WORD), must: words(rec && rec.A, x.mustIds, A_WORD), answers: words(rec && rec.T, x.tailIds, A_WORD)
    };
  }
  /* o: { url, fetch (window.fetch or null), beacon (navigator.sendBeacon bound, or null), storage (localStorage-like or null) } */
  function make(o) {
    o = o || {};
    var url = typeof o.url === 'string' ? o.url.trim() : '', mem = null;
    function optedOut() {
      try { if (o.storage) { var v = o.storage.getItem(OPT_KEY); if (v != null) return v === '1'; } } catch (e) { /* blocked */ }
      return mem === true;
    }
    function setOptOut(on) { mem = !!on; try { if (o.storage) o.storage.setItem(OPT_KEY, on ? '1' : '0'); } catch (e) { /* blocked: memory only */ } }
    function beacon(body) { try { return !!(o.beacon && o.beacon(url, body)); } catch (e) { return false; } }
    /* → true when a request was handed to the browser; false when nothing was sent (no url, opted out, too big, no way to send) */
    function sendRaw(p) {
      if (!url || !/^https?:\/\//i.test(url) || optedOut()) return false;
      var body; try { body = JSON.stringify(p); } catch (e) { return false; }
      if (!body || body.length > MAX_BYTES) return false;
      try {
        if (typeof o.fetch === 'function') {
          var r = o.fetch(url, { method: 'POST', mode: 'no-cors', credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: body });
          if (r && typeof r.then === 'function') r.then(null, function () { beacon(body); });
          return true;
        }
      } catch (e) { /* fall back to the beacon */ }
      return beacon(body);
    }
    function send(event, rec, x) { try { return sendRaw(payload(event, rec, x || {})); } catch (e) { return false; } }
    return { send: send, sendRaw: sendRaw, optedOut: optedOut, setOptOut: setOptOut, active: function () { return !!url && /^https?:\/\//i.test(url); } };
  }
  var api = { OPT_KEY: OPT_KEY, MAX_BYTES: MAX_BYTES, STEP_NO: STEP_NO, payload: payload, make: make };
  root.R2Collect = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
