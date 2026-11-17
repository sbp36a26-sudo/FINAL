/* AI Assessment Tool – one-page PDF report (A4 portrait, jsPDF).
   Every block has a fixed height and text is clipped to a line budget,
   so the report can never spill onto a second page. */
(function (root) {
  'use strict';

  var C = {
    ink: [15, 23, 32], ink2: [74, 83, 97], muted: [123, 132, 148],
    line: [221, 225, 231], track: [235, 238, 242], accent: [42, 120, 214],
    ok: [0, 110, 0], warn: [150, 98, 0], crit: [200, 50, 50],
    LOW: [134, 182, 239], MEDIUM: [42, 120, 214], HIGH: [16, 66, 129], NONE: [150, 156, 166]
  };
  var PILL_TEXT = { LOW: [15, 23, 32], MEDIUM: [255, 255, 255], HIGH: [255, 255, 255], NONE: [255, 255, 255] };
  var MAP = { '\u0141': 'L', '\u0142': 'l', '\u0110': 'D', '\u0111': 'd', '\u0126': 'H', '\u0127': 'h', '\u0131': 'i', '\u0166': 'T', '\u0167': 't', '\u014a': 'N', '\u014b': 'n', '\u013f': 'L', '\u0140': 'l' };
  var WIN_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';

  // Keep text inside the WinAnsi set the built-in Helvetica can draw.
  function clean(s) {
    if (s === null || s === undefined) return '';
    s = String(s).replace(/\r/g, '').replace(/≥/g, '>=').replace(/≤/g, '<=')
      .replace(/[→⇒]/g, '->').replace(/ /g, ' ').replace(/[​-‍﻿]/g, '');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], code = s.charCodeAt(i);
      if (code === 10 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255) || WIN_EXTRA.indexOf(ch) >= 0) { out += ch; continue; }
      if (MAP[ch]) { out += MAP[ch]; continue; }
      var base = ch.normalize ? ch.normalize('NFD').replace(/[̀-ͯ]/g, '') : ch;
      var bc = base.charCodeAt(0);
      out += (base && ((bc >= 32 && bc <= 126) || (bc >= 160 && bc <= 255))) ? base : '?';
    }
    return out;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    return m ? m[3] + '.' + m[2] + '.' + m[1] : String(iso);
  }
  function fmtDateTime(d) {
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function build(JsPDF, input) {
    var E = input.engine, a = input.assessment, ev = input.ev, fw = input.framework;
    var info = a.info || {}, cl = ev.classification;
    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    var L = 16, R = 194, W = R - L;

    function font(style, size, color) { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor.apply(doc, color || C.ink); }
    function hair(y) { doc.setDrawColor.apply(doc, C.line); doc.setLineWidth(0.25); doc.line(L, y, R, y); }
    function fit(text, width) {
      text = clean(text);
      if (doc.getTextWidth(text) <= width) return text;
      while (text.length > 1 && doc.getTextWidth(text + '…') > width) text = text.slice(0, -1);
      return text.replace(/\s+$/, '') + '…';
    }
    // Wrapped text clipped to maxLines; returns the y after the block.
    function para(text, x, y, width, maxLines, lineH) {
      var lines = doc.splitTextToSize(clean(text), width);
      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        lines[maxLines - 1] = fit(lines[maxLines - 1] + '…', width);
      }
      for (var i = 0; i < lines.length; i++) doc.text(lines[i], x, y + i * lineH);
      return y + lines.length * lineH;
    }
    function bar(x, y, w, h, value, color) {
      doc.setFillColor.apply(doc, C.track); doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
      if (value !== null && value !== undefined && value > 0) {
        var fw2 = Math.max(h, w * Math.min(value, 10) / 10);
        doc.setFillColor.apply(doc, color || C.accent); doc.roundedRect(x, y, fw2, h, h / 2, h / 2, 'F');
      }
    }

    doc.setProperties({
      title: clean('AI assessment - ' + (info.company || 'Company') + ' - ' + (info.interviewee || '')),
      subject: 'AI maturity and strategy assessment', creator: 'AI Assessment Tool', author: 'HFTP SBP Group 36'
    });

    // ---- 1. Header (y 14-39)
    font('bold', 7.5, C.muted);
    doc.text('AI ASSESSMENT  ·  INTERVIEW REPORT', L, 15.5, { charSpace: 0.3 });
    font('normal', 7.5, C.muted);
    doc.text(clean('ID ' + a.id + '  ·  Framework v' + (a.frameworkVersion || fw.version)), R, 15.5, { align: 'right' });
    font('bold', 18, C.ink);
    doc.text(fit(info.company || 'Unnamed company', W), L, 24);
    font('normal', 9, C.ink2);
    var who = [info.interviewee, info.position].filter(Boolean).join(', ');
    var when = info.date ? 'Interviewed ' + fmtDate(info.date) + (info.interviewer ? ' by ' + info.interviewer : '') : (info.interviewer ? 'Interviewer: ' + info.interviewer : '');
    doc.text(fit([who, when].filter(Boolean).join('  ·  '), W), L, 30.5);
    font('normal', 8, C.muted);
    var seg = [info.industry, info.operatorType, info.operatingModel, info.tier, info.country,
      info.hotels ? info.hotels + ' hotel' + (Number(info.hotels) === 1 ? '' : 's') : '',
      info.rooms ? info.rooms + ' rooms' : ''].filter(Boolean).join('  ·  ');
    doc.text(fit(seg || 'Segment not recorded', W), L, 35.5);
    hair(39.5);

    // ---- 2. Result (y 43-80)
    var bucket = cl.final || 'NONE';
    font('normal', 8, C.muted); doc.text('Overall AI score', L, 47);
    font('bold', 32, C.ink);
    var big = (ev.overall === null || !ev.complete) ? '–' : E.fmt1(ev.overall);
    doc.text(big, L, 62);
    var bw = doc.getTextWidth(big);
    font('normal', 11, C.muted); doc.text('/ 10', L + bw + 2, 62);
    font('normal', 7.5, C.muted);
    var compl = ev.complete ? (ev.partial ? 'Partial: ' : 'Complete: ') + ev.assessedCount + ' of ' + ev.categoryCount + ' categories scored'
      : 'Incomplete: ' + ev.assessedCount + ' of ' + ev.categoryCount + ' categories scored';
    doc.text(clean(compl), L, 69);

    var px = 72;
    font('normal', 8, C.muted); doc.text('Bucket', px, 47);
    doc.setFillColor.apply(doc, C[bucket]); doc.roundedRect(px, 50, 44, 11, 1.6, 1.6, 'F');
    font('bold', bucket === 'NONE' ? 8.5 : 11, PILL_TEXT[bucket]);
    doc.text(bucket === 'NONE' ? 'NOT CLASSIFIED' : bucket, px + 22, 57.3, { align: 'center' });
    font('normal', 9, C.ink2);
    var purpose = [info.purpose1, info.purpose2].filter(Boolean).join(' + ');
    doc.text(fit(purpose ? purpose + (cl.final ? '' : '') : 'Purpose not recorded', 46), px, 66.5);
    if (cl.downgraded) { font('normal', 7.5, C.warn); doc.text(clean('Lowered from ' + cl.provisional + ' (requirements)'), px, 71.5); }
    else if (cl.unverified) { font('normal', 7.5, C.warn); doc.text('Unverified: data missing', px, 71.5); }

    var bx = 124, bwid = R - bx;
    [['maturity', 'AI Maturity', 47], ['strategy', 'AI Strategy', 59.5]].forEach(function (row) {
      var p = ev.pillars[row[0]];
      font('normal', 8.5, C.ink2); doc.text(row[1], bx, row[2]);
      var lw = doc.getTextWidth(row[1]);
      font('normal', 7, C.muted); doc.text(clean('  ' + p.assessedCount + ' of ' + p.total + ' categories'), bx + lw, row[2]);
      font('bold', 9.5, C.ink); doc.text(p.score === null ? '–' : E.fmt1(p.score), R, row[2], { align: 'right' });
      bar(bx, row[2] + 2, bwid, 3.2, p.score, C.accent);
    });
    font('normal', 7, C.muted);
    var wm = Number(fw.pillarWeights.maturity), ws = Number(fw.pillarWeights.strategy);
    var formula = (ev.overall === null || !ev.complete) ? 'Overall not calculated: each pillar needs at least ' + Math.min(Number(fw.completenessMin) || 1, 4) + ' scored categories' :
      'Overall = ' + E.round1(wm / (wm + ws) * 100) + '% × ' + E.fmt1(ev.pillars.maturity.score) + ' + ' + E.round1(ws / (wm + ws) * 100) + '% × ' + E.fmt1(ev.pillars.strategy.score) + ' = ' + E.fmt1(ev.overall);
    doc.text(fit(formula, bwid), bx, 76);
    hair(80.5);

    // ---- 3. Category breakdown (y 84-136)
    font('bold', 10, C.ink); doc.text('Category scores (0–10)', L, 87);
    var assessed = fw.categories.filter(function (c) { return ev.cats[c.key] && ev.cats[c.key].assessed; });
    if (assessed.length > 1) {
      var hi = assessed.reduce(function (m, c) { return ev.cats[c.key].tenths > ev.cats[m.key].tenths ? c : m; }, assessed[0]);
      var lo = assessed.reduce(function (m, c) { return ev.cats[c.key].tenths < ev.cats[m.key].tenths ? c : m; }, assessed[0]);
      if (ev.cats[hi.key].tenths !== ev.cats[lo.key].tenths) {
        font('normal', 7.5, C.muted);
        doc.text(fit('Strongest: ' + hi.name + ' (' + E.fmtScore(ev.cats[hi.key].score) + ')  ·  Weakest: ' + lo.name + ' (' + E.fmtScore(ev.cats[lo.key].score) + ')', 110), R, 87, { align: 'right' });
      }
    }
    var colW = 85;
    [['maturity', 'AI Maturity', L], ['strategy', 'AI Strategy', L + colW + 8]].forEach(function (col) {
      var x = col[2], y = 94;
      font('bold', 8.5, C.ink2); doc.text(col[1], x, y);
      var cats = fw.categories.filter(function (c) { return c.pillar === col[0]; });
      y += 6;
      cats.forEach(function (c) {
        var ci = ev.cats[c.key] || { assessed: false };
        var detail = '';
        if (ci.assessed && c.type === 'levels') detail = c.levels[ci.level].name;
        else if (ci.assessed && c.type === 'spending') detail = ci.exact ? E.fmtPct(ci.pct) + ' of IT budget' : String(ci.label || '').replace(' (range given)', ' (range)');
        else if (ci.assessed && c.type === 'span') detail = ci.live + ' live' + (ci.pilot ? ', ' + ci.pilot + ' pilot' : '') + ' of ' + ci.total;
        font('normal', 8.5, C.ink);
        var nm = clean(c.name);
        doc.text(nm, x, y);
        var nw = doc.getTextWidth(nm);
        if (detail) {
          font('normal', 7.2, C.muted);
          doc.text(fit('  ·  ' + detail, colW - nw - 12), x + nw, y);
        }
        font('bold', 8.5, ci.assessed ? C.ink : C.muted);
        doc.text(ci.assessed ? E.fmtScore(ci.score) : 'Not scored', x + colW, y, { align: 'right' });
        bar(x, y + 1.8, colW, 2.6, ci.assessed ? ci.score : null, C.accent);
        y += 9.5;
      });
    });
    hair(140);

    // ---- 4. Why this bucket (y 144-188)
    font('bold', 10, C.ink);
    doc.text(cl.final ? 'Why ' + cl.final : 'Why not classified', L, 147);
    if (cl.final) {
      font('normal', 7.5, C.muted);
      doc.text(clean('Score range: ' + cl.provisional + '   ·   Final bucket: ' + cl.final), R, 147, { align: 'right' });
    }
    font('normal', 8.5, C.ink2);
    var yR = para(cl.reason, L, 153, W, 3, 3.9);
    var steps = (cl.trail || []).slice(0, 2);
    if (cl.final && steps.length) {
      var y0 = yR + 2.5;
      steps.forEach(function (st, i) {
        var x = i === 0 ? L : L + colW + 8, y = y0;
        font('bold', 7.8, C.ink2); doc.text(st.bucket + ' requirements', x, y); y += 4.6;
        st.checks.slice(0, 5).forEach(function (ck) {
          var word = ck.status === 'met' ? 'Met' : ck.status === 'not_met' ? 'Not met' : 'Not verified';
          var col = ck.status === 'met' ? C.ok : ck.status === 'not_met' ? C.crit : C.warn;
          font('bold', 7.5, col); doc.text(word, x, y);
          font('normal', 7.5, C.ink2);
          var act = '';
          if (ck.actual !== null && ck.actual !== undefined) {
            if (ck.metric === 'spendPct') act = typeof ck.actual === 'number' ? ' (' + E.fmtPct(ck.actual) + ')' : ' (' + String(ck.actual).replace(' (range given)', '') + ')';
            else if (ck.metric === 'liveDepts') act = ' (' + ck.actual + ')';
            else act = ' (' + E.fmtScore(ck.actual) + ')';
          }
          doc.text(fit(ck.label + act, colW - 17), x + 16, y);
          y += 4.3;
        });
      });
    } else if (cl.final === 'LOW') {
      font('normal', 7.5, C.muted); doc.text('LOW has no minimum requirements.', L, yR + 3);
    }
    hair(190);

    // ---- 5. Key findings (y 194-258)
    font('bold', 10, C.ink); doc.text('Key findings', L, 197);
    var f = a.findings || {};
    var blocks = [
      [['Current AI adoption', f.adoption], ['Key strengths', f.strengths], ['Main weaknesses', f.weaknesses]],
      [['Strategic positioning', f.positioning], ['Potential opportunities', f.opportunities],
        ['Who decides on AI', [info.decisionMaker, a.scores && a.scores.decision && a.scores.decision.note].filter(Boolean).join(': ')]]
    ];
    blocks.forEach(function (col, ci) {
      var x = ci === 0 ? L : L + colW + 8, y = 203;
      col.forEach(function (blk) {
        font('bold', 7.2, C.muted); doc.text(clean(blk[0].toUpperCase()), x, y, { charSpace: 0.15 });
        font('normal', 8.2, blk[1] ? C.ink : C.muted);
        para(blk[1] || 'Not recorded', x, y + 4.1, colW, 4, 3.45);
        y += 18.6;
      });
    });
    hair(259.5);

    // ---- 6. Evidence (y 264-284)
    font('bold', 10, C.ink); doc.text('Evidence from the interview', L, 265);
    var quotes = (a.quotes || []).filter(function (q) { return q && q.text && String(q.text).trim(); }).slice(0, 3);
    var catName = {};
    fw.categories.forEach(function (c) { catName[c.key] = c.name; });
    var yq = 270.5, maxL = quotes.length >= 3 ? 1 : (quotes.length === 2 ? 2 : 3);
    if (!quotes.length) { font('normal', 8.2, C.muted); doc.text('No quotes recorded.', L, yq); }
    quotes.forEach(function (q) {
      var tag = q.category && catName[q.category] ? catName[q.category] + ': ' : '';
      font('italic', 8.2, C.ink2);
      var lines = doc.splitTextToSize(clean(tag + '\u201c' + String(q.text).trim() + '\u201d'), W);
      if (lines.length > maxL) { lines = lines.slice(0, maxL - 1).concat([fit(lines.slice(maxL - 1).join(' '), W)]); }
      lines.forEach(function (ln, i) { doc.text(ln, L, yq + i * 3.5); });
      yq += lines.length * 3.5 + 1.2;
    });

    // ---- Footer (y 288-292)
    hair(287.5);
    font('normal', 7, C.muted);
    doc.text('Confidential – HFTP SBP Group 36', L, 291.5);
    doc.text(clean('Generated ' + fmtDateTime(input.generatedAt || new Date()) + '  ·  Scored with framework v' + (a.frameworkVersion || fw.version)), R, 291.5, { align: 'right' });
    return doc;
  }

  function fileName(a) {
    var c = clean((a.info && a.info.company) || 'company').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'company';
    var d = (a.info && a.info.date) || '';
    return 'AI-assessment_' + c + (d ? '_' + d : '') + '_' + a.id + '.pdf';
  }

  var api = { build: build, clean: clean, fileName: fileName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AIReport = api;
})(typeof window !== 'undefined' ? window : globalThis);
