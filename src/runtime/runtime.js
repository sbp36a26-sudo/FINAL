// Runs inside every rendered document (Playwright and gallery).
// 1. Flows each <template data-flow-source> through its .flow-box chain (data-order),
//    splitting paragraphs at word boundaries; keeps subheadings with the next block.
// 2. Copies each spread's notes to the foot of every page that cites them,
//    snaps the notes block to an 8 px multiple so halves stay on the 4 px grid, then reflows.
// 3. Marks leftovers with data-overflow so validation can report them.
(function () {
  const fits = (box) => box.scrollHeight <= box.clientHeight + 0.5 && box.scrollWidth <= box.clientWidth + 0.5;
  const tokens = (html) => html.split(/(<sup[^>]*>.*?<\/sup>|\s+)/).filter((t) => t !== '');

  function flowSpread(spread) {
    spread.querySelectorAll('template[data-flow-source]').forEach((tpl) => {
      const name = tpl.dataset.flowSource;
      const boxes = [...spread.querySelectorAll(`.flow-box[data-flow="${name}"]`)].sort((a, b) => a.dataset.order - b.dataset.order);
      boxes.forEach((b) => { b.innerHTML = ''; b.removeAttribute('data-overflow'); });
      const queue = [...tpl.content.cloneNode(true).children];
      let bi = 0;
      while (queue.length && bi < boxes.length) {
        const box = boxes[bi];
        const el = queue.shift();
        box.appendChild(el);
        if (fits(box)) continue;
        if (el.tagName === 'P') {
          const toks = tokens(el.innerHTML);
          let lo = 0, hi = toks.length;
          while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); el.innerHTML = toks.slice(0, mid).join(''); if (fits(box)) lo = mid; else hi = mid - 1; }
          // avoid a single orphan word line: need at least 1 word that fits
          if (lo > 0 && toks.slice(0, lo).join('').trim()) {
            el.innerHTML = toks.slice(0, lo).join('');
            const rest = el.cloneNode(false);
            rest.innerHTML = toks.slice(lo).join('').replace(/^\s+/, '');
            rest.classList.add('cont');
            if (rest.innerHTML.trim()) queue.unshift(rest);
            bi++;
            continue;
          }
          el.innerHTML = toks.join(''); // nothing fits here: restore the whole paragraph and move it on
        }
        // move el (and a dangling subheading before it) to the next box
        if (box.children.length > 1 || bi < boxes.length - 1) {
          el.remove();
          queue.unshift(el);
          const prev = box.lastElementChild;
          if (prev && prev.hasAttribute('data-keep-with-next')) { prev.remove(); queue.unshift(prev); }
          if (box.children.length === 0 && bi === boxes.length - 1) { box.appendChild(queue.shift()); }
        }
        bi++;
      }
      if (queue.length) {
        const last = boxes[boxes.length - 1];
        if (last) last.setAttribute('data-overflow', `${queue.length} block(s) of text do not fit`);
      }
    });
  }

  function placeNotes(spread) {
    const store = spread.querySelector('template[data-notes]');
    if (!store) return false;
    const pages = [...spread.querySelectorAll('.page')];
    let changed = false;
    pages.forEach((page) => {
      const slot = page.querySelector('.page__notes');
      const ids = [];
      const seen = new Set(); // a note is repeated on every page that cites it
      page.querySelectorAll('sup[data-note]').forEach((s) => { const n = s.dataset.note; if (!seen.has(n)) { seen.add(n); ids.push(n); } });
      const html = ids.length ? `<ol class="footnotes">${ids.map((n) => store.content.querySelector(`li[data-note="${n}"]`).outerHTML).join('')}</ol>` : '';
      if (!slot) { if (ids.length) page.setAttribute('data-overflow', `notes ${ids.join(', ')} have no place on this page`); return; }
      if (slot.innerHTML !== html) { slot.innerHTML = html; slot.style.minHeight = ''; changed = true; }
      if (html) {
        const h = slot.getBoundingClientRect().height;
        const snapped = Math.ceil(h / 8) * 8;
        slot.style.minHeight = snapped + 'px';
      }
    });
    // Grids that must line up across the spine (cards): give both note blocks the same height.
    if (spread.querySelector('.notes-sync')) {
      const slots = [...spread.querySelectorAll('.notes-sync > .page__notes')];
      const max = Math.max(0, ...slots.map((s) => (s.innerHTML ? s.getBoundingClientRect().height : 0)));
      if (max > 0) slots.forEach((s) => {
        if (!s.innerHTML) { s.innerHTML = '<ol class="footnotes" style="visibility:hidden"></ol>'; changed = true; }
        s.style.minHeight = max + 'px';
      });
    }
    return changed;
  }

  window.__layout = async function () {
    await document.fonts.ready;
    for (const spread of document.querySelectorAll('.spread')) {
      for (let i = 0; i < 4; i++) {
        flowSpread(spread);
        if (!placeNotes(spread)) break;
      }
    }
    window.__ready = true;
  };
  window.addEventListener('load', () => window.__layout());
})();
