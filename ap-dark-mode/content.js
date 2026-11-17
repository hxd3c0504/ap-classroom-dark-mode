(() => {
  'use strict';
  const modes = new Set(['dark', 'light', 'system']);
  const system = matchMedia('(prefers-color-scheme: dark)');
  let mode = 'system';
  let changedWhileLoading = false;
  const apply = () => {
    const dark = mode === 'dark' || (mode === 'system' && system.matches);
    document.documentElement.dataset.apDark = dark ? 'on' : 'off';
    globalThis.APShadowTheme?.set(dark);
    globalThis.APContrastFixes?.set(dark);
  };
  // Install the listener before reading storage so a new choice always wins.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.mode) return;
    changedWhileLoading = true;
    mode = modes.has(changes.mode.newValue) ? changes.mode.newValue : 'system';
    apply();
  });
  system.addEventListener('change', apply);
  chrome.storage.local.get({ mode: 'system' }, (saved) => {
    if (chrome.runtime.lastError) return;
    if (!changedWhileLoading) mode = modes.has(saved.mode) ? saved.mode : 'system';
    apply();
  });
})();
