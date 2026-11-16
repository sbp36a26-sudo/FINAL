// Render checks, evaluated in the page after layout. Plain JS (no build step) on purpose.
// opts: { colours: [token hex values], sizes: [type scale], caption: caption size }
(function check(opts) {
  const issues = [];
  const allowed = new Set(opts.colours.map((c) => c.toUpperCase()));
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  };
  const hex = (p) => '#' + p.rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const lum = (rgb) => { const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const fieldOf = (el) => (el.closest('[data-field]') ? el.closest('[data-field]').dataset.field : el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName.toLowerCase());
  const side = (el) => (el.closest('.page--left') ? 'left page' : el.closest('.page--right') ? 'right page' : 'spread');
  // Background actually painted behind the text: walk the stack at the text's centre.
  const bgOf = (el) => {
    // scroll the document only (scrollIntoView would also scroll overflow-hidden boxes)
    const r0 = el.getBoundingClientRect();
    window.scrollTo(window.scrollX + r0.left - 20, window.scrollY + r0.top - 20);
    const r = el.getBoundingClientRect();
    const stack = document.elementsFromPoint(r.left + Math.min(r.width / 2, 4), r.top + r.height / 2);
    for (const e of stack) {
      if (e.tagName === 'IMG') return null;
      const p = parse(getComputedStyle(e).backgroundColor);
      if (p && p.a > 0) return p;
    }
    return parse(getComputedStyle(document.body).backgroundColor);
  };

  for (const spread of document.querySelectorAll('.spread')) {
    const file = spread.dataset.file;
    const seen = new Set();
    const push = (el, kind, message) => {
      const field = fieldOf(el);
      const key = kind + field + message;
      if (!seen.has(key)) { seen.add(key); issues.push({ file, field, kind, message: `${message} (${side(el)})` }); }
    };
    const colour = (el, prop, value) => {
      const p = parse(value);
      if (!p || p.a === 0) return;
      if (!allowed.has(hex(p))) push(el, 'colour', `${prop} ${hex(p)} is not a brand token`);
    };
    // content must stay inside the type area
    for (const content of spread.querySelectorAll('.page__content')) {
      const box = content.getBoundingClientRect();
      for (const child of content.children) {
        const r = child.getBoundingClientRect();
        if (r.height === 0) continue;
        if (r.bottom > box.bottom + 0.5) push(child, 'overflow', `runs ${Math.ceil(r.bottom - box.bottom)} px into the bottom margin`);
        if (r.right > box.right + 0.5) push(child, 'overflow', `runs ${Math.ceil(r.right - box.right)} px into the side margin`);
      }
    }
    // 4 px grid: every block in the type area starts and ends on a grid line measured from the page top
    for (const el of spread.querySelectorAll('.page__content > *, .region > *, .flow-box > *, .figures > *, .card, .key-figure, .image__frame')) {
      const pg = el.closest('.page');
      if (!pg || getComputedStyle(el).display === 'none' || el.classList.contains('bleed')) continue;
      const top = el.getBoundingClientRect().top - pg.getBoundingClientRect().top;
      const h = el.getBoundingClientRect().height;
      const off = (v) => Math.abs(v - Math.round(v / 4) * 4) > 0.5;
      if (h > 0 && (off(top) || off(h))) push(el, 'grid', `block at y ${Math.round(top * 10) / 10} px, height ${Math.round(h * 10) / 10} px is off the 4 px grid`);
    }
    for (const el of spread.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.closest('template')) continue;
      if (cs.overflowY !== 'visible' || cs.overflowX !== 'visible') {
        const dy = el.scrollHeight - el.clientHeight, dx = el.scrollWidth - el.clientWidth;
        if (dy > 1) push(el, 'overflow', `text overflows its box by ${Math.ceil(dy)} px`);
        else if (dx > 1) push(el, 'overflow', `content is ${Math.ceil(dx)} px too wide for its box`);
      }
      if (el.hasAttribute('data-overflow')) push(el, 'overflow', el.getAttribute('data-overflow'));
      if (el instanceof SVGTextElement && el.dataset.maxWidth && el.getComputedTextLength() > Number(el.dataset.maxWidth) + 0.5)
        push(el, 'overflow', `label is ${Math.ceil(el.getComputedTextLength() - el.dataset.maxWidth)} px too wide`);

      const isSvg = el instanceof SVGElement;
      const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (ownText) {
        const fs = parseFloat(cs.fontSize);
        if (fs < opts.caption - 0.01) push(el, 'type', `text at ${fs} px is below the caption size (${opts.caption} px)`);
        else if (!opts.sizes.some((s) => Math.abs(s - fs) < 0.01)) push(el, 'type', `font size ${fs} px is not in the type scale`);
        const fgv = isSvg ? cs.fill : cs.color;
        colour(el, 'text colour', fgv);
        const fg = parse(fgv), bg = bgOf(el);
        if (fg && bg) {
          const r = ratio(fg.rgb, bg.rgb);
          if (r < 4.5) push(el, 'contrast', `text ${hex(fg)} on ${hex(bg)} is ${r.toFixed(2)}:1, under WCAG AA 4.5:1`);
        } else if (fg && !bg) push(el, 'contrast', 'text sits on a photo; contrast cannot be guaranteed');
      }
      colour(el, 'background', cs.backgroundColor);
      for (const s of ['Top', 'Right', 'Bottom', 'Left'])
        if (parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none') colour(el, 'border', cs[`border${s}Color`]);
      if (isSvg && !(el instanceof SVGSVGElement)) { colour(el, 'fill', cs.fill); if (cs.stroke !== 'none') colour(el, 'stroke', cs.stroke); }
    }
  }
  return issues;
})
