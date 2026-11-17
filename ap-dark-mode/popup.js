(() => {
  'use strict';
  const fieldset = document.querySelector('fieldset');
  const status = document.querySelector('#status');
  const inputs = [...document.querySelectorAll('input[name="mode"]')];
  const labels = { dark: '深色模式已启用', light: '已恢复网站原色', system: '已跟随系统外观' };
  chrome.storage.local.get({ mode: 'system' }, (saved) => {
    if (chrome.runtime.lastError) {
      status.textContent = '设置读取失败，请重新打开扩展。';
      status.dataset.error = 'true';
      return;
    }
    const mode = Object.hasOwn(labels, saved.mode) ? saved.mode : 'system';
    inputs.find(input => input.value === mode).checked = true;
    status.textContent = labels[mode];
    fieldset.disabled = false;
  });
  fieldset.addEventListener('change', (event) => {
    const mode = event.target.value;
    if (!Object.hasOwn(labels, mode)) return;
    fieldset.disabled = true;
    chrome.storage.local.set({ mode }, () => {
      const failed = !!chrome.runtime.lastError;
      status.textContent = failed ? '设置保存失败，请重试。' : labels[mode];
      status.dataset.error = String(failed);
      fieldset.disabled = false;
    });
  });
})();
