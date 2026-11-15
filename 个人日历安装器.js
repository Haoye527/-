// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: cloud-download-alt;

const scriptName = '个人日历组件-v9.3(1)';
const fileName = scriptName + '.js';
const remoteFile = encodeURIComponent(fileName).replaceAll('(', '%28').replaceAll(')', '%29');
const url = 'https://raw.githubusercontent.com/Haoye527/-/main/' + remoteFile;

const local = FileManager.local();
let manager = local;
let directory = local.documentsDirectory();
try {
  const cloud = FileManager.iCloud();
  const cloudDirectory = cloud.documentsDirectory();
  manager = cloud;
  directory = cloudDirectory;
} catch (_) {
  // iCloud 未启用时使用本地脚本目录。
}
const path = manager.joinPath(directory, fileName);
const isInstalled = () => manager.fileExists(path);
function versionOf(code) {
  return code.match(/^const calendarVersion = '([0-9]+(?:\.[0-9]+)+)';/m)?.[1] ??
    code.match(/^\/\/ ===== v(9\.3) 优化版 =====/m)?.[1] ?? '';
}

function installedVersion() {
  if (!isInstalled()) return '';
  try {
    return versionOf(manager.readString(path) ?? '');
  } catch (_) {
    return '';
  }
}

async function fetchCalendar() {
  const request = new Request(url + '?t=' + Date.now());
  request.timeoutInterval = 20;
  const code = await request.loadString();
  const status = request.response?.statusCode;
  if (status !== 200 || !code.trimStart().startsWith('// Variables used by Scriptable.') ||
      !code.includes('Script.setWidget(widget)')) {
    throw new Error('GitHub 返回的内容不是预期的日历脚本（HTTP ' + (status ?? '未知') + '）');
  }

  return code;
}

function compareVersions(left, right) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
}

const view = new WebView();
await view.loadHTML(`<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>个人日历安装器</title>
<style>
:root{color-scheme:light dark;--bg:#f2f3f7;--card:#fff;--text:#1c1c1e;--sub:#626267;--soft:#e7f1ff;--accent:#1462b3;--shade:#eeeff3}
@media(prefers-color-scheme:dark){:root{--bg:#17171a;--card:#242428;--text:#f4f4f6;--sub:#b4b4bc;--soft:#213954;--accent:#9ac6ff;--shade:#343438}}
body{margin:0;background:var(--bg);color:var(--text);font:16px -apple-system,BlinkMacSystemFont,sans-serif}
main{max-width:460px;margin:auto;padding:28px 16px}
h1{font-size:26px;letter-spacing:-.02em;margin:0 0 18px}
.card{border-radius:18px;background:var(--card);padding:18px}
.head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}
h2{margin:0;font-size:18px}
#version{color:var(--sub);font-size:13px;font-variant-numeric:tabular-nums}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
button{border:0;border-radius:10px;padding:10px;background:var(--shade);color:var(--text);font:inherit;font-size:14px;font-weight:600;min-height:44px}
#run,#download.primary{background:var(--soft);color:var(--accent)}
#check{grid-column:1/-1;background:transparent;color:var(--accent)}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
button:disabled{opacity:.5}
#status{color:var(--sub);font-size:14px;line-height:1.5;margin:8px 0 0;overflow-wrap:anywhere}
</style>
<main>
  <h1>个人日历安装器</h1>
  <section class="card">
    <div class="head">
      <h2>个人日历</h2>
      <span id="version"></span>
    </div>
    <p id="status" role="status"></p>
    <div class="actions">
      <button id="run" type="button">运行</button>
      <button id="download" type="button">下载</button>
      <button id="check" type="button">检测更新</button>
    </div>
  </section>
</main>
<script>
const run = document.querySelector('#run');
const download = document.querySelector('#download');
const check = document.querySelector('#check');
const status = document.querySelector('#status');
const version = document.querySelector('#version');
let installed = ${isInstalled()};
let pending;
let waiter;
function update(value, message, installedVersion, available) {
  installed = value;
  run.disabled = !installed;
  download.disabled = check.disabled = false;
  download.textContent = !installed ? '下载' : available ? '下载更新' : '重新下载';
  download.classList.toggle('primary', !installed || Boolean(available));
  run.hidden = !installed;
  download.style.gridColumn = installed ? '' : '1 / -1';
  status.textContent = message;
  version.textContent = installedVersion ? '已安装 v' + installedVersion : (installed ? '版本未知' : '未安装');
}
function flush() {
  if (!waiter || !pending) return;
  const done = waiter;
  const action = pending;
  waiter = pending = null;
  done(action);
}
function nextEvent(done) { waiter = done; flush(); }
function send(action) {
  run.disabled = download.disabled = check.disabled = true;
  if (action === 'download') status.textContent = '正在下载…';
  if (action === 'check') status.textContent = '正在检测更新…';
  pending = action;
  flush();
}
run.onclick = () => send('run');
download.onclick = () => send('download');
check.onclick = () => send('check');
update(installed, installed ? '已安装，可运行或重新下载。' : '从 GitHub 下载后即可运行。', ${JSON.stringify(installedVersion())});
</script>
</html>`);

let open = true;
const updatePage = (message, available = false) => view.evaluateJavaScript(
  `update(${isInstalled()}, ${JSON.stringify(message)}, ${JSON.stringify(installedVersion())}, ${available}); true`, false,
);
async function handleActions() {
  while (open) {
    const action = await view.evaluateJavaScript('nextEvent(completion)', true);
    if (!open) return;
    try {
      if (action === 'download') {
        const code = await fetchCalendar();
        manager.writeString(path, code);
        if (open) await updatePage('已下载，点击「运行」打开个人日历。');
      } else if (action === 'check') {
        const latest = versionOf(await fetchCalendar());
        if (!open) return;
        if (!latest) throw new Error('GitHub 脚本没有可识别的版本号。');
        const current = installedVersion();
        if (!current) {
          const prefix = isInstalled() ? '本机版本未知。' : '';
          await updatePage(prefix + 'GitHub 最新版本为 v' + latest + '。');
          continue;
        }
        const comparison = compareVersions(latest, current);
        const message = comparison > 0 ? '发现新版本 v' + latest + '。'
          : comparison === 0 ? '已是最新版本 v' + current + '。'
          : '本机版本比 GitHub 的 v' + latest + ' 更新。';
        await updatePage(message, comparison > 0);
      } else if (action === 'run') {
        if (!isInstalled()) throw new Error('请先下载个人日历。');
        await updatePage('已安装，可运行或重新下载。');
        Safari.open('scriptable:///run/' + encodeURIComponent(scriptName));
      }
    } catch (error) {
      if (open) await updatePage(String(error.message ?? error));
    }
  }
}
handleActions().catch(error => { if (open) console.error(error); });
await view.present(true);
open = false;
