import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'ap-dark-mode/content.js'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'ap-dark-mode/manifest.json'), 'utf8'));
assert.deepEqual(manifest.permissions, ['storage']);
assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.content_scripts[0].matches, [
  'https://apstudents.collegeboard.org/*', 'https://apclassroom.collegeboard.org/*'
]);
assert.equal(manifest.content_scripts.length, 3);
assert.deepEqual(manifest.content_scripts[1].matches, ['https://myap.collegeboard.org/login*']);
assert.deepEqual(manifest.content_scripts[1].js, ['content.js']);
assert.deepEqual(manifest.content_scripts[1].css, ['myap-login.css']);
assert.deepEqual(manifest.content_scripts[2].matches, ['https://prod.idp.collegeboard.org/*']);
assert.deepEqual(manifest.content_scripts[2].js, ['shadows.js', 'content.js']);
assert.deepEqual(manifest.content_scripts[2].css, ['auth-login.css']);
assert.deepEqual(manifest.web_accessible_resources[0].resources, ['shadow.css']);
assert.deepEqual(manifest.web_accessible_resources[0].matches, [
  ...manifest.content_scripts[0].matches, ...manifest.content_scripts[2].matches
]);
for (const name of [...manifest.content_scripts.flatMap(script => [...script.js, ...script.css]), manifest.action.default_popup]) {
  assert.ok((await readFile(resolve(root, 'ap-dark-mode', name))).length);
}
const css = await readFile(resolve(root, 'ap-dark-mode/theme.css'), 'utf8');
const shadowCSS = await readFile(resolve(root, 'ap-dark-mode/shadow.css'), 'utf8');
const loginCSS = await readFile(resolve(root, 'ap-dark-mode/myap-login.css'), 'utf8');
const authCSS = await readFile(resolve(root, 'ap-dark-mode/auth-login.css'), 'utf8');
const allCSS = css + shadowCSS + loginCSS + authCSS;
const allowed = new Set(['color-scheme', 'color', 'background-color', 'background-image', 'border-color', 'filter', 'fill', 'mix-blend-mode']);
for (const match of allCSS.matchAll(/(?:[;{]\s*)([-\w]+)\s*:/g)) {
  assert.ok(match[1].startsWith('--ap-') || allowed.has(match[1]), `Unexpected layout property: ${match[1]}`);
}
for (const match of allCSS.matchAll(/background-image\s*:\s*([^;}]*)/g)) {
  assert.equal(match[1].trim(), 'none !important', 'Only remove known light gradients; preserve image assets');
}
new vm.Script(await readFile(resolve(root, 'ap-dark-mode/shadows.js'), 'utf8'));
new vm.Script(await readFile(resolve(root, 'ap-dark-mode/contrast.js'), 'utf8'));

function boot(saved = 'system', systemDark = false, deferred = false) {
  const document = { documentElement: { dataset: {} } };
  let storageChange, schemeChange, load;
  const scheme = { matches: systemDark, addEventListener(_, listener) { schemeChange = listener; } };
  vm.runInNewContext(source, {
    document, matchMedia: () => scheme,
    chrome: {
      runtime: {}, storage: {
        onChanged: { addListener(listener) { storageChange = listener; } },
        local: { get(_, callback) { load = () => callback({ mode: saved }); if (!deferred) load(); } }
      }
    }
  });
  return {
    value: () => document.documentElement.dataset.apDark,
    change: value => storageChange({ mode: { newValue: value } }, 'local'),
    system: value => { scheme.matches = value; schemeChange(); }, load: () => load()
  };
}
assert.equal(boot().value(), 'off');
assert.equal(boot(undefined, true).value(), 'on');
assert.equal(boot('dark').value(), 'on');
assert.equal(boot('light').value(), 'off');
const system = boot('system');
assert.equal(system.value(), 'off');
system.system(true);
assert.equal(system.value(), 'on');
system.change('light');
assert.equal(system.value(), 'off');
system.system(false);
assert.equal(system.value(), 'off');
system.change('dark');
assert.equal(system.value(), 'on');
const racing = boot('dark', false, true);
racing.change('light');
racing.load();
assert.equal(racing.value(), 'off');
assert.equal(boot('invalid').value(), 'off');
console.log('PASS: manifest, allowed color-only CSS, default/light/system modes, live changes, invalid settings, storage race.');
