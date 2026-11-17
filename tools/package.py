"""Build a runtime-only extension ZIP from explicit manifest references."""
import hashlib
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

root = Path(__file__).resolve().parent.parent
extension = root / 'ap-dark-mode'
manifest = json.loads((extension / 'manifest.json').read_text())
files = {'manifest.json'}
for script in manifest.get('content_scripts', []):
    files.update(script.get('js', []))
    files.update(script.get('css', []))
for resource in manifest.get('web_accessible_resources', []):
    files.update(resource.get('resources', []))
files.update(manifest.get('icons', {}).values())
action = manifest.get('action', {})
files.update(action.get('default_icon', {}).values())
popup = action.get('default_popup')
if popup:
    files.add(popup)
    for asset in re.findall(r'(?:src|href)="([^"]+)"', (extension / popup).read_text()):
        files.add((Path(popup).parent / asset).as_posix())

for name in files:
    path = Path(name)
    if path.is_absolute() or '..' in path.parts or '://' in name or '*' in name:
        raise ValueError('Unexpected package path: ' + name)
    if not (extension / path).is_file():
        raise FileNotFoundError(name)

destination = root / 'dist'
destination.mkdir(exist_ok=True)
archive = destination / ('ap-classroom-dark-mode-' + manifest['version'] + '.zip')
with ZipFile(archive, 'w', compression=ZIP_DEFLATED) as package:
    for name in sorted(files):
        info = ZipInfo(name, date_time=(2026, 11, 17, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        package.writestr(info, (extension / name).read_bytes())
with ZipFile(archive) as package:
    assert package.testzip() is None
    assert set(package.namelist()) == files
    assert json.loads(package.read('manifest.json')) == manifest
checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
(destination / 'SHA256SUMS').write_text(checksum + '  ' + archive.name + '\n')
print('Created ' + archive.name + ' (' + str(len(files)) + ' runtime files)')
