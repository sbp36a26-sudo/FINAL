/* Do you need AI? v2: the PDF of the result (pure; runs in the page and in the Node tests, tests/pdf.test.mjs).
   jsPDF and the "Register Sans" font subset (tools/register/fonts, SIL OFL 1.1) are inlined by build.mjs: nothing is loaded.
   1. model(rec, env) → the document as plain blocks, built from R2Logic.resultModel(rec, env), the same object the result
      page draws, so the PDF and the screen use the same words. env = { cat, TQ, RC, M, today }.
        blocks: { k: 'title' | 'meta' | 'h' | 'lead' | 'label' | 'p' | 'q' | 'li' | 'item' | 'num' | 'src', ... }
      Q1 No → the one-page stop version (why, the instead line, the five answers).
   2. fileName(hotel, today) → "Do-you-need-AI_<hotel or assessment>_<YYYY-MM-DD>.pdf" in safe ASCII.
   3. draw(model, jsPDF, font) → { doc, pages, footers }: A4, the footer on every page with "page n of N". */
(function (root) {
  'use strict';
  var C = root.R2Content, L = root.R2Logic;
  var TITLE = 'Do you need AI? Result', TITLE_STOP = 'Do you need AI? Not suitable for AI'; // v2.1 (audit L7): the screen's own title; the stop PDF has no score
  var LINE = 'Student prototype by EHL SBP Group 36 for HFTP. Not legal advice. Questions, rules and content as of ' + C.AS_OF + '.';
  var FOOT = 'Do you need AI? · student prototype, not legal advice · page ';

  function head(m, stop) {
    var b = [{ k: 'title', t: stop ? TITLE_STOP : TITLE }];
    if (m.hotel) b.push({ k: 'meta', t: 'Hotel: ' + m.hotel });
    if (m.filledBy) b.push({ k: 'meta', t: 'Filled in by: ' + m.filledBy });
    b.push({ k: 'meta', t: 'Date: ' + m.date }, { k: 'meta', t: LINE });
    return b;
  }
  function answers(m) { return m.answers.map(function (a) { return { k: 'q', n: a.n, t: a.title + ': ' + a.q, a: 'Your answer: ' + a.a }; }); }
  function sources(TQ, stop) {
    var S = C.SOURCES, b = [{ k: 'h', t: 'Sources' }], N = function (t) { return String(t).replace(/\{N\}/g, TQ ? TQ.matrixTotal : '').replace(/\{U\}/g, TQ ? TQ.nFromWorkbook + TQ.nDraft : '').replace(/\{D\}/g, TQ ? TQ.nDraft : ''); };
    (stop ? [['q', 'Is this an AI problem?']] : [['q', 'Is this an AI problem?'], ['must', 'Must-haves'], ['where', 'Where in the hotel?'], ['tailored', 'Questions for this use case'], ['result', 'Result']]).forEach(function (s) {
      b.push({ k: 'label', t: s[1] });
      if (S[s[0] + 'Note']) b.push({ k: 'p', t: N(S[s[0] + 'Note']), small: true });
      (S[s[0]] || []).forEach(function (t) { b.push({ k: 'src', t: N(t) }); });
    });
    return b;
  }

  /* m: R2Logic.resultModel(rec, env). The words are the result page's own. */
  function model(rec, env) {
    var v = L.verdict(rec.Q), m = L.resultModel(rec, env), b = head(m, v.stop);
    if (v.stop) {
      return { stop: true, blocks: b.concat([{ k: 'h', t: C.STOP.head }, { k: 'p', t: C.STOP.why }, { k: 'lead', t: C.STOP.instead }, { k: 'p', t: C.STOP.unsure },
        { k: 'p', t: 'Because you answered No to: “' + L.QBY.q1.q + '”', small: true }, { k: 'label', t: 'Your five answers' }], answers(m), sources(env.TQ, true)) };
    }
    b.push({ k: 'h', t: 'Result' }, { k: 'lead', t: m.levelName + ' · ' + m.scoreHead, id: 'level' }, { k: 'lead', t: m.reason, id: 'reason' }, { k: 'p', t: m.scoreSub, small: true, id: 'score-sub' }, { k: 'p', t: m.levelLine }, { k: 'p', t: m.mustLine, id: 'must-line' });
    if (m.law) b.push({ k: 'lead', t: m.law, id: 'law' });
    if (m.cap) b.push({ k: 'p', t: m.cap, id: 'cap' });
    if (m.mustOnly) b.push({ k: 'p', t: m.mustOnly, id: 'must-only' });
    if (m.draft) b.push({ k: 'p', t: m.draft, id: 'draft' });
    if (m.since) { b.push({ k: 'label', t: m.since.head }); m.since.lines.forEach(function (x) { b.push({ k: 'li', t: x }); }); }

    b.push({ k: 'h', t: m.firstLabel });
    if (!m.first.length) b.push({ k: 'p', t: 'Every question is answered Yes or does not apply.' });
    m.first.forEach(function (f, i) { b.push({ k: 'num', n: i + 1, t: f.who + ': ' + f.text, sub: f.sub }); });

    b.push({ k: 'h', t: 'Is this an AI problem?' }, { k: 'lead', t: m.ai.head });
    if (m.ai.second) b.push({ k: 'lead', t: m.ai.second });
    if (m.ai.carried.length) { b.push({ k: 'label', t: m.ai.carriedLabel }); m.ai.carried.forEach(function (x) { b.push({ k: 'li', t: x }); }); }
    if (m.ai.find.length) { b.push({ k: 'label', t: 'To find out' }); m.ai.find.forEach(function (x) { b.push({ k: 'li', t: x }); }); }
    if (m.ai.q1Unsure) b.push({ k: 'p', t: m.ai.q1Unsure });
    b.push({ k: 'label', t: 'Your five answers' }); b = b.concat(answers(m));

    b.push({ k: 'h', t: 'Where it sits' }, { k: 'lead', t: m.path });
    if (m.useTask) b.push({ k: 'p', t: m.useTask }, { k: 'p', t: m.useLevel });
    if (m.none) b.push({ k: 'p', t: m.none });

    b.push({ k: 'h', t: m.areasHead }); m.areas.forEach(function (a) { b.push({ k: 'li', t: a.line, id: 'area-' + a.k }); });

    b.push({ k: 'h', t: 'Action plan by person' });
    if (!m.people.length) b.push({ k: 'p', t: 'Nothing open.' });
    m.people.forEach(function (p) { b.push({ k: 'label', t: p.name }); p.items.forEach(function (a) { b.push({ k: 'li', t: a.text, sub: a.tag }); }); });

    if (m.vendor.length) { b.push({ k: 'h', t: 'Questions for the vendor' }); m.vendor.forEach(function (q, i) { b.push({ k: 'num', n: i + 1, t: q, sub: '' }); }); }

    if (m.legal) {
      b.push({ k: 'h', t: 'EU AI Act: provisional label' }, { k: 'p', t: m.legalNote, small: true }, { k: 'lead', t: m.legal.name + (m.legal.applies ? ' (' + m.legal.applies + ')' : '') }, { k: 'p', t: m.legal.why });
      m.legal.could.forEach(function (c) { b.push({ k: 'p', t: c, small: true }); });
      if (m.legal.itemsHead) b.push({ k: 'label', t: m.legal.itemsHead });
      else if (m.legal.items.length) b.push({ k: 'label', t: 'Items to check' });
      m.legal.items.forEach(function (i) { b.push({ k: 'li', t: i.text, sub: i.sub }); });
      if (m.legal.labour) b.push({ k: 'p', t: m.legal.labour, small: true });
      b.push({ k: 'p', t: m.legal.country, small: true });
    }

    b.push({ k: 'h', t: 'Every question and your answer' });
    var grp = '';
    m.itemList.forEach(function (it) { var g = it.grp === 'must' ? 'Must-haves' : 'Questions for this use case'; if (g !== grp) { grp = g; b.push({ k: 'label', t: g }); } b.push({ k: 'item', id: it.key, name: it.name, check: it.q, ex: '', answer: 'Your answer: ' + it.answer, action: '' }); });

    b.push({ k: 'h', t: 'How this was worked out' }); m.method.forEach(function (t) { b.push({ k: 'li', t: t }); });
    return { stop: false, blocks: b.concat(sources(env.TQ, false)) };
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

  /* jsPDF: the constructor's namespace (window.jspdf); font: { regular, bold } base64 TTF, or null for Helvetica. */
  function draw(m, jspdf, font) {
    var doc = new jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, M = 18, TW = W - 2 * M, BOT = H - 20, y = 22, FACE = 'helvetica';
    if (font && font.regular && font.bold) {
      doc.addFileToVFS('rs-regular.ttf', font.regular); doc.addFont('rs-regular.ttf', 'RegisterSans', 'normal');
      doc.addFileToVFS('rs-bold.ttf', font.bold); doc.addFont('rs-bold.ttf', 'RegisterSans', 'bold');
      FACE = 'RegisterSans';
    }
    function f(style, size, grey) { doc.setFont(FACE, style); doc.setFontSize(size); doc.setTextColor(grey == null ? 25 : grey); }
    function room(h) { if (y + h > BOT) { doc.addPage(); y = 20; } }
    var LH = function (size) { return size * 0.43; };
    /* Wrapped text at x; returns the lines' height. keep: extra room to keep with what follows (headings). */
    function text(t, x, size, style, grey, keep) {
      f(style, size, grey); var ls = doc.splitTextToSize(safe(t), TW - (x - M)), h = ls.length * LH(size);
      room(h + (keep || 0)); doc.text(ls, x, y + LH(size) * 0.75); y += h; return h;
    }
    m.blocks.forEach(function (b, i) {
      var next = m.blocks[i + 1];
      switch (b.k) {
        case 'title': text(b.t, M, 17, 'bold', 20); y += 2.5; break;
        case 'meta': text(b.t, M, 9, 'normal', 95); y += 0.8; break;
        case 'h':
          /* keep a heading with its first lines: more room when a count line and an item block follow */
          var n2 = m.blocks[i + 2]; y += 5; room(next && next.k === 'lead' && n2 && (n2.k === 'item' || n2.k === 'num' || n2.k === 'q') ? 48 : 24); doc.setDrawColor(200, 196, 188); doc.setLineWidth(0.3); doc.line(M, y, W - M, y); y += 3.5;
          text(b.t, M, 13, 'bold', 20, 12); y += 2; break;
        case 'lead': text(b.t, M, 10.5, 'bold', 25, next && next.k === 'item' ? 26 : 0); y += 1.8; break;
        case 'label': y += 1.5; text(b.t, M, 9.5, 'bold', 70, 8); y += 1; break;
        case 'p': text(b.t, M, b.small ? 8.8 : 9.8, 'normal', b.small ? 90 : 35); y += 1.6; break;
        case 'li': room(LH(9.8) + (b.sub ? LH(8.6) : 0)); f('normal', 9.8, 35); doc.text('–', M + 1, y + LH(9.8) * 0.75); text(b.t, M + 5, 9.8, 'normal', 35); if (b.sub) { y += 0.3; text(b.sub, M + 5, 8.6, 'normal', 100); } y += 1.2; break;
        case 'src': room(LH(8.8)); f('normal', 8.8, 90); doc.text('–', M + 1, y + LH(8.8) * 0.75); text(b.t, M + 5, 8.8, 'normal', 70); y += 0.8; break;
        case 'q': {
          f('normal', 9.8); var qh = doc.splitTextToSize(safe(b.t), TW - 6).length * LH(9.8) + LH(9.8) + 2; room(qh);
          f('bold', 9.8, 35); doc.text(String(b.n) + '.', M, y + LH(9.8) * 0.75); text(b.t, M + 6, 9.8, 'normal', 35); text(b.a, M + 6, 9.8, 'bold', 25); y += 2; break;
        }
        case 'item': {
          f('normal', 9.4); var ih = (doc.splitTextToSize(safe(b.check), TW - 3).length + (b.ex ? doc.splitTextToSize(safe(b.ex), TW - 3).length : 0) + (b.action ? doc.splitTextToSize(safe(b.action), TW - 3).length : 0) + 2) * LH(9.6) + 6; room(Math.min(ih, 60));
          y += 1.5; text(b.name, M, 10, 'bold', 25); y += 0.6; text(b.check, M + 3, 9.2, 'normal', 95); if (b.ex) { y += 0.3; text(b.ex, M + 3, 9.2, 'normal', 95); } y += 0.6;
          text(b.answer, M + 3, 9.6, 'bold', 35); if (b.action) { y += 0.4; text(b.action, M + 3, 9.6, 'normal', 35); } y += 2.2; break;
        }
        case 'num': {
          f('normal', 10); var nh = doc.splitTextToSize(safe(b.t), TW - 7).length * LH(10) + LH(8.8) + 3; room(nh);
          f('bold', 10, 25); doc.text(String(b.n) + '.', M, y + LH(10) * 0.75); text(b.t, M + 7, 10, 'normal', 25); if (b.sub) { y += 0.5; text(b.sub, M + 7, 8.8, 'normal', 95); } y += 2.5; break;
        }
      }
    });
    var n = doc.getNumberOfPages(), footers = [];
    for (var p = 1; p <= n; p++) {
      doc.setPage(p); f('normal', 8, 110); var ft = footer(p, n); footers.push(ft);
      doc.setDrawColor(200, 196, 188); doc.setLineWidth(0.2); doc.line(M, H - 14, W - M, H - 14); doc.text(safe(ft), M, H - 9.5);
    }
    return { doc: doc, pages: n, footers: footers };
  }

  var api = { TITLE: TITLE, TITLE_STOP: TITLE_STOP, LINE: LINE, model: model, fileName: fileName, slug: slug, footer: footer, safe: safe, draw: draw };
  root.R2Pdf = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
