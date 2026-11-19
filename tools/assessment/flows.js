/* AI Assessment Tool – flow machines (pure, no DOM). Shared by the page and the Node tests (tests/flows.test.mjs).
   See CLEANUP.md for the inventory these come from. */
(function (root) {
  'use strict';

  /* Save machine: one per saved document (the interview, and its transcript).
     States
       saved     the stored copy matches the screen (or nothing to save yet)
       pending   there are edits, a save is scheduled
       saving    a write is in flight
       retrying  the first write failed with 'unavailable'; one retry follows after a short wait
       blocked   read-only or no database: edits stay on screen (and in the browser draft) only
       error     the write failed; edits are kept in this browser
     Events
       edit      the user changed something            (only from the page's change())
       insync    a flush found nothing new to write
       block     a flush found it may not write
       save      a write starts
       wrote     a write finished and the screen still matches it
       behind    a write finished but newer edits arrived meanwhile (another save follows)
       retry     a write failed with 'unavailable' the first time
       fail      a write failed for good
     Anything not in the table is rejected (saveNext returns null) and the state stays as it was. */
  var SAVE = {
    saved:    { edit: 'pending', insync: 'saved', block: 'blocked', save: 'saving' },
    pending:  { edit: 'pending', insync: 'saved', block: 'blocked', save: 'saving' },
    saving:   { edit: 'saving', wrote: 'saved', behind: 'pending', retry: 'retrying', fail: 'error' },
    retrying: { edit: 'retrying', save: 'saving', fail: 'error' },
    blocked:  { edit: 'pending', insync: 'saved', block: 'blocked', save: 'saving' },
    error:    { edit: 'pending', insync: 'saved', block: 'blocked', save: 'saving' }
  };
  function saveNext(state, event) {
    var row = SAVE[state];
    return row && Object.prototype.hasOwnProperty.call(row, event) ? row[event] : null;
  }

  /* Browser draft of an interview (localStorage 'aiat-draft-<id>'), kept while edits are not yet stored.
     v1 (this version): { v: 1, at: <ms>, a: <assessment> }. v0 (before Nov 2026 clean-up): { at, a } with no v.
     readDraft returns a v1 record or null; anything malformed is null, never thrown. */
  var DRAFT_VERSION = 1;
  function parseDraft(raw, id) {
    var d;
    try { d = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return null; }
    if (!d || typeof d !== 'object') return null;
    if (d.v !== undefined && d.v !== DRAFT_VERSION) return null;
    if (typeof d.at !== 'number' || !isFinite(d.at)) return null;
    var a = d.a;
    if (!a || typeof a !== 'object' || Array.isArray(a)) return null;
    if (id && a.id !== id) return null;
    if (!a.info || typeof a.info !== 'object' || !a.scores || typeof a.scores !== 'object') return null;
    return { v: DRAFT_VERSION, at: d.at, a: a };
  }
  function makeDraft(a, at) { return { v: DRAFT_VERSION, at: at, a: a }; }

  var api = { SAVE: SAVE, saveNext: saveNext, DRAFT_VERSION: DRAFT_VERSION, parseDraft: parseDraft, makeDraft: makeDraft };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AIFlows = api;
})(typeof window !== 'undefined' ? window : globalThis);
