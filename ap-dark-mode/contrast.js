/* Color fixes for the review screen and numeric assignment results. */
(() => {
  'use strict';
  let enabled = false;
  let scheduled = false;
  const marked = new Set();
  const fraction = /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/;
  const mark = (element, attribute, value) => {
    element.setAttribute(attribute, value);
    marked.add(element);
  };
  function scan() {
    scheduled = false;
    for (const element of marked) {
      element.removeAttribute('data-ap-review-surface');
      element.removeAttribute('data-ap-score-fraction');
    }
    marked.clear();
    if (!enabled) return;

    // Read the actual results column; don't recolor dates or action buttons.
    for (const table of document.querySelectorAll('.student_assignments_table')) {
      const headers = [...table.querySelectorAll('thead th')];
      const column = headers.findIndex(th => th.classList.contains('results-th') || /^Results$/i.test(th.textContent.trim()));
      if (column < 0) continue;
      for (const row of table.querySelectorAll('tbody tr')) {
        const cell = row.children[column];
        if (!cell) continue;
        for (const label of [cell, ...cell.querySelectorAll('span,div,p,strong,b,a,text,tspan')]) {
          if (fraction.test(label.textContent.trim())) mark(label, 'data-ap-score-fraction', '');
        }
      }
    }

    const player = document.querySelector('.bluebook-player-container');
    const inner = player?.querySelector('.bluebook-player-inner-container');
    if (!inner || !/Check\s+Your\s+Work/i.test(inner.textContent)) return;
    const width = inner.getBoundingClientRect().width;
    // Detect neutral light surfaces even if this screen uses different classes.
    // Colored question states, images and controls keep their original colors.
    for (const element of [inner, ...inner.querySelectorAll('main,section,article,div')]) {
      const style = getComputedStyle(element);
      if (style.backgroundImage !== 'none') continue;
      const parts = style.backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (!parts || parts.length < 3 || (parts[3] ?? 1) < .9) continue;
      const channels = parts.slice(0, 3);
      if (Math.min(...channels) < 230 || Math.max(...channels) - Math.min(...channels) > 18) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width <= 100 || rect.height <= 30 || style.visibility === 'hidden') continue;
      mark(element, 'data-ap-review-surface', rect.width >= width * .9 ? 'page' : 'card');
    }
  }
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(scan);
  };
  new MutationObserver(() => { if (enabled) schedule(); }).observe(document, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ['class', 'style']
  });
  globalThis.APContrastFixes = { set(dark) { enabled = dark; schedule(); } };
})();
