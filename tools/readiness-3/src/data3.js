/* Do you need AI? v3 (tools/readiness-3): the v3 question data, read from the inlined spec/usecase_questions_v3.runtime.json
   (<script type="application/json" id="r3-data">). Pure, no DOM. Every string is used verbatim from the JSON: this file only
   indexes it, it never rewords it.
   R3Data.index(D)        → { D, UC: {id: use case}, DEPTS: [{ name, uses: [use case] }] (JSON order), MH: {id: must-have}, S2: {id: step-2 item} }
   R3Data.acronyms(D, s)  → the glossary entries ({ abbr, full }) whose acronym appears in the text(s) s, in order of first appearance.
                            A screen spells each one out once (§2.6 of the spec): the page shows these under the screen's questions.
   R3Data.label(D, kind, key) → the plain label for an area, owner or weight key (D.labels). */
(function (root) {
  'use strict';
  function index(D) {
    var UC = {}, DEPTS = [], byName = {}, MH = {}, S2 = {};
    D.use_cases.forEach(function (u) {
      UC[u.id] = u;
      if (!byName[u.department]) { byName[u.department] = { name: u.department, uses: [] }; DEPTS.push(byName[u.department]); }
      byName[u.department].uses.push(u);
    });
    D.must_haves.forEach(function (m) { MH[m.id] = m; });
    D.step2.forEach(function (s) { S2[s.id] = s; });
    return { D: D, UC: UC, DEPTS: DEPTS, MH: MH, S2: S2 };
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  /* Case-sensitive and bounded by anything that is not a letter or digit ("IT" in "IT team", not in "ITEM" or "it"). */
  function acronyms(D, texts) {
    var all = [].concat(texts).join('\n'), found = [];
    Object.keys(D.glossary).forEach(function (abbr) {
      var m = new RegExp('(^|[^A-Za-z0-9])' + escRe(abbr) + '(?![A-Za-z0-9])').exec(all);
      if (m) found.push({ abbr: abbr, full: D.glossary[abbr], at: m.index + m[1].length });
    });
    return found.sort(function (a, b) { return a.at - b.at; }).map(function (x) { return { abbr: x.abbr, full: x.full }; });
  }
  function label(D, kind, key) { var t = D.labels[kind]; return t && t[key] || ''; }
  root.R3Data = { index: index, acronyms: acronyms, label: label };
})(typeof self !== 'undefined' ? self : this);
