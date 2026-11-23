/* Readiness 2.0: the PDF of the assessment (pure; runs in the page and in the Node tests, tests/pdf.test.mjs).
   Built the way the readiness check, the AI Register and the AI Act guide make their PDFs: jsPDF and the "Register Sans"
   font subset (tools/register/fonts, SIL OFL 1.1) are inlined by build.mjs, so nothing is loaded from the internet.
   1. model(rec, cat, o) → the document as plain blocks, in the summary's own words (R2Logic shares them with the screen):
        o = { hotel: '' | name from the shared profile, today: 'YYYY-MM-DD' }
        blocks: { k: 'title' | 'meta' | 'h' | 'lead' | 'label' | 'p' | 'q' | 'li' | 'item' | 'num' | 'src', ... }
      Q1 No → the one-page stop version (why, the instead line, the five answers). No score anywhere.
   2. fileName(hotel, today) → "Readiness-2.0_<hotel or assessment>_<YYYY-MM-DD>.pdf" in safe ASCII.
   3. draw(model, jsPDF, font) → { doc, pages, footers }: A4, the footer on every page with "page n of N". */
(function (root) {
  'use strict';
  var C = root.R2Content, L = root.R2Logic;
  var TITLE = 'Readiness 2.0: is AI the answer, and where?';
  var LINE = 'Student prototype by EHL SBP Group 36 for HFTP. Not legal advice. Questions, rules and content as of ' + C.AS_OF + '.';
  var FOOT = 'Readiness 2.0 · student prototype, not legal advice · page ';
  var QWORD = {}; C.Q_ANSWERS.forEach(function (a) { QWORD[a[0]] = a[1]; });
  var AWORD = {}; C.ANSWERS.forEach(function (a) { AWORD[a[0]] = a[1]; });

  function head(o) {
    var b = [{ k: 'title', t: TITLE }];
    if (o.hotel) b.push({ k: 'meta', t: 'Hotel: ' + o.hotel });
    b.push({ k: 'meta', t: 'Date: ' + L.fmtDate(o.today) }, { k: 'meta', t: LINE });
    return b;
  }
  function answers(rec) {
    return C.QUESTIONS.map(function (q, i) { return { k: 'q', n: i + 1, t: q.q, a: 'Your answer: ' + (QWORD[rec.Q[q.id]] || 'Not answered') }; });
  }
  function items(list, rec) {
    return list.map(function (it) {
      var v = L.A_OK[rec.A[it.id]] ? rec.A[it.id] : 'k', by = v === 'pl' ? L.fmtDate(rec.By[it.id]) : '';
      var a = v === 'y' ? null : L.action(it.id, v, rec.By[it.id]);
      return { k: 'item', id: it.id, name: it.name + (it.key ? ' (must-have in the readiness check)' : ''), check: it.check,
        answer: 'Your answer: ' + AWORD[v] + (by ? ' (planned by ' + by + ')' : ''),
        action: a ? 'To do: ' + a.text + ' Usually: ' + a.who + '.' : 'In place: nothing to do.' };
    });
  }
  function sources() {
    var S = C.SOURCES, b = [{ k: 'h', t: 'Sources' }];
    [['q', 'Step 1, is this an AI problem?'], ['where', 'Step 1, where in the hotel?'], ['needs', 'Step 2, what you need'], ['success', 'Step 3, what makes it succeed']].forEach(function (s) {
      b.push({ k: 'label', t: s[1] });
      if (S[s[0] + 'Note']) b.push({ k: 'p', t: S[s[0] + 'Note'], small: true });
      (S[s[0]] || []).forEach(function (t) { b.push({ k: 'src', t: t }); });
    });
    return b;
  }

  function model(rec, cat, o) {
    o = o || {};
    var v = L.verdict(rec.Q), b = head(o);
    if (v.stop) {
      var q1 = L.QBY.q1;
      return { stop: true, blocks: b.concat([{ k: 'h', t: C.STOP.head }, { k: 'p', t: C.STOP.why }, { k: 'lead', t: C.STOP.instead },
        { k: 'p', t: 'Because you answered No to: “' + q1.q + '”', small: true }, { k: 'label', t: 'Your five answers' }], answers(rec)) };
    }
    var t = L.verdictText(v, true), A = rec.A, u = L.useOf(rec, cat);
    b.push({ k: 'h', t: '1. Is this an AI problem?' }, { k: 'lead', t: t.head });
    if (t.second) b.push({ k: 'lead', t: t.second });
    if (t.carried.length) { b.push({ k: 'label', t: t.carriedLabel }); t.carried.forEach(function (x) { b.push({ k: 'li', t: x }); }); }
    if (t.find.length) { b.push({ k: 'label', t: 'To find out' }); t.find.forEach(function (x) { b.push({ k: 'li', t: x }); }); }
    if (t.q1Unsure) b.push({ k: 'p', t: t.q1Unsure });
    b.push({ k: 'label', t: 'Your five answers' }); b = b.concat(answers(rec));

    b.push({ k: 'h', t: '2. Where it sits' }, { k: 'lead', t: L.pathParts(rec, cat).join(' › ') || 'Nothing chosen.' });
    if (u) b.push({ k: 'p', t: 'What AI does: ' + u.task }, { k: 'p', t: 'How common in hotels: ' + L.useLevel(u) + ' (Use-Case Catalogue rating).' });
    else b.push({ k: 'p', t: L.noneLine(cat.nUses) });

    var cN = L.counts(A, L.NEED_IDS), cF = L.counts(A, L.FACTOR_IDS);
    b.push({ k: 'h', t: '3. What you need' }, { k: 'lead', t: L.countLine(cN), id: 'count-needs' }); b = b.concat(items(C.NEEDS, rec));
    b.push({ k: 'h', t: '4. What makes it succeed' }, { k: 'lead', t: L.countLine(cF), id: 'count-success' }); b = b.concat(items(C.FACTORS, rec));

    var top = L.weakest(A, 3);
    b.push({ k: 'h', t: top.length ? L.firstLabel(top.length) : 'In short' }, { k: 'lead', t: L.overall(A).text, id: 'overall' });
    top.forEach(function (x, i) {
      var a = L.action(x.id, x.v, rec.By[x.id]);
      b.push({ k: 'num', n: i + 1, t: a.text, sub: a.name + ' · your answer: ' + L.ANS_WORD[x.v] + ' · usually: ' + a.who });
    });
    var why = L.checkWhyNot(rec, u);
    b.push({ k: 'h', t: 'Next step' }, { k: 'lead', t: 'Check one tool in detail in the Readiness check' + (why ? '.' : ': “' + u.n + '”.') });
    b.push({ k: 'p', t: why || 'The readiness check asks the detailed questions for “' + u.n + '” and gives a verdict and a to-do list by person. It is the next tab in the project hub.' });
    return { stop: false, blocks: b.concat(sources()) };
  }

  /* Safe ASCII file name: accents dropped (é → e), anything else becomes one hyphen, at most 60 characters. */
  function slug(s) {
    s = String(s == null ? '' : s);
    if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/[ßæøœłđþ]/gi, function (c) { return { ß: 'ss', æ: 'ae', ø: 'o', œ: 'oe', ł: 'l', đ: 'd', þ: 'th', Æ: 'AE', Ø: 'O', Œ: 'OE', Ł: 'L', Đ: 'D', Þ: 'Th' }[c] || ''; });
    return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
  }
  function fileName(hotel, today) {
    var d = /^\d{4}-\d{2}-\d{2}$/.test(today || '') ? today : new Date().toISOString().slice(0, 10);
    return 'Readiness-2.0_' + (slug(hotel) || 'assessment') + '_' + d + '.pdf';
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
        case 'li': room(LH(9.8)); f('normal', 9.8, 35); doc.text('–', M + 1, y + LH(9.8) * 0.75); text(b.t, M + 5, 9.8, 'normal', 35); y += 1.2; break;
        case 'src': room(LH(8.8)); f('normal', 8.8, 90); doc.text('–', M + 1, y + LH(8.8) * 0.75); text(b.t, M + 5, 8.8, 'normal', 70); y += 0.8; break;
        case 'q': {
          f('normal', 9.8); var qh = doc.splitTextToSize(safe(b.t), TW - 6).length * LH(9.8) + LH(9.8) + 2; room(qh);
          f('bold', 9.8, 35); doc.text(String(b.n) + '.', M, y + LH(9.8) * 0.75); text(b.t, M + 6, 9.8, 'normal', 35); text(b.a, M + 6, 9.8, 'bold', 25); y += 2; break;
        }
        case 'item': {
          f('normal', 9.4); var ih = (doc.splitTextToSize(safe(b.check), TW - 3).length + doc.splitTextToSize(safe(b.action), TW - 3).length + 2) * LH(9.6) + 6; room(Math.min(ih, 60));
          y += 1.5; text(b.name, M, 10, 'bold', 25); y += 0.6; text(b.check, M + 3, 9.2, 'normal', 95); y += 0.6;
          text(b.answer, M + 3, 9.6, 'bold', 35); y += 0.4; text(b.action, M + 3, 9.6, 'normal', 35); y += 2.2; break;
        }
        case 'num': {
          f('normal', 10); var nh = doc.splitTextToSize(safe(b.t), TW - 7).length * LH(10) + LH(8.8) + 3; room(nh);
          f('bold', 10, 25); doc.text(String(b.n) + '.', M, y + LH(10) * 0.75); text(b.t, M + 7, 10, 'normal', 25); y += 0.5; text(b.sub, M + 7, 8.8, 'normal', 95); y += 2.5; break;
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

  var api = { TITLE: TITLE, LINE: LINE, model: model, fileName: fileName, slug: slug, footer: footer, safe: safe, draw: draw };
  root.R2Pdf = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
