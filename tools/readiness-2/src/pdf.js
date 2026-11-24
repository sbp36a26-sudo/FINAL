/* Do you need AI? v2: the PDF of the result (pure; runs in the page and in the Node tests, tests/pdf.test.mjs).
   jsPDF and the "Register Sans" font subset (tools/register/fonts, SIL OFL 1.1) are inlined by build.mjs: nothing is loaded.
   1. model(rec, env) → { stop, run: { hotel, date }, blocks }, built from R2Logic.resultModel(rec, env), the same object the
      result page draws, so the PDF and the screen use the same words. env = { cat, TQ, RC, M, today }.
        blocks: { k: 'title' | 'meta' | 'h' | 'verdict' | 'lead' | 'label' | 'p' | 'q' | 'li' | 'todo' | 'area' | 'item' | 'num' | 'src' | 'page', ... }
      Q1 No → the one-page stop version (why, the instead line, the five answers).
   2. fileName(hotel, today) → "Do-you-need-AI_<hotel or assessment>_<YYYY-MM-DD>.pdf" in safe ASCII.
   3. draw(model, jsPDF, font) → { doc, pages, footers }: A4 for print. PDF redesign (24 Nov 2026): page 1 is the summary
      (hotel, use case, the verdict box in the verdict's colour, "Start with"); then the five questions, where it sits, the
      areas as a table, the action plan as a checklist by person, vendor questions, the AI Act label, every answer as a
      two-column table, the method and the sources. A running header (tool, hotel, date) from page 2, a footer with
      "page n of N" on every page. Each block is measured before it is drawn: a block never splits and a heading always
      keeps its first lines with it. */
(function (root) {
  'use strict';
  var C = root.R2Content, L = root.R2Logic;
  var TITLE = 'Do you need AI? Result', TITLE_STOP = 'Do you need AI? Not suitable for AI'; // v2.1 (audit L7): the screen's own title; the stop PDF has no score
  var LINE = 'Student prototype by EHL SBP Group 36 for HFTP. Not legal advice. Questions, rules and content as of ' + C.AS_OF + '.';
  var FOOT_L = 'Do you need AI? · student prototype, not legal advice', FOOT = FOOT_L + ' · page ';

  function head(m, stop, use) {
    var b = [{ k: 'title', t: stop ? TITLE_STOP : TITLE }];
    if (m.hotel) b.push({ k: 'meta', t: 'Hotel: ' + m.hotel });
    if (use) b.push({ k: 'meta', t: 'Use case: ' + use });
    if (m.filledBy) b.push({ k: 'meta', t: 'Filled in by: ' + m.filledBy });
    b.push({ k: 'meta', t: 'Date: ' + m.date }, { k: 'meta', t: LINE, note: true });
    return b;
  }
  /* v2.5.1: each of the five answers with what it means for this decision (R2Logic.aiMeaning), as on the result card. */
  function answers(m) { return m.answers.map(function (a) { return { k: 'q', n: a.n, t: a.title + ': ' + a.q, title: a.title, q: a.q, a: 'Your answer: ' + a.a, val: a.a, tone: ({ y: 'hi', n: 'lo', u: 'md' })[a.state] || 'na', m: L.aiMeaningText(a) }; }); }
  function sources(TQ, stop) {
    var S = C.SOURCES, b = [{ k: 'h', t: 'Sources' }], N = function (t) { return String(t).replace(/\{N\}/g, TQ ? TQ.matrixTotal : '').replace(/\{U\}/g, TQ ? TQ.nFromWorkbook + TQ.nDraft : '').replace(/\{D\}/g, TQ ? TQ.nDraft : ''); };
    (stop ? [['q', 'Is this an AI problem?']] : [['q', 'Is this an AI problem?'], ['must', 'Must-haves'], ['where', 'Where in the hotel?'], ['tailored', 'Questions for this use case'], ['result', 'Result']]).forEach(function (s) {
      b.push({ k: 'label', t: s[1] });
      if (S[s[0] + 'Note']) b.push({ k: 'p', t: N(S[s[0] + 'Note']), small: true });
      (S[s[0]] || []).forEach(function (t) { b.push({ k: 'src', t: N(t) }); });
    });
    return b;
  }
  var STATE_TONE = { yes: 'hi', planned: 'md', no: 'lo' };
  var LEVEL_TONE = { ready: 'hi', almost: 'md', notready: 'lo', noinfo: 'accent' };

  /* m: R2Logic.resultModel(rec, env). The words are the result page's own. */
  function model(rec, env) {
    var v = L.verdict(rec.Q), m = L.resultModel(rec, env), run = { hotel: m.hotel, date: m.date };
    var b = head(m, v.stop, v.stop ? '' : m.useName || (m.none ? m.path : ''));
    if (v.stop) {
      return { stop: true, run: run, blocks: b.concat([{ k: 'h', t: C.STOP.head, tone: 'lo' }, { k: 'p', t: C.STOP.why }, { k: 'lead', t: C.STOP.instead }, { k: 'p', t: C.STOP.unsure },
        { k: 'p', t: 'Because you answered No to: “' + L.QBY.q1.q + '”', small: true }, { k: 'label', t: 'Your five answers' }], answers(m), sources(env.TQ, true)) };
    }
    /* Page 1, as the screen: the box (verdict, score, the short reason line, the must-haves line), then the notes, then "Start with". */
    b.push({ k: 'h', t: 'Result' }, { k: 'verdict', id: 'level', t: m.levelName + ' · ' + m.scoreHead, name: m.levelName, score: m.scoreHead, box: m.boxLine, sub: m.mustLine, tone: LEVEL_TONE[m.level] || 'accent' });
    /* the reason, the points and the caveat under the box (tests/logic.test.mjs reads this order) */
    b.push({ k: 'lead', t: m.reason, id: 'reason', under: true }, { k: 'p', t: m.scoreSub, small: true, id: 'score-sub' });
    if (m.pilot) b.push({ k: 'p', t: m.pilot, small: true, id: 'pilot' }); // v2.5, council BUILD NOW 11
    b.push({ k: 'p', t: m.levelLine });
    if (m.since) { b.push({ k: 'label', t: m.since.head }); m.since.lines.forEach(function (x) { b.push({ k: 'li', t: x }); }); }

    b.push({ k: 'h', t: m.firstLabel });
    if (m.assist) b.push({ k: 'lead', t: m.assist, id: 'assist' }); // v2.5, owner O3
    if (m.law) b.push({ k: 'p', t: m.law, id: 'law' });
    if (m.cap) b.push({ k: 'p', t: m.cap, id: 'cap' });
    if (m.mustOnly) b.push({ k: 'p', t: m.mustOnly, id: 'must-only' });
    if (m.draft) b.push({ k: 'p', t: m.draft, id: 'draft' });
    if (!m.first.length) b.push({ k: 'p', t: 'Every question is answered Yes.' });
    m.first.forEach(function (f, i) { b.push({ k: 'num', n: i + 1, t: (f.who ? f.who + ': ' : '') + f.text, who: f.who || '', body: f.text, sub: f.sub }); }); // v2.5: a hold (BUILD NOW 3) has no person
    b.push({ k: 'page' });

    b.push({ k: 'h', t: 'Is this an AI problem?' }, { k: 'lead', t: m.ai.head });
    if (m.ai.second) b.push({ k: 'lead', t: m.ai.second });
    /* v2.5.1: the conditions, the "to find out" list and the Q1 note now stand under each answer (answers(m)), as on the card. */
    b.push({ k: 'label', t: 'Your five answers and what each means' }); b = b.concat(answers(m));

    b.push({ k: 'h', t: 'Where it sits' }, { k: 'lead', t: m.path });
    if (m.useTask) { b.push({ k: 'p', t: m.useTask }); if (m.useHow) b.push({ k: 'p', t: m.useHow }); b.push({ k: 'p', t: m.useLevel, small: true }); if (m.catName) b.push({ k: 'p', t: m.catName, small: true }); }
    if (m.none) b.push({ k: 'p', t: m.none });

    b.push({ k: 'h', t: m.areasHead });
    m.areas.forEach(function (a) { b.push({ k: 'area', t: a.line, id: 'area-' + a.k, name: a.name, rest: a.line.slice(a.name.length + 2), share: a.yes ? Math.max(3, a.share) : 0, tone: ({ strong: 'hi', gaps: 'md', weak: 'lo' })[a.cls] || 'accent' }); });

    b.push({ k: 'h', t: 'Action plan by person' });
    if (!m.people.length) b.push({ k: 'p', t: 'Nothing open.' });
    m.people.forEach(function (p) { b.push({ k: 'label', t: p.name, person: true }); p.items.forEach(function (a) { b.push({ k: 'todo', t: a.text, sub: a.tag }); }); });

    if (m.vendor.length) { b.push({ k: 'h', t: 'Questions for the vendor' }); m.vendor.forEach(function (q, i) { b.push({ k: 'num', n: i + 1, t: q, body: q, sub: '' }); }); }

    if (m.legal) {
      b.push({ k: 'h', t: 'EU AI Act: provisional label' }, { k: 'p', t: m.legalNote, small: true }, { k: 'lead', t: m.legal.name + (m.legal.applies ? ' (' + m.legal.applies + ')' : ''), tone: 'accent' }, { k: 'p', t: m.legal.why });
      m.legal.could.forEach(function (c) { b.push({ k: 'p', t: c, small: true }); });
      if (m.legal.itemsHead) b.push({ k: 'label', t: m.legal.itemsHead });
      else if (m.legal.items.length) b.push({ k: 'label', t: 'Items to check' });
      m.legal.items.forEach(function (i) { b.push({ k: 'todo', t: i.text, sub: i.sub }); });
      if (m.legal.labour) b.push({ k: 'p', t: m.legal.labour, small: true });
      b.push({ k: 'p', t: m.legal.country, small: true });
    }

    b.push({ k: 'h', t: 'Every question and your answer' });
    var grp = '';
    m.itemList.forEach(function (it) { var g = it.grp === 'must' ? 'Must-haves' : 'Questions for this use case'; if (g !== grp) { grp = g; b.push({ k: 'label', t: g, group: true }); } b.push({ k: 'item', id: it.key, name: it.name, check: it.q, ex: '', answer: 'Your answer: ' + it.answer, val: it.answer, tone: STATE_TONE[it.state] || 'na', action: '' }); });

    b.push({ k: 'h', t: 'How this was worked out' }); m.method.forEach(function (t) { b.push({ k: 'li', t: t, small: true }); });
    return { stop: false, run: run, blocks: b.concat(sources(env.TQ, false)) };
  }

  /* Safe ASCII file name: accents dropped (é → e), anything else becomes one hyphen, at most 60 characters. */
  function slug(s) {
    s = String(s == null ? '' : s);
    if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/[ßæøœłđþ]/gi, function (c) { return { ß: 'ss', æ: 'ae', ø: 'o', œ: 'oe', ł: 'l', đ: 'd', þ: 'th', Æ: 'AE', Ø: 'O', Œ: 'OE', Ł: 'L', Đ: 'D', Þ: 'Th' }[c] || ''; });
    return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
  }
  function fileName(hotel, today) {
    var d = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : L.localIso(); // v1.2: local day
    return 'Do-you-need-AI_' + (slug(hotel) || 'assessment') + '_' + d + '.pdf';
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
  function sticky(b) { return b && (b.k === 'h' || b.k === 'label' || b.k === 'lead' && !b.tone && !b.under); }

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
      f('bold', SZ.small, 'ink3'); if (!DRY) { doc.text('Question', M + 2, y + 4.4); doc.text('Your answer', W - M - 44, y + 4.4); } y += 6.5;
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
            y += g(6); para(b.name, M + 7, TW - 14, SZ.verdict, 'bold', b.tone); y += g(0.8);
            para(b.score, M + 7, TW - 14, SZ.h, 'bold', 'ink');
            if (b.box) { y += g(1.6); para(b.box, M + 7, TW - 14, SZ.body, 'bold', b.tone); }
            y += g(2.4); rule(M + 7, W - M - 7, b.tone, 0.15); y += g(2.4);
            para(b.sub, M + 7, TW - 14, SZ.body, 'normal', 'ink2'); y += g(5.5);
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
        case 'li': case 'src': {
          var sz = b.small || b.k === 'src' ? SZ.small : SZ.body; f('normal', sz, 'ink3'); if (!DRY) doc.text('–', M + 0.5, y + lh(sz) * 0.74);
          para(b.t, M + 5, TW - 5, sz, 'normal', b.k === 'src' ? 'ink2' : 'ink'); y += b.k === 'src' ? 0.9 : 1.4; break;
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
        case 'item': {
          top = y + 1.8; y = top;
          para(b.name, M + 2, TW - 52, SZ.body, 'bold', 'ink'); y += g(0.2); para(b.check, M + 2, TW - 52, SZ.small, 'normal', 'ink2'); var y2 = y;
          y = top; f('bold', SZ.small, b.tone); var vl = doc.splitTextToSize(safe(b.val), 42);
          vl.forEach(function (l) { if (!DRY) doc.text(l, W - M - 44, y + lh(SZ.small) * 0.74 + 0.4); y += lh(SZ.small); });
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

    var n = doc.getNumberOfPages(), footers = [], hd = safe(['Do you need AI?', m.run && m.run.hotel, m.run && m.run.date].filter(Boolean).join(' · '));
    for (var p = 1; p <= n; p++) {
      doc.setPage(p); var ft = footer(p, n); footers.push(ft);
      stroke('line', 0.2); doc.line(M, H - 15, W - M, H - 15);
      f('normal', SZ.small, 'ink3'); doc.text(FOOT_L, M, H - 10.5); right('page ' + p + ' of ' + n, W - M, H - 10.5, SZ.small, 'normal', 'ink3');
      if (p > 1) { /* the running header */
        f('normal', SZ.small, 'ink3'); var hl = doc.splitTextToSize(hd, TW - 4); doc.text(hl[0] + (hl.length > 1 ? '…' : ''), M, 12.5);
        stroke('line', 0.2); doc.line(M, 15, W - M, 15);
      }
    }
    return { doc: doc, pages: n, footers: footers };
  }

  var api = { TITLE: TITLE, TITLE_STOP: TITLE_STOP, LINE: LINE, FOOT_L: FOOT_L, PAGE: PAGE, sticky: sticky, model: model, fileName: fileName, slug: slug, footer: footer, safe: safe, draw: draw };
  root.R2Pdf = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
