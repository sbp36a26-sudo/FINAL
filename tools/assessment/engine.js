/* AI Assessment Tool – scoring engine.
   Pure functions, no DOM. Shared by the page and the Node tests.
   All arithmetic runs in tenths (integers) so displayed numbers always add up. */
(function (root) {
  'use strict';

  var LEVEL_SCORES = [0, 2.5, 5, 7.5, 10];
  var BUCKETS = ['LOW', 'MEDIUM', 'HIGH'];
  var REQ_METRICS = ['liveDepts', 'spendPct', 'depth', 'strategy', 'maturity'];

  var DEFAULT_FRAMEWORK = {
    version: 1,
    note: 'Initial framework from the team whiteboard (6 Nov 2026)',
    pillarWeights: { maturity: 50, strategy: 50 },
    completenessMin: 3,
    thresholds: { medium: 4.0, high: 7.5 },
    requirements: {
      high: { liveDepts: 3, spendPct: 30, depth: 7.5, strategy: 5.0, maturity: null },
      medium: { liveDepts: 2, spendPct: 10, depth: null, strategy: null, maturity: null }
    },
    unknownPolicy: { high: 'fail', medium: 'flag' },
    zeroSpendScore: 0,
    spendingBands: [
      { key: 'lt5', min: 0, max: 5, score: 2.5 },
      { key: '5to10', min: 5, max: 10, score: 5 },
      { key: '10to25', min: 10, max: 25, score: 7.5 },
      { key: 'gte25', min: 25, max: null, score: 10 }
    ],
    pilotWeight: 0.5,
    departments: [
      { key: 'frontOffice', name: 'Front office' },
      { key: 'reservations', name: 'Reservations & distribution' },
      { key: 'revenue', name: 'Revenue management' },
      { key: 'salesMarketing', name: 'Sales & marketing' },
      { key: 'fnb', name: 'F&B' },
      { key: 'housekeeping', name: 'Housekeeping' },
      { key: 'maintenance', name: 'Maintenance' },
      { key: 'finance', name: 'Finance' },
      { key: 'hr', name: 'HR' }
    ],
    purposes: ['Profit-driven', 'Efficiency', 'Competitive pressure', 'Guest experience'],
    decisionMakers: ['CIO / IT', 'GM', 'Department head', 'Owner or asset manager', 'Brand', 'Management company'],
    categories: [
      {
        key: 'tech', pillar: 'maturity', type: 'levels', name: 'Tech foundation', weight: 1,
        question: 'How ready are the company’s systems to support AI?',
        levels: [
          { name: 'Old on-premises system', desc: 'Software on the hotel’s own servers; systems don’t share data; staff re-enter data by hand' },
          { name: 'Old and cloud, mostly separated', desc: 'Some cloud tools added, but the core is old; data moves by export or Excel' },
          { name: 'Mostly cloud, some connected', desc: 'Most software online; key systems linked (e.g. bookings into the property-management system), others not' },
          { name: 'Cloud systems with some APIs', desc: 'Systems with open connections; most data flows automatically; a new tool connects within weeks' },
          { name: 'Fully connected, easy AI plug-in', desc: 'Everything connected, often through one platform; a new AI tool plugs in within days' }
        ]
      },
      {
        key: 'spending', pillar: 'maturity', type: 'spending', name: 'AI spending', weight: 1,
        question: 'What share of the IT budget goes to AI?'
      },
      {
        key: 'span', pillar: 'maturity', type: 'span', name: 'Span across departments', weight: 1,
        question: 'In which departments is AI used?'
      },
      {
        key: 'depth', pillar: 'maturity', type: 'levels', name: 'Depth', weight: 1,
        question: 'How deeply is AI built into the work?',
        rule: 'Score the most advanced AI that is live in daily use; pilots don’t count.',
        levels: [
          { name: 'No AI', desc: 'No AI in use' },
          { name: 'Standalone tools', desc: 'Separate AI tools such as ChatGPT in a browser; results copied in by hand' },
          { name: 'AI built into existing software', desc: 'AI inside a system they already use, e.g. AI pricing in the revenue-management system' },
          { name: 'AI across systems', desc: 'AI connected to several systems; data passes between them automatically' },
          { name: 'Agentic', desc: 'AI agents carry out multi-step tasks across systems on their own; people supervise' }
        ]
      },
      {
        key: 'decision', pillar: 'strategy', type: 'levels', name: 'Decision-making', weight: 1,
        question: 'Who decides on AI, and how?',
        levels: [
          { name: 'Nobody', desc: 'No one decides; staff use tools on their own' },
          { name: 'Each department for itself', desc: 'Departments choose their own tools separately' },
          { name: 'One unplanned decision for all', desc: 'One person (e.g. GM or IT) decides for everyone, case by case, without a plan' },
          { name: 'One planned decision for all (GM/CIO)', desc: 'A named owner decides for everyone, following an AI plan' },
          { name: 'AI department', desc: 'A dedicated AI team: the CIO with representatives of the departments' }
        ]
      },
      {
        key: 'budgeting', pillar: 'strategy', type: 'levels', name: 'Budgeting', weight: 1,
        question: 'How is AI paid for?',
        levels: [
          { name: 'No budget for AI', desc: 'Nothing set aside for AI' },
          { name: 'Ad hoc, depends on needs', desc: 'Paid case by case from whichever budget has room' },
          { name: 'Annual dedicated budget for AI', desc: 'A fixed AI line in the yearly budget' },
          { name: 'Annual budget + multi-year plan', desc: 'AI investment planned beyond the current year' },
          { name: 'All of that + ROI tracked against budget', desc: 'Results are compared with what was spent' }
        ]
      },
      {
        key: 'training', pillar: 'strategy', type: 'levels', name: 'People training', weight: 1,
        question: 'How do staff learn to use AI?',
        levels: [
          { name: 'No training', desc: 'Staff get no help learning AI tools' },
          { name: 'Self-taught', desc: 'Staff learn tools on their own' },
          { name: 'Occasional training', desc: 'Sessions now and then, e.g. from the vendor at launch' },
          { name: 'Structured training', desc: 'A planned programme for the staff who use AI' },
          { name: 'New roles for AI', desc: 'Structured training plus roles created or hired for AI' }
        ]
      },
      {
        key: 'data', pillar: 'strategy', type: 'levels', name: 'Data & measurement', weight: 1,
        question: 'Is the data ready, and are AI results measured?',
        rule: 'When data and measurement are at different levels, score the level the weaker half supports and note the gap.',
        levels: [
          { name: 'No overview of data', desc: 'Nobody knows what data exists or where it sits' },
          { name: 'Data scattered across systems', desc: 'Data sits in separate systems and departments; pulled together by hand' },
          { name: 'Vague goals set for AI, not tracked', desc: 'AI tools have goals (“save time”) but no numbers are tracked' },
          { name: 'Clear data plan, some KPIs tracked', desc: 'A plan for connecting data; some KPIs measured' },
          { name: 'Unified data, KPIs monitored and relevant', desc: 'Data in one place (e.g. one guest profile); KPIs checked regularly and acted on' }
        ]
      }
    ]
  };

  // ---------- small helpers ----------
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toTenths(x) { return Math.round(x * 10 + 1e-9); }
  function round1(x) { return toTenths(x) / 10; }
  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    var n = typeof v === 'number' ? v : Number(String(v).replace(/['\s]/g, '').replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  function intOrNull(v) { var n = num(v); return n === null ? null : Math.round(n); }
  function hasReq(v) { return v !== null && v !== undefined && v !== '' && isFinite(Number(v)); }
  function fmt1(x) { return x === null || x === undefined ? '–' : (Math.round(x * 10) / 10).toFixed(1); }
  function fmtScore(x) {
    if (x === null || x === undefined) return '–';
    var t = Math.round(x * 10) / 10;
    return (t % 1 === 0) ? String(t) : t.toFixed(1);
  }
  function fmtPct(p) {
    if (p === null || p === undefined) return '–';
    var t = Math.round(p * 10) / 10;
    return (t % 1 === 0 ? String(t) : t.toFixed(1)) + '%';
  }

  function sortedBands(fw) {
    return (fw.spendingBands || []).slice().sort(function (a, b) { return a.min - b.min; });
  }
  function bandLabel(b, bands) {
    if (b.min === 0 || b === bands[0]) return 'Above 0% and under ' + fmtPct(b.max);
    if (b.max === null || b.max === undefined) return fmtPct(b.min) + ' and above';
    return fmtPct(b.min) + ' to under ' + fmtPct(b.max);
  }
  function bandFor(pct, fw) {
    var bands = sortedBands(fw);
    for (var i = bands.length - 1; i >= 0; i--) { if (pct >= bands[i].min - 1e-9) return bands[i]; }
    return bands[0];
  }

  // ---------- category information ----------
  function levelInfo(raw) {
    if (raw && typeof raw.level === 'number' && raw.level >= 0 && raw.level <= 4 && raw.level % 1 === 0) {
      return { assessed: true, score: LEVEL_SCORES[raw.level], level: raw.level };
    }
    return { assessed: false };
  }

  function spendingInfo(raw, fw) {
    if (!raw || !raw.mode) return { assessed: false };
    var bands = sortedBands(fw);
    var pct;
    if (raw.mode === 'none') {
      pct = 0;
    } else if (raw.mode === 'amounts') {
      var it = num(raw.itBudget), ai = num(raw.aiSpend);
      if (it === null || ai === null) return { assessed: false, error: 'Enter both the IT budget and the AI spending.' };
      if (!(it > 0)) return { assessed: false, error: 'The IT budget must be above 0.' };
      if (ai < 0) return { assessed: false, error: 'AI spending cannot be negative.' };
      pct = round1(ai / it * 100);
    } else if (raw.mode === 'percent') {
      var p = num(raw.percent);
      if (p === null) return { assessed: false, error: 'Enter a percentage.' };
      if (p < 0 || p > 100) return { assessed: false, error: 'Enter a percentage between 0 and 100.' };
      pct = round1(p);
    } else if (raw.mode === 'range') {
      var band = null;
      for (var i = 0; i < bands.length; i++) if (bands[i].key === raw.range) band = bands[i];
      if (!band) return { assessed: false, error: 'Pick a range.' };
      return {
        assessed: true, exact: false, score: band.score, band: band,
        pctMin: band.min, pctMax: (band.max === null || band.max === undefined) ? null : band.max,
        label: bandLabel(band, bands) + ' (range given)'
      };
    } else {
      return { assessed: false };
    }
    if (pct === 0) {
      return { assessed: true, exact: true, pct: 0, pctMin: 0, pctMax: 0, score: fw.zeroSpendScore || 0, label: '0% (no AI spending)' };
    }
    var b = bandFor(pct, fw);
    var warn = pct > 100 ? 'AI spending is higher than the IT budget. Check the amounts.' : null;
    return { assessed: true, exact: true, pct: pct, pctMin: pct, pctMax: pct, score: b.score, band: b, label: fmtPct(pct), warning: warn };
  }

  function spanInfo(raw, fw) {
    if (!raw || !raw.mode) return { assessed: false };
    var total, live = 0, pilot = 0;
    if (raw.mode === 'list') {
      var d = raw.depts || {}, unset = 0, na = 0;
      for (var i = 0; i < fw.departments.length; i++) {
        var v = d[fw.departments[i].key];
        if (v === 'live') live++;
        else if (v === 'pilot') pilot++;
        else if (v === 'na') na++;
        else if (v !== 'none') unset++;
      }
      total = fw.departments.length - na;
      if (unset > 0) {
        return { assessed: false, live: live, pilot: pilot, total: total, unset: unset,
          error: unset + (unset === 1 ? ' department is' : ' departments are') + ' not marked yet.' };
      }
    } else if (raw.mode === 'manual') {
      total = intOrNull(raw.total); live = intOrNull(raw.live); pilot = intOrNull(raw.pilot) || 0;
      if (total === null || live === null) return { assessed: false, error: 'Enter the number of departments and how many use AI.' };
      if (live < 0 || pilot < 0) return { assessed: false, error: 'Numbers cannot be negative.' };
      if (live + pilot > total) return { assessed: false, error: 'Live plus pilot departments cannot exceed the total.' };
    } else {
      return { assessed: false };
    }
    if (!(total > 0)) return { assessed: false, live: live, pilot: pilot, total: total, error: 'At least one department must apply.' };
    var pw = typeof fw.pilotWeight === 'number' ? fw.pilotWeight : 0.5;
    var weighted = live + pw * pilot;
    var tenths = toTenths(weighted / total * 10);
    return {
      assessed: true, score: tenths / 10, live: live, pilot: pilot, total: total, weighted: weighted,
      coverage: Math.round(weighted / total * 100), liveCoverage: Math.round(live / total * 100)
    };
  }

  function categoryInfos(a, fw) {
    var cats = {}, scores = (a && a.scores) || {};
    for (var i = 0; i < fw.categories.length; i++) {
      var c = fw.categories[i], raw = scores[c.key], info;
      if (c.type === 'levels') info = levelInfo(raw);
      else if (c.type === 'spending') info = spendingInfo(raw, fw);
      else if (c.type === 'span') info = spanInfo(raw, fw);
      else info = { assessed: false };
      info.tenths = info.assessed ? toTenths(info.score) : null;
      cats[c.key] = info;
    }
    return cats;
  }

  // ---------- aggregation ----------
  function aggregate(cats, fw) {
    var pillars = {};
    ['maturity', 'strategy'].forEach(function (p) {
      var list = fw.categories.filter(function (c) { return c.pillar === p; });
      var assessed = list.filter(function (c) { return cats[c.key] && cats[c.key].assessed; });
      var wsum = 0, acc = 0;
      assessed.forEach(function (c) { var w = Number(c.weight) || 0; wsum += w; acc += w * cats[c.key].tenths; });
      var tenths = (assessed.length && wsum > 0) ? Math.round(acc / wsum + 1e-9) : null;
      var need = Math.min(Number(fw.completenessMin) || 1, list.length);
      pillars[p] = {
        tenths: tenths, score: tenths === null ? null : tenths / 10,
        assessedCount: assessed.length, total: list.length,
        complete: assessed.length >= need && tenths !== null,
        parts: assessed.map(function (c) { return { key: c.key, name: c.name, score: cats[c.key].tenths / 10, weight: Number(c.weight) || 0 }; })
      };
    });
    var wm = Number(fw.pillarWeights.maturity) || 0, ws = Number(fw.pillarWeights.strategy) || 0;
    var overallT = null;
    if (pillars.maturity.tenths !== null && pillars.strategy.tenths !== null && (wm + ws) > 0) {
      overallT = Math.round((wm * pillars.maturity.tenths + ws * pillars.strategy.tenths) / (wm + ws) + 1e-9);
    }
    var complete = pillars.maturity.complete && pillars.strategy.complete && overallT !== null;
    var assessedAll = fw.categories.every(function (c) { return cats[c.key] && cats[c.key].assessed; });
    var ev = {
      cats: cats, pillars: pillars,
      overallTenths: overallT, overall: overallT === null ? null : overallT / 10,
      complete: complete, partial: complete && !assessedAll,
      assessedCount: fw.categories.filter(function (c) { return cats[c.key] && cats[c.key].assessed; }).length,
      categoryCount: fw.categories.length
    };
    ev.classification = classify(ev, fw);
    return ev;
  }

  function evaluate(a, fw) { return aggregate(categoryInfos(a, fw), fw); }

  // ---------- requirements & buckets ----------
  function reqLabel(metric, value) {
    switch (metric) {
      case 'liveDepts': return 'AI live in at least ' + value + ' department' + (Number(value) === 1 ? '' : 's');
      case 'spendPct': return 'At least ' + fmtPct(Number(value)) + ' of IT budget on AI';
      case 'depth': return 'Depth at least ' + fmtScore(Number(value));
      case 'strategy': return 'Strategy at least ' + fmt1(Number(value));
      case 'maturity': return 'Maturity at least ' + fmt1(Number(value));
    }
    return metric;
  }

  function checkReq(metric, req, ev) {
    var c = { metric: metric, required: req, label: reqLabel(metric, req), status: 'unknown', actual: null };
    var cats = ev.cats;
    if (metric === 'liveDepts') {
      var sp = cats.span;
      if (sp && sp.assessed) { c.actual = sp.live; c.status = sp.live >= req ? 'met' : 'not_met'; }
    } else if (metric === 'spendPct') {
      var s = cats.spending;
      if (s && s.assessed) {
        if (s.exact) { c.actual = s.pct; c.status = toTenths(s.pct) >= toTenths(req) ? 'met' : 'not_met'; }
        else {
          c.actual = s.label;
          if (s.pctMin >= req) c.status = 'met';
          else if (s.pctMax !== null && s.pctMax <= req) c.status = 'not_met';
          else c.status = 'unknown';
          c.range = true;
        }
      }
    } else if (metric === 'depth') {
      var d = cats.depth;
      if (d && d.assessed) { c.actual = d.score; c.status = d.tenths >= toTenths(req) ? 'met' : 'not_met'; }
    } else if (metric === 'strategy' || metric === 'maturity') {
      var p = ev.pillars[metric];
      if (p && p.tenths !== null) { c.actual = p.score; c.status = p.tenths >= toTenths(req) ? 'met' : 'not_met'; }
    }
    return c;
  }

  function describeFailure(c, bucket) {
    var need = bucket + ' needs ';
    switch (c.metric) {
      case 'liveDepts':
        if (c.status === 'unknown') return 'the departments using AI were not recorded (' + need + c.required + ')';
        return 'AI is live in only ' + c.actual + ' department' + (c.actual === 1 ? '' : 's') + '; ' + need + c.required;
      case 'spendPct':
        if (c.status === 'unknown' && c.range) return 'AI spending was given only as “' + String(c.actual).replace(' (range given)', '') + '”, which does not confirm ' + fmtPct(c.required) + ' (' + bucket + ' requirement)';
        if (c.status === 'unknown') return 'AI spending was not disclosed (' + need + 'at least ' + fmtPct(c.required) + ')';
        if (c.range) return 'AI spending is “' + String(c.actual).replace(' (range given)', '') + '”; ' + need + fmtPct(c.required);
        return 'only ' + fmtPct(c.actual) + ' of the IT budget goes to AI; ' + need + fmtPct(c.required);
      case 'depth':
        if (c.status === 'unknown') return 'Depth was not scored (' + need + 'at least ' + fmtScore(c.required) + ')';
        return 'Depth is ' + fmtScore(c.actual) + '; ' + need + 'at least ' + fmtScore(c.required);
      case 'strategy':
      case 'maturity':
        var nm = c.metric === 'strategy' ? 'Strategy' : 'Maturity';
        if (c.status === 'unknown') return nm + ' could not be scored (' + need + 'at least ' + fmt1(c.required) + ')';
        return nm + ' is ' + fmt1(c.actual) + '; ' + need + 'at least ' + fmt1(c.required);
    }
    return c.label;
  }

  function classify(ev, fw) {
    if (!ev.complete || ev.overallTenths === null) {
      var missing = [];
      ['maturity', 'strategy'].forEach(function (p) {
        var pl = ev.pillars[p];
        if (!pl.complete) missing.push((p === 'maturity' ? 'Maturity' : 'Strategy') + ' has ' + pl.assessedCount + ' of ' + pl.total + ' categories scored');
      });
      var need = Math.min(Number(fw.completenessMin) || 1, 4);
      return {
        status: 'incomplete', provisional: null, final: null, unverified: false, trail: [],
        reason: 'Not classified yet: ' + missing.join('; ') + '. Each pillar needs at least ' + need + '.'
      };
    }
    var o = ev.overallTenths;
    var prov = o >= toTenths(fw.thresholds.high) ? 'HIGH' : (o >= toTenths(fw.thresholds.medium) ? 'MEDIUM' : 'LOW');
    var idx = BUCKETS.indexOf(prov), trail = [];
    var policy = fw.unknownPolicy || { high: 'fail', medium: 'flag' };
    while (idx > 0) {
      var b = BUCKETS[idx], reqs = (fw.requirements && fw.requirements[b.toLowerCase()]) || {};
      var checks = REQ_METRICS.filter(function (m) { return hasReq(reqs[m]); })
        .map(function (m) { return checkReq(m, Number(reqs[m]), ev); });
      var unknownFails = policy[b.toLowerCase()] === 'fail';
      var failed = checks.filter(function (c) { return c.status === 'not_met' || (c.status === 'unknown' && unknownFails); });
      trail.push({ bucket: b, checks: checks, failed: failed });
      if (!failed.length) break;
      idx--;
    }
    var final = BUCKETS[idx];
    var finalStep = null;
    for (var i = 0; i < trail.length; i++) if (trail[i].bucket === final) finalStep = trail[i];
    var unverifiedChecks = finalStep ? finalStep.checks.filter(function (c) { return c.status === 'unknown'; }) : [];
    var unverified = unverifiedChecks.length > 0;
    var score = fmt1(ev.overall), reason;
    if (final === prov) {
      if (final === 'LOW') reason = 'Scored ' + score + ', below the MEDIUM threshold of ' + fmt1(fw.thresholds.medium) + '.';
      else reason = 'Scored ' + score + ' (' + final + ' range) and meets all ' + final + ' requirements.';
    } else {
      var parts = [];
      trail.forEach(function (t) {
        if (t.failed.length) parts.push(t.failed.map(function (c) { return describeFailure(c, t.bucket); }).join('; '));
      });
      reason = 'Scored ' + score + ' (' + prov + ' range), but ' + parts.join('; and ') + '.';
      reason = reason.charAt(0).toUpperCase() + reason.slice(1);
    }
    if (unverified) {
      reason += ' Not verified: ' + unverifiedChecks.map(function (c) {
        if (c.metric === 'spendPct') return c.range ? 'AI spending is only known as a range' : 'AI spending was not disclosed';
        if (c.metric === 'liveDepts') return 'departments using AI were not recorded';
        return c.label.toLowerCase() + ' could not be checked';
      }).join('; ') + '.';
    }
    return {
      status: unverified ? 'unverified' : 'classified', provisional: prov, final: final,
      downgraded: final !== prov, unverified: unverified, trail: trail, reason: reason,
      finalChecks: finalStep ? finalStep.checks : []
    };
  }

  // ---------- combined company view ----------
  function combine(items, fw) {
    // items: [{ a, ev }] already evaluated under their own framework versions
    var cats = {};
    fw.categories.forEach(function (c) {
      var assessed = items.map(function (it) { return it.ev.cats[c.key]; }).filter(function (x) { return x && x.assessed; });
      if (!assessed.length) { cats[c.key] = { assessed: false, tenths: null }; return; }
      var t = Math.round(assessed.reduce(function (s, x) { return s + x.tenths; }, 0) / assessed.length + 1e-9);
      var info = { assessed: true, tenths: t, score: t / 10, n: assessed.length };
      var vals = assessed.map(function (x) { return x.tenths; });
      info.gap = (Math.max.apply(null, vals) - Math.min.apply(null, vals)) / 10;
      if (c.type === 'span') {
        info.live = assessed.reduce(function (s, x) { return s + x.live; }, 0) / assessed.length;
        info.pilot = assessed.reduce(function (s, x) { return s + x.pilot; }, 0) / assessed.length;
        info.total = assessed.reduce(function (s, x) { return s + x.total; }, 0) / assessed.length;
      }
      if (c.type === 'spending') {
        var exact = assessed.filter(function (x) { return x.exact; });
        if (exact.length === assessed.length) {
          info.exact = true;
          info.pct = round1(exact.reduce(function (s, x) { return s + x.pct; }, 0) / exact.length);
          info.pctMin = info.pctMax = info.pct;
          info.label = fmtPct(info.pct);
        } else {
          info.exact = false;
          info.pctMin = assessed.reduce(function (s, x) { return s + x.pctMin; }, 0) / assessed.length;
          info.pctMax = assessed.some(function (x) { return x.pctMax === null; }) ? null :
            assessed.reduce(function (s, x) { return s + x.pctMax; }, 0) / assessed.length;
          info.label = 'mix of ranges and amounts';
        }
      }
      cats[c.key] = info;
    });
    var ev = aggregate(cats, fw);
    ev.interviews = items.length;
    return ev;
  }

  // ---------- framework validation ----------
  function validateFramework(fw) {
    var errs = [];
    var wm = num(fw.pillarWeights.maturity), ws = num(fw.pillarWeights.strategy);
    if (wm === null || ws === null || wm < 0 || ws < 0 || (wm + ws) <= 0) errs.push('Pillar weights must be 0 or more and not both 0.');
    fw.categories.forEach(function (c) {
      var w = num(c.weight);
      if (w === null || w < 0) errs.push('Weight for ' + c.name + ' must be 0 or more.');
      if (c.type === 'levels') (c.levels || []).forEach(function (l, i) { if (!String(l.name || '').trim()) errs.push(c.name + ': level ' + LEVEL_SCORES[i] + ' needs a name.'); });
    });
    ['maturity', 'strategy'].forEach(function (p) {
      var sum = fw.categories.filter(function (c) { return c.pillar === p; }).reduce(function (s, c) { return s + (num(c.weight) || 0); }, 0);
      if (sum <= 0) errs.push('At least one ' + p + ' category needs a weight above 0.');
    });
    var tm = num(fw.thresholds.medium), th = num(fw.thresholds.high);
    if (tm === null || th === null || tm < 0 || th > 10 || tm >= th) errs.push('Thresholds must satisfy 0 ≤ MEDIUM < HIGH ≤ 10.');
    var bands = sortedBands(fw);
    for (var i = 1; i < bands.length; i++) {
      if (!(bands[i].min > bands[i - 1].min)) errs.push('Spending band limits must increase.');
      if (bands[i - 1].max !== bands[i].min) errs.push('Spending bands must join up without gaps.');
    }
    if (!(fw.pilotWeight >= 0 && fw.pilotWeight <= 1)) errs.push('Pilot weight must be between 0 and 1.');
    if (!fw.departments.length) errs.push('Keep at least one department.');
    var cm = num(fw.completenessMin);
    if (cm === null || cm < 1 || cm > 4) errs.push('Categories needed per pillar must be between 1 and 4.');
    ['high', 'medium'].forEach(function (b) {
      REQ_METRICS.forEach(function (m) {
        var v = fw.requirements[b][m];
        if (hasReq(v) && Number(v) < 0) errs.push('Requirements cannot be negative.');
      });
    });
    return errs;
  }

  // ---------- CSV ----------
  function csvCell(v) {
    if (v === null || v === undefined) return '';
    var s = String(v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // avoid spreadsheet formula injection
    return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  var api = {
    LEVEL_SCORES: LEVEL_SCORES, BUCKETS: BUCKETS, REQ_METRICS: REQ_METRICS,
    DEFAULT_FRAMEWORK: DEFAULT_FRAMEWORK,
    clone: clone, toTenths: toTenths, round1: round1, num: num,
    fmt1: fmt1, fmtScore: fmtScore, fmtPct: fmtPct, bandLabel: bandLabel, sortedBands: sortedBands,
    spendingInfo: spendingInfo, spanInfo: spanInfo, levelInfo: levelInfo,
    categoryInfos: categoryInfos, aggregate: aggregate, evaluate: evaluate,
    classify: classify, checkReq: checkReq, reqLabel: reqLabel, combine: combine,
    validateFramework: validateFramework, csvCell: csvCell, hasReq: hasReq
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AIEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
