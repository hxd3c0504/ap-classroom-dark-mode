/* Theme open component roots without changing their layout or application state. */
(() => {
  'use strict';
  const roots = new Map();
  const candidates = new Set();
  let dark = false;
  let css;
  const source = () => css ||= fetch(chrome.runtime.getURL('shadow.css'))
    .then(response => {
      if (!response.ok) throw new Error('Cannot load component colors');
      return response.text();
    }).catch(() => { css = undefined; return ''; });

  function install(root, host) {
    if (root.querySelector('style[data-ap-shadow-theme]')) return;
    source().then(text => {
      if (!text || !host.isConnected || root.querySelector('style[data-ap-shadow-theme]')) return;
      const style = document.createElement('style');
      style.setAttribute('data-ap-shadow-theme', '');
      style.textContent = text;
      root.append(style);
    });
  }
  function register(host) {
    const root = host.shadowRoot;
    if (!root) return;
    install(root, host);
    if (roots.has(root)) return;
    const observer = new MutationObserver(records => process(records));
    roots.set(root, { host, observer });
    host.setAttribute('data-ap-dark', dark ? 'on' : 'off');
    observer.observe(root, { childList: true, subtree: true });
    discover(root);
  }
  function inspect(el) {
    if (el.localName.includes('-') || el.id.startsWith('spa-widget')) candidates.add(el);
    if (el.shadowRoot) register(el);
  }
  function discover(node) {
    if (node.nodeType === 1) inspect(node);
    for (const el of node.querySelectorAll?.('*') || []) inspect(el);
  }
  function process(records) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1 && !node.hasAttribute('data-ap-shadow-theme')) discover(node);
      }
    }
    for (const [root, entry] of roots) {
      if (!entry.host.isConnected) { entry.observer.disconnect(); roots.delete(root); }
      else install(root, entry.host);
    }
  }
  const observer = new MutationObserver(process);
  observer.observe(document, { childList: true, subtree: true });
  discover(document);
  // Some hosts attach their component root after insertion; check only candidates.
  setInterval(() => {
    for (const host of candidates) {
      if (!host.isConnected) candidates.delete(host);
      else register(host);
    }
  }, 1500);
  globalThis.APShadowTheme = {
    set(enabled) {
      dark = enabled;
      for (const { host } of roots.values()) host.setAttribute('data-ap-dark', dark ? 'on' : 'off');
    }
  };
})();
