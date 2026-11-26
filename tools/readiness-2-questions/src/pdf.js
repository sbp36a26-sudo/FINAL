/* "Can AI solve your problems?" v2.8.1: the two PDFs of the result (pure; runs in the page and in the Node tests, tests/pdf.test.mjs).
   v2.7 (owner, 25 Nov 2026): TWO documents. v2.8.0 (owner decision 4): the Result PDF ends with the use case's examples and sources. kind 'result': Result, Start with these three, Action plan by
   person, Questions for the vendor. kind 'answers': a short summary, then every question with the answer given
   (step 2, step 3, step 5). The stop screen keeps its one-page PDF (kind 'result').
   jsPDF and the "Register Sans" font subset (tools/register/fonts, SIL OFL 1.1) are inlined by build.mjs: nothing is loaded.
   1. model(rec, env) → { stop, run: { hotel, date }, blocks }, built from R2Logic.resultModel(rec, env), the same object the
      result page draws, so the PDF and the screen use the same words. env = { cat, TQ, RC, M, today }.
        blocks: { k: 'title' | 'meta' | 'h' | 'verdict' | 'lead' | 'label' | 'p' | 'q' | 'li' | 'todo' | 'area' | 'item' | 'num', ... }
      Q1 Yes (v2.6; No before) → the one-page stop version (why, the instead line, the five answers).
   2. fileName(hotel, today, kind) → "Can-AI-solve-your-problems_<hotel or assessment>_<YYYY-MM-DD>_result.pdf" / "_answers.pdf" in
      safe ASCII (v2.8.1, council BUILD NOW 1: the tool's one name)
      (kind 'file': no suffix, for the JSON file's base name).
   3. draw(model, jsPDF, font) → { doc, pages, footers }: A4 for print. PDF redesign (24 Nov 2026): page 1 is the summary
      (hotel, use case, the verdict box in the verdict's colour, "Start with"); then the five questions, where it sits, the
      areas as a table, the action plan as a checklist by person, vendor questions, every answer as a
      two-column table, the method and the sources. A running header (tool, hotel, date) from page 2, a footer with
      "page n of N" on every page. Each block is measured before it is drawn: a block never splits and a heading always
      keeps its first lines with it. */
(function (root) {
  'use strict';
  var C = root.R2Content, L = root.R2Logic;
  var TITLE = 'Can AI solve your problems? Result', TITLE_ANSWERS = 'Can AI solve your problems? Your answers', TITLE_STOP = 'Can AI solve your problems? Not suitable for AI'; // v2.1 (audit L7): the screen's own title; the stop PDF has no score
  var LINE = 'Student prototype by EHL SBP Group 36 for HFTP. Questions, rules and content as of ' + C.AS_OF + '. Version ' + C.VERSION_LINE + '.';
  /* v2.7.0 (owner): the footer of every page is the disclaimer (the data file's fixed text), then the page number */
  /* v2.8.2 (owner): the footer is the page number only; the disclaimer stands once, at the end of each document */
  var FOOT_L = '', FOOT = 'page ';

  function head(m, stop, use, title, extra) {
    var b = [{ k: 'title', t: title || (stop ? TITLE_STOP : TITLE) }];
    if (m.hotel) b.push({ k: 'meta', t: 'Hotel: ' + m.hotel });
    if (use) b.push({ k: 'meta', t: 'Use case: ' + use });
    if (m.filledBy) b.push({ k: 'meta', t: 'Filled in by: ' + m.filledBy });
    b.push({ k: 'meta', t: 'Date: ' + m.date });
    (extra || []).forEach(function (t) { b.push({ k: 'meta', t: t }); });
    b.push({ k: 'meta', t: LINE, note: true });
    return b;
  }
  /* v2.5.1: each of the five answers with what it means for this decision (R2Logic.aiMeaning), as on the result card.
     v2.6: the tone follows the meaning (a.good), so question 1 No is drawn in the good tone. */
  /* v2.8.0 (B5): the pill is the condition (Met / Not met / To find out); the answer is said under it */
  function answers(m) { return m.answers.map(function (a) { return { k: 'q', n: a.n, t: a.title + ': ' + a.q, title: a.title, q: a.q, a: 'Your answer: ' + a.a, val: a.cond, tone: a.good === true ? 'hi' : a.good === false ? 'lo' : a.state === 'u' ? 'md' : 'na', m: 'Your answer: ' + a.a + '. ' + L.aiMeaningText(a) }; }); }
  function endNote() { return { k: 'p', t: C.DISCLAIMER, id: 'disclaimer', small: true }; } // v2.8.2: once, at the end
  var STATE_TONE = { yes: 'hi', planned: 'md', no: 'lo' };
  var LEVEL_TONE = { ready: 'hi', almost: 'md', notready: 'lo', noinfo: 'accent' };

  /* m: R2Logic.resultModel(rec, env). The words are the result page's own. kind: 'result' (default) | 'answers'. A stop is always the
     one-page stop version, whatever the kind (the stop screen has one PDF). No document carries sources (v2.7). */
  function model(rec, env, kind) {
    var v = L.verdict(rec.Q), m = L.resultModel(rec, env), run = { hotel: m.hotel, date: m.date }, use = v.stop ? '' : m.useName || (m.none ? m.path : '');
    if (v.stop) {
      return { stop: true, kind: 'result', run: run, blocks: head(m, true, '').concat([{ k: 'h', t: C.STOP.head, tone: 'lo' }, { k: 'p', t: C.STOP.why }, { k: 'lead', t: C.STOP.instead }, { k: 'p', t: C.STOP.unsure },
        { k: 'p', t: 'Because you answered Yes to: “' + L.QBY.q1.q + '”', small: true }, { k: 'label', t: 'Your five answers' }], answers(m), [endNote()]) };
    }
    return kind === 'answers' ? answersModel(m, run, use) : resultModel(m, run, use, srcData(rec, env));
  }

  /* Document 1: Result, Start with these three, Action plan by person, Questions for the vendor (v2.7.0: one section fewer). */
  /* v2.8.0 (owner decision 4): the use case's examples and sources go into the Result PDF, as on the page (labels, text, address). */
  function srcData(rec, env) { var d = env && env.detail && rec.use && rec.use !== 'none' ? env.detail[rec.use] : null; return d ? { srcs: L.srcList(d), thin: !!d.thin, srcNote: d.note || '' } : null; }
  function resultModel(m, run, use, sd) {
    var b = head(m, false, use);
    /* the box (verdict, score, the short reason line, the must-haves line), then the notes, then "Start with" */
    /* v2.8.0: the must-haves line first (B3), the box line once (B4), the step-2 "Also" line (B2) */
    b.push({ k: 'h', t: 'Result' }, { k: 'verdict', id: 'level', t: m.levelName + ' · ' + m.scoreHead, name: m.levelName, score: m.scoreHead, box: m.boxLine, also: m.alsoLine, sub: m.mustLine, tone: LEVEL_TONE[m.level] || 'accent' });
    /* the reason, the points and the caveat under the box (tests/logic.test.mjs reads this order) */
    if (m.reasonShown) b.push({ k: 'lead', t: m.reasonShown, id: 'reason', under: true });
    b.push({ k: 'p', t: m.scoreSub, small: true, id: 'score-sub' });
    if (m.pilot) b.push({ k: 'p', t: m.pilot, small: true, id: 'pilot' }); // v2.5, council BUILD NOW 11
    b.push({ k: 'p', t: m.levelLine });
    if (m.since) { b.push({ k: 'label', t: m.since.head }); m.since.lines.forEach(function (x) { b.push({ k: 'li', t: x }); }); }

    if (m.flag) b.push({ k: 'lead', t: m.flag, id: 'flag', tone: 'md', under: true }); // v2.7.0: the sensitive-area flag
    b.push({ k: 'h', t: m.firstLabel });
    if (m.cap) b.push({ k: 'p', t: m.cap, id: 'cap' });
    if (m.mustOnly) b.push({ k: 'p', t: m.mustOnly, id: 'must-only' });
    if (!m.first.length) b.push({ k: 'p', t: 'Every question is answered Yes.' });
    m.first.forEach(function (f, i) { b.push({ k: 'num', n: i + 1, t: (f.who ? f.who + ': ' : '') + f.text, who: f.who || '', body: f.text, sub: f.sub }); }); // v2.5: a hold (BUILD NOW 3) has no person
    if (m.nothingElse) b.push({ k: 'p', t: m.nothingElse, id: 'nothing-else' }); // v2.8.0 (B4)

    b.push({ k: 'h', t: 'Action plan by person' });
    if (!m.people.length) b.push({ k: 'p', t: 'Nothing open.' });
    m.people.forEach(function (p) { b.push({ k: 'label', t: p.name, person: true }); p.items.forEach(function (a) { b.push({ k: 'todo', t: a.text, sub: a.tag }); }); });

    if (m.vendor.length) { b.push({ k: 'h', t: 'Questions for the vendor' }); m.vendor.forEach(function (q, i) { b.push({ k: 'num', n: i + 1, t: q, body: q, sub: '' }); }); }
    if (sd) {
      b.push({ k: 'h', t: 'Examples and sources (' + sd.srcs.length + ')', srcHead: true });
      if (!sd.srcs.length) b.push({ k: 'p', t: L.NO_SOURCE });
      L.sourceLines(sd).forEach(function (x) { b.push({ k: 'src', t: x.text, badges: x.badges, url: x.url, label: x.label }); });
      if (sd.thin) b.push({ k: 'p', t: L.THIN, id: 'thin' });
      if (sd.srcNote) b.push({ k: 'p', t: sd.srcNote, small: true, id: 'src-note' });
    }

    b.push(endNote());
    return { stop: false, kind: 'result', run: run, blocks: b };
  }

  /* Document 2: a short summary, then every question with the answer given, grouped by step and area. An answer saved before v2.3 that
     is no longer offered reads "Not answered". The scoring method (the first three lines of "How this was worked out") stands under
     the summary: plain lines, they fit on page 1 (tests/pdf.test.mjs checks that). */
  function answersModel(m, run, use) {
    var b = head(m, false, use, TITLE_ANSWERS, ['Result: ' + m.levelName + ' · ' + m.scoreHead]);
    if (m.flag) b.push({ k: 'lead', t: m.flag, id: 'flag', tone: 'md' }); // v2.7.0
    b.push({ k: 'label', t: 'How the score was worked out' }); m.method.slice(0, 3).forEach(function (t) { b.push({ k: 'li', t: t, small: true }); });
    b.push({ k: 'h', t: 'Every question and your answer' });
    b.push({ k: 'label', t: 'Step 2: ' + C.STEP2_HEAD, group: true });
    m.answers.forEach(function (a) { b.push({ k: 'item', id: a.id, name: a.title, check: a.q, ex: '', answer: 'Your answer: ' + a.a, val: a.a + (a.state ? ' (' + a.cond + ')' : ''), tone: a.good === true ? 'hi' : a.good === false ? 'lo' : a.state === 'u' ? 'md' : 'na', action: '' }); });
    var grp = '';
    m.itemList.forEach(function (it, i) {
      var raw = m.ev.items[i], g = it.grp === 'must' ? 'Step 3: Must-haves' : 'Step 5: ' + it.name;
      if (g !== grp) { grp = g; b.push({ k: 'label', t: g, group: true }); }
      var val = raw && raw.old ? 'Not answered' : it.answer;
      b.push({ k: 'item', id: it.key, name: it.grp === 'must' ? it.name : it.q, check: it.grp === 'must' ? it.q : '', ex: '', answer: 'Your answer: ' + val, val: val, tone: raw && raw.old ? 'na' : STATE_TONE[it.state] || 'na', action: '' });
    });
    b.push(endNote());
    return { stop: false, kind: 'answers', run: run, blocks: b };
  }

  /* Safe ASCII file name: accents dropped (é → e), anything else becomes one hyphen, at most 60 characters. */
  function slug(s) {
    s = String(s == null ? '' : s);
    if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/[ßæøœłđþ]/gi, function (c) { return { ß: 'ss', æ: 'ae', ø: 'o', œ: 'oe', ł: 'l', đ: 'd', þ: 'th', Æ: 'AE', Ø: 'O', Œ: 'OE', Ł: 'L', Đ: 'D', Þ: 'Th' }[c] || ''; });
    return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
  }
  function fileName(hotel, today, kind) {
    var d = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : L.localIso(); // v1.2: local day
    return 'Can-AI-solve-your-problems_' + (slug(hotel) || 'assessment') + '_' + d + (kind === 'file' ? '' : kind === 'answers' ? '_answers' : '_result') + '.pdf';
  }
  function footer(i, n) { return FOOT + i + ' of ' + n; }
  /* Characters the embedded font can print (Latin, Latin-1, Extended-A/-B, general punctuation, euro, arrows); others → '?'. */
  function safe(s) { return String(s == null ? '' : s).replace(/[^\u0000-ɏ‐-⁞€™←-↓]/g, '?'); }

  /* The tool's colours (src/style.css, light theme) and the type scale: title 20, heading 12.5, body 9.5, small 8 (pt). */
  var COL = { ink: [21, 24, 29], ink2: [71, 76, 85], ink3: [99, 103, 111], line: [222, 220, 212], line2: [236, 234, 227], bg: [245, 244, 239],
    accent: [30, 78, 140], accentS: [227, 235, 246], hi: [31, 111, 67], hiS: [225, 240, 231], md: [126, 87, 0], mdS: [250, 239, 213],
    lo: [163, 57, 42], loS: [248, 225, 220], na: [95, 100, 109], naS: [236, 236, 233] };
  var SZ = { title: 20, verdict: 17, h: 12.5, body: 9.5, small: 8 };
  var PAGE = { W: 210, H: 297, M: 20, TOP: 25, BOT: 297 - 22 };
  /* Blocks that must stand with what follows them (no heading as the last line of a page). */
  function sticky(b) { return b && (b.k === 'h' || b.k === 'label' || b.k === 'lead' && !b.under || b.k === 'p' && b.keep); }

  /* jsPDF: the constructor's namespace (window.jspdf); font: { regular, bold } base64 TTF, or null for Helvetica. */
  function draw(m, jspdf, font) {
    var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = PAGE.W, H = PAGE.H, M = PAGE.M, TW = W - 2 * M, TOP = PAGE.TOP, BOT = PAGE.BOT, y = 20, FACE = 'helvetica';
    var DRY = false, table = false, blocks = m.blocks, SP = m.stop ? 0.5 : 1; /* the stop version is one page: tighter gaps */
    function g(v) { return v * SP; }
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
    /* Wrapped text, one line at a time from y; returns the number of lines. */
    function para(t, x, w, size, style, col) {
      f(style, size, col); var ls = doc.splitTextToSize(safe(t), w);
      ls.forEach(function (l) { if (!DRY) doc.text(l, x, y + lh(size) * 0.74); y += lh(size); });
      return ls.length;
    }
    function right(t, xr, base, size, style, col) { f(style, size, col); var s = safe(t); if (!DRY) doc.text(s, xr - doc.getTextWidth(s), base); }
    function measure(fn) { var d = DRY, y0 = y; DRY = true; fn(); var h = y - y0; y = y0; DRY = d; return h; }
    function tick(x) { if (!DRY) { stroke('ink3', 0.3); doc.rect(x, y + 0.7, 3.2, 3.2); } }
    function pill(t, tone, xr) { /* the answer in its colour, right-aligned in a soft box */
      f('bold', SZ.small, tone); var s = safe(t), w = Math.min(doc.getTextWidth(s) + 4, 40);
      if (!DRY) { fill(tone + 'S'); doc.roundedRect(xr - w, y + 0.2, w, 5, 1, 1, 'F'); }
      var ls = doc.splitTextToSize(s, 36); if (!DRY) ls.forEach(function (l, i) { doc.text(l, xr - w + 2, y + 3.6 + i * lh(SZ.small)); });
      return ls.length;
    }
    function thead() { /* the column heads of the answers table, again on each page it runs on */
      if (!DRY) { fill('bg'); doc.rect(M, y, TW, 6.5, 'F'); }
      f('bold', SZ.small, 'ink3'); if (!DRY) { doc.text('Question', M + 2, y + 4.4); doc.text('Your answer', W - M - 52, y + 4.4); } y += 6.5;
    }
    function newPage() { doc.addPage(); y = TOP; if (table) thead(); }
    function atTop() { return y <= TOP + 0.5 + (table ? 6.5 : 0); }

    function render(b) {
      var x, top;
      switch (b.k) {
        case 'title': para(b.t, M, TW, SZ.title, 'bold', 'ink'); y += g(3); break;
        case 'meta':
          if (b.note) { y += g(1.5); para(b.t, M, TW, SZ.small, 'normal', 'ink3'); y += g(1); break; }
          var c = b.t.indexOf(': '); f('normal', SZ.body, 'ink3'); if (!DRY) doc.text(safe(b.t.slice(0, c + 1)), M, y + lh(SZ.body) * 0.74);
          para(b.t.slice(c + 2), M + 26, TW - 26, SZ.body, 'normal', 'ink'); y += g(0.6); break;
        case 'h':
          if (b.tone) { /* the stop version: the verdict band in red */
            y += g(6); top = y; var hh = measure(function () { y += g(5); para(b.t, M + 7, TW - 12, SZ.verdict, 'bold', b.tone); y += g(5); });
            if (!DRY) { fill(b.tone + 'S'); doc.rect(M, top, TW, hh, 'F'); fill(b.tone); doc.rect(M, top, 1.6, hh, 'F'); }
            y += g(5); para(b.t, M + 7, TW - 12, SZ.verdict, 'bold', b.tone); y += g(5); y += g(4); break;
          }
          if (!atTop()) y += g(8); if (!DRY) table = false;
          para(b.t, M, TW, SZ.h, 'bold', 'ink'); y += g(1.6); rule(M, W - M, 'line', 0.3); y += g(3.4); break;
        case 'verdict': {
          var inner = function () {
            y += g(6); para(b.name, M + 7, TW - 14, SZ.verdict, 'bold', b.tone); y += g(1.2);
            para(b.sub, M + 7, TW - 14, SZ.body, 'bold', 'ink'); y += g(1.2); // v2.8.0 (B3): the must-haves line first, in bold
            para(b.score, M + 7, TW - 14, SZ.body, 'normal', 'ink2');
            if (b.box || b.also) { y += g(2.4); rule(M + 7, W - M - 7, b.tone, 0.15); y += g(2.4); }
            if (b.box) para(b.box, M + 7, TW - 14, SZ.body, 'bold', b.tone);
            if (b.also) { if (b.box) y += g(1.2); para(b.also, M + 7, TW - 14, SZ.body, 'bold', 'ink'); }
            y += g(5.5);
          };
          top = y; var vh = measure(inner);
          if (!DRY) { fill(b.tone + 'S'); doc.rect(M, top, TW, vh, 'F'); fill(b.tone); doc.rect(M, top, 1.6, vh, 'F'); }
          inner(); y += g(4); break;
        }
        case 'lead': para(b.t, M, TW, SZ.body, 'bold', b.tone || 'ink'); y += g(2); break;
        case 'label':
          if (b.person) { y += g(4); para(b.t, M, TW, SZ.body, 'bold', 'ink'); y += g(1); rule(M, W - M, 'line2', 0.25); y += g(2); break; }
          if (b.group) { if (!table) { y += g(1); thead(); if (!DRY) table = true; } y += g(1.5); top = y; if (!DRY) { fill('line2'); doc.rect(M, top, TW, 6, 'F'); } y += g(1); para(b.t, M + 2, TW - 4, SZ.small, 'bold', 'ink2'); y = top + 6 + 1; break; }
          y += g(3); para(b.t, M, TW, SZ.small, 'bold', 'ink3'); y += g(1.4); break;
        case 'p': para(b.t, M, TW, b.small ? SZ.small : SZ.body, 'normal', b.small ? 'ink3' : 'ink2'); y += b.small ? 1.6 : 2; break;
        case 'li': {
          var sz = b.small ? SZ.small : SZ.body; f('normal', sz, 'ink3'); if (!DRY) doc.text('–', M + 0.5, y + lh(sz) * 0.74);
          para(b.t, M + 5, TW - 5, sz, 'normal', 'ink'); y += 1.4; break;
        }
        case 'todo': tick(M + 0.3); para(b.t, M + 7, TW - 7, SZ.body, 'normal', 'ink'); if (b.sub) { y += g(0.3); para(b.sub, M + 7, TW - 7, SZ.small, 'normal', 'ink3'); } y += g(2.6); break;
        case 'num': {
          x = M + 7;
          f('bold', SZ.body, 'accent'); if (!DRY) doc.text(String(b.n) + '.', M, y + lh(SZ.body) * 0.74);
          var w = TW - 7;
          if (b.who) { para(b.who, x, w, SZ.small, 'bold', 'ink3'); y += g(0.2); }
          para(b.body, x, w, SZ.body, 'normal', 'ink'); if (b.sub) { y += g(0.3); para(b.sub, x, w, SZ.small, 'normal', 'ink3'); } y += g(3); break;
        }
        case 'q': {
          y += g(0.6); rule(M, W - M, 'line2', 0.25); y += g(2.4); top = y;
          f('bold', SZ.body, 'accent'); if (!DRY) doc.text(String(b.n) + '.', M, y + lh(SZ.body) * 0.74);
          para(b.title, M + 7, TW - 52, SZ.body, 'bold', 'ink'); var yA = y; y = top; pill(b.val, b.tone, W - M); y = Math.max(yA, top + 5.2);
          para(b.q, M + 7, TW - 7 - 30, SZ.body, 'normal', 'ink2');
          if (b.m) { y += g(0.8); para(b.m, M + 7, TW - 7, SZ.small, 'normal', 'ink3'); } y += g(2); break;
        }
        case 'area': {
          top = y; var rowH = lh(SZ.body) + 4;
          para(b.name, M, 56, SZ.body, 'bold', 'ink'); var y1 = y;
          if (!DRY) { fill('line2'); doc.rect(M + 60, top + 1.6, 32, 2.4, 'F'); if (b.share) { fill(b.tone); doc.rect(M + 60, top + 1.6, 32 * b.share / 100, 2.4, 'F'); } }
          y = top; para(b.rest, M + 98, TW - 98, SZ.small, 'normal', 'ink2');
          y = Math.max(y, y1, top + rowH - 2.6) + 1.3; rule(M, W - M, 'line2', 0.25); y += g(1.3); break;
        }
        case 'src': { /* v2.8.0: one source: its labels, its text, its address */
          if (b.badges) { para(b.badges, M, TW, SZ.small, 'bold', 'ink3'); y += 0.4; }
          para(b.t, M, TW, SZ.small, 'normal', 'ink');
          if (b.url) { y += 0.3; f('normal', SZ.small, 'accent'); if (!DRY) doc.textWithLink(safe(b.label || b.url), M, y + lh(SZ.small) * 0.74, { url: b.url }); y += lh(SZ.small); } // v2.8.2: a short label, the full address in the link
          y += g(2.2); break;
        }
        case 'item': {
          top = y + 1.8; y = top;
          para(b.name, M + 2, TW - 60, SZ.body, b.check ? 'bold' : 'normal', 'ink'); if (b.check) { y += g(0.2); para(b.check, M + 2, TW - 60, SZ.small, 'normal', 'ink2'); } var y2 = y;
          y = top; f('bold', SZ.small, b.tone); var vl = doc.splitTextToSize(safe(b.val), 50);
          vl.forEach(function (l) { if (!DRY) doc.text(l, W - M - 52, y + lh(SZ.small) * 0.74 + 0.4); y += lh(SZ.small); });
          y = Math.max(y, y2) + 1.8; rule(M, W - M, 'line2', 0.25); break;
        }
      }
    }

    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.k === 'page') { if (y > TOP + 0.5) newPage(); continue; }
      /* keep a heading (or a run of headings) with the first block after it */
      var need = measure(function () { render(b); }), j = i;
      while ((sticky(blocks[j]) || blocks[j].k === 'area') && blocks[j + 1] && blocks[j + 1].k !== 'page' && (sticky(blocks[j]) || blocks[j + 1].k === 'area')) { j++; need += measure((function (nb) { return function () { render(nb); }; })(blocks[j])); }
      if (y + need > BOT && !atTop()) newPage();
      render(b);
    }

    var n = doc.getNumberOfPages(), footers = [], hd = safe(['Can AI solve your problems?', m.run && m.run.hotel, m.run && m.run.date].filter(Boolean).join(' · '));
    for (var p = 1; p <= n; p++) {
      doc.setPage(p); var ft = footer(p, n); footers.push(ft);
      stroke('line', 0.2); doc.line(M, H - 15, W - M, H - 15);
      right('page ' + p + ' of ' + n, W - M, H - 10.5, SZ.small, 'normal', 'ink3');
      if (p > 1) { /* the running header */
        f('normal', SZ.small, 'ink3'); var hl = doc.splitTextToSize(hd, TW - 4); doc.text(hl[0] + (hl.length > 1 ? '…' : ''), M, 12.5);
        stroke('line', 0.2); doc.line(M, 15, W - M, 15);
      }
    }
    return { doc: doc, pages: n, footers: footers };
  }

  var api = { TITLE: TITLE, TITLE_ANSWERS: TITLE_ANSWERS, TITLE_STOP: TITLE_STOP, LINE: LINE, FOOT_L: FOOT_L, PAGE: PAGE, sticky: sticky, model: model, fileName: fileName, slug: slug, footer: footer, safe: safe, draw: draw };
  root.R2Pdf = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
