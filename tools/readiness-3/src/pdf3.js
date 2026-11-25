/* Do you need AI? v3 (tools/readiness-3): the PDF (spec §6.10). Pure; runs in the page and in the Node tests (tests/pdf3.test.mjs).
   blocks(m)  m = R3Result.model(...), the object the result screen draws, so the PDF and the screen say the same.
              Page 1: title, hotel, use case, date, the verdict box (verdict, reason), the flag, the notes, the top 3 actions.
              Then, in the result's order: details by area, action plan by person, questions for the vendor, every question and
              answer, how this was worked out, the readiness score. No legal section and no sources.
              A soft stop: title, hotel, date, the verdict box, simpler options to try first, top actions, the five step 2 answers.
   draw(b, jspdf, font) → { doc, pages, footers }: A4, every page's footer is the disclaimer plus "page n of N".
   fileName is made by the page (Do-you-need-AI_<hotel>_<date>.pdf). jsPDF and the "Register Sans" font (SIL OFL) are inlined. */
(function (root) {
  'use strict';
  var TITLE = 'Do you need AI? Result';

  function blocks(m) {
    var b = [{ k: 'title', t: TITLE }, { k: 'meta', t: 'Hotel: ' + m.hotelLine }];
    b.push({ k: 'meta', t: 'Use case: ' + (m.stop ? 'not chosen (the check stopped at step 2)' : m.useTitle) });
    b.push({ k: 'meta', t: 'Date: ' + m.date });
    b.push({ k: 'verdict', name: m.verdict, reason: m.reason, tone: m.tone });
    if (m.flag) b.push({ k: 'note', t: m.flag, tone: 'lo' });
    m.notes.forEach(function (n) { b.push({ k: 'note', t: n.note, tone: 'md' }); });
    if (m.notFit) b.push({ k: 'note', t: m.notFit, tone: 'md' });
    if (m.stop) {
      b.push({ k: 'h', t: 'Simpler options to try first' });
      m.simpler.forEach(function (t) { b.push({ k: 'li', t: t }); });
      b.push({ k: 'p', t: 'If you still think AI is needed, Continue anyway in the tool. The result can then be Almost ready at best.' });
    }
    b.push({ k: 'h', t: 'Top 3 actions' });
    if (!m.top3.length) b.push({ k: 'p', t: 'Nothing open.' });
    m.top3.forEach(function (a, i) { b.push({ k: 'num', n: i + 1, who: a.owner, body: a.text }); });
    if (m.stop) {
      b.push({ k: 'h', t: 'Your answers' });
      m.qa[0].items.forEach(function (i) { b.push({ k: 'item', name: i.title, check: i.text, val: i.answer }); });
      b.push({ k: 'h', t: 'Readiness score' }, { k: 'p', t: m.scoreLine });
      return { stop: true, run: { hotel: m.hotel, date: m.date }, disclaimer: m.disclaimer, blocks: b };
    }
    b.push({ k: 'page' });
    b.push({ k: 'h', t: 'Details by area' });
    m.areas.forEach(function (a) { b.push({ k: 'area', name: a.name, rest: a.line, share: a.total ? Math.round(100 * a.yes / a.total) : 0 }); });
    b.push({ k: 'h', t: 'Action plan by person' });
    if (!m.people.length) b.push({ k: 'p', t: 'Nothing open.' });
    m.people.forEach(function (p) { b.push({ k: 'label', t: p.owner, person: true }); p.items.forEach(function (t) { b.push({ k: 'todo', t: t }); }); });
    b.push({ k: 'h', t: 'Questions to ask the vendor' });
    if (!m.vendor.length) b.push({ k: 'p', t: 'None: no answer is Don\'t know yet and nothing is left for the vendor.' });
    m.vendor.forEach(function (t, i) { b.push({ k: 'num', n: i + 1, body: t }); });
    b.push({ k: 'h', t: 'Every question and your answer' });
    m.qa.forEach(function (g) {
      if (!g.items.length) return;
      b.push({ k: 'label', t: g.head, group: true });
      g.items.forEach(function (i) { b.push({ k: 'item', name: i.title || i.text, check: i.title ? i.text : '', sub: i.weight ? i.weight + (i.owner ? ' · Who answers: ' + i.owner : '') : '', val: i.answer }); });
    });
    b.push({ k: 'h', t: 'How this was worked out' });
    m.method.forEach(function (t) { b.push({ k: 'li', t: t, small: true }); });
    b.push({ k: 'h', t: 'Readiness score' }, { k: 'score', t: m.score + '%', sub: m.scoreSub });
    return { stop: false, run: { hotel: m.hotel, date: m.date }, disclaimer: m.disclaimer, blocks: b };
  }

  /* Characters the embedded font can print; others → '?'. */
  function safe(s) { return String(s == null ? '' : s).replace(/[^\u0000-ɏ‐-⁞€™←-↓]/g, '?'); }
  var COL = { ink: [21, 24, 29], ink2: [71, 76, 85], ink3: [91, 95, 103], line: [222, 220, 212], line2: [236, 234, 227], bg: [245, 244, 239],
    accent: [30, 78, 140], accentS: [227, 235, 246], hi: [31, 111, 67], hiS: [225, 240, 231], md: [126, 87, 0], mdS: [250, 239, 213],
    lo: [163, 57, 42], loS: [248, 225, 220], na: [83, 88, 95], naS: [236, 236, 233] };
  var SZ = { title: 20, verdict: 18, h: 12.5, body: 9.5, small: 8 };
  var PAGE = { W: 210, H: 297, M: 20, TOP: 22, BOT: 297 - 26 };
  function sticky(b) { return b && (b.k === 'h' || b.k === 'label'); }
  function footer(i, n) { return 'page ' + i + ' of ' + n; }

  function draw(m, jspdf, font) {
    var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = PAGE.W, H = PAGE.H, M = PAGE.M, TW = W - 2 * M, TOP = PAGE.TOP, BOT = PAGE.BOT, y = 20, FACE = 'helvetica';
    var DRY = false, table = false, blocks = m.blocks;
    if (font && font.regular && font.bold) {
      doc.addFileToVFS('rs-regular.ttf', font.regular); doc.addFont('rs-regular.ttf', 'RegisterSans', 'normal');
      doc.addFileToVFS('rs-bold.ttf', font.bold); doc.addFont('rs-bold.ttf', 'RegisterSans', 'bold');
      FACE = 'RegisterSans';
    }
    function f(style, size, col) { doc.setFont(FACE, style); doc.setFontSize(size); var c = COL[col || 'ink']; doc.setTextColor(c[0], c[1], c[2]); }
    function lh(size) { return size * 0.3528 * 1.32; }
    function fill(col) { var c = COL[col]; doc.setFillColor(c[0], c[1], c[2]); }
    function stroke(col, w) { var c = COL[col]; doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(w); }
    function rule(x1, x2, col, w) { if (!DRY) { stroke(col, w || 0.2); doc.line(x1, y, x2, y); } }
    function para(t, x, w, size, style, col) { f(style, size, col); var ls = doc.splitTextToSize(safe(t), w); ls.forEach(function (l) { if (!DRY) doc.text(l, x, y + lh(size) * 0.74); y += lh(size); }); return ls.length; }
    function measure(fn) { var d = DRY, y0 = y; DRY = true; fn(); var h = y - y0; y = y0; DRY = d; return h; }
    function thead() { if (!DRY) { fill('bg'); doc.rect(M, y, TW, 6.5, 'F'); } f('bold', SZ.small, 'ink3'); if (!DRY) { doc.text('Question', M + 2, y + 4.4); doc.text('Your answer', W - M - 52, y + 4.4); } y += 6.5; }
    function newPage() { doc.addPage(); y = TOP; if (table) thead(); }
    function atTop() { return y <= TOP + 0.5 + (table ? 6.5 : 0); }
    function box(tone, inner) { var top = y, h = measure(inner); if (!DRY) { fill(tone + 'S'); doc.rect(M, top, TW, h, 'F'); fill(tone); doc.rect(M, top, 1.6, h, 'F'); } inner(); }

    function render(b) {
      switch (b.k) {
        case 'title': para(b.t, M, TW, SZ.title, 'bold', 'ink'); y += 3; break;
        case 'meta': { var c = b.t.indexOf(': '); f('normal', SZ.body, 'ink3'); if (!DRY) doc.text(safe(b.t.slice(0, c + 1)), M, y + lh(SZ.body) * 0.74); para(b.t.slice(c + 2), M + 24, TW - 24, SZ.body, 'normal', 'ink'); y += 0.6; break; }
        case 'verdict': y += 4; box(b.tone, function () { y += 6; para(b.name, M + 7, TW - 14, SZ.verdict, 'bold', b.tone === 'na' ? 'ink2' : b.tone); y += 2; para(b.reason, M + 7, TW - 14, SZ.body + 1, 'bold', 'ink'); y += 6; }); y += 4; break;
        case 'note': box(b.tone, function () { y += 3; para(b.t, M + 6, TW - 10, SZ.body, 'normal', 'ink'); y += 3; }); y += 3; break;
        case 'h': if (!atTop()) y += 7; table = false; para(b.t, M, TW, SZ.h, 'bold', 'ink'); y += 1.6; rule(M, W - M, 'line', 0.3); y += 3.4; break;
        case 'label':
          if (b.person) { y += 3; para(b.t, M, TW, SZ.body, 'bold', 'ink'); y += 1; rule(M, W - M, 'line2', 0.25); y += 2; break; }
          if (b.group) { if (!table) { y += 1; thead(); if (!DRY) table = true; } y += 1.5; var top = y; if (!DRY) { fill('line2'); doc.rect(M, top, TW, 6, 'F'); } y += 1; para(b.t, M + 2, TW - 4, SZ.small, 'bold', 'ink2'); y = top + 7; break; }
          y += 3; para(b.t, M, TW, SZ.small, 'bold', 'ink3'); y += 1.4; break;
        case 'p': para(b.t, M, TW, SZ.body, 'normal', 'ink2'); y += 2; break;
        case 'li': { var sz = b.small ? SZ.small + 0.5 : SZ.body; f('normal', sz, 'ink3'); if (!DRY) doc.text('-', M + 0.5, y + lh(sz) * 0.74); para(b.t, M + 5, TW - 5, sz, 'normal', 'ink'); y += 1.6; break; }
        case 'todo': if (!DRY) { stroke('ink3', 0.3); doc.rect(M + 0.3, y + 0.7, 3.2, 3.2); } para(b.t, M + 7, TW - 7, SZ.body, 'normal', 'ink'); y += 2.4; break;
        case 'num': f('bold', SZ.body, 'accent'); if (!DRY) doc.text(String(b.n) + '.', M, y + lh(SZ.body) * 0.74);
          if (b.who) { para(b.who, M + 7, TW - 7, SZ.small, 'bold', 'ink3'); y += 0.2; }
          para(b.body, M + 7, TW - 7, SZ.body, 'normal', 'ink'); y += 3; break;
        case 'area': {
          var t0 = y; para(b.name, M, 56, SZ.body, 'bold', 'ink'); var y1 = y;
          if (!DRY) { fill('line2'); doc.rect(M + 60, t0 + 1.6, 40, 2.4, 'F'); if (b.share) { fill('accent'); doc.rect(M + 60, t0 + 1.6, 40 * b.share / 100, 2.4, 'F'); } }
          y = t0; para(b.rest, M + 106, TW - 106, SZ.body, 'normal', 'ink2'); y = Math.max(y, y1) + 1.3; rule(M, W - M, 'line2', 0.25); y += 1.3; break;
        }
        case 'item': {
          var t1 = y + 1.8; y = t1;
          para(b.name, M + 2, TW - 60, SZ.body, b.check ? 'bold' : 'normal', 'ink');
          if (b.check) { y += 0.2; para(b.check, M + 2, TW - 60, SZ.small + 0.5, 'normal', 'ink2'); }
          if (b.sub) { y += 0.2; para(b.sub, M + 2, TW - 60, SZ.small, 'normal', 'ink3'); }
          var y2 = y; y = t1; para(b.val, W - M - 52, 50, SZ.small + 0.5, 'bold', 'ink');
          y = Math.max(y, y2) + 1.8; rule(M, W - M, 'line2', 0.25); break;
        }
        case 'score': para(b.t, M, TW, 26, 'bold', 'ink'); y += 1; para(b.sub, M, TW, SZ.body, 'normal', 'ink2'); y += 2; break;
      }
    }
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.k === 'page') { if (y > TOP + 0.5) newPage(); continue; }
      var need = measure(function () { render(b); }), j = i;
      while (sticky(blocks[j]) && blocks[j + 1] && blocks[j + 1].k !== 'page') { j++; need += measure((function (nb) { return function () { render(nb); }; })(blocks[j])); }
      if (y + need > BOT && !atTop()) newPage();
      render(b);
    }
    var n = doc.getNumberOfPages(), footers = [], hd = safe(['Do you need AI?', m.run && m.run.hotel, m.run && m.run.date].filter(Boolean).join(' · '));
    for (var p = 1; p <= n; p++) {
      doc.setPage(p); var ft = footer(p, n); footers.push(ft);
      stroke('line', 0.2); doc.line(M, H - 19, W - M, H - 19);
      f('normal', SZ.small, 'ink2'); doc.text(safe(m.disclaimer), M, H - 14.5);
      f('normal', SZ.small, 'ink3'); doc.text('Do you need AI? v3.0', M, H - 10.5);
      var s = ft; doc.text(s, W - M - doc.getTextWidth(s), H - 10.5);
      if (p > 1) { var hl = doc.splitTextToSize(hd, TW - 4); doc.text(hl[0] + (hl.length > 1 ? '…' : ''), M, 12.5); stroke('line', 0.2); doc.line(M, 15, W - M, 15); }
    }
    return { doc: doc, pages: n, footers: footers };
  }
  root.R3Pdf = { TITLE: TITLE, blocks: blocks, draw: draw, safe: safe, footer: footer, PAGE: PAGE };
})(typeof self !== 'undefined' ? self : this);
