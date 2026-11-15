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
function installedVersion() {
  if (!isInstalled()) return '';
  try {
    const code = manager.readString(path) ?? '';
    const marked = code.match(/^const calendarVersion = '([0-9.]+)';/m);
    const legacy = code.match(/^\/\/ ===== v(9\.3) 优化版 =====/m);
    return marked?.[1] ?? legacy?.[1] ?? '';
  } catch (_) {
    return '';
  }
}

async function downloadCalendar() {
  const request = new Request(url);
  request.timeoutInterval = 20;
  const code = await request.loadString();
  const status = request.response?.statusCode;
  if (status !== 200 || !code.trimStart().startsWith('// Variables used by Scriptable.') ||
      !code.includes('Script.setWidget(widget)')) {
    throw new Error('GitHub 返回的内容不是预期的日历脚本（HTTP ' + (status ?? '未知') + '）');
  }

  manager.writeString(path, code);
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
main{max-width:560px;margin:auto;padding:24px 16px}
h1{font-size:24px;margin:0 0 16px}
.card{border-radius:18px;background:var(--card);padding:16px}
.head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
h2{margin:0;font-size:18px}
.actions{display:flex;gap:8px}
button{border:0;border-radius:999px;padding:9px 13px;background:var(--shade);color:var(--text);font:inherit;font-size:14px;font-weight:600;min-height:44px}
#run{background:var(--soft);color:var(--accent)}
button:disabled{opacity:.5}
#status{color:var(--sub);font-size:14px;margin:8px 0 0}
</style>
<main>
  <h1>个人日历安装器</h1>
  <section class="card">
    <div class="head">
      <h2>个人日历 <small id="version"></small></h2>
      <div class="actions">
        <button id="run" type="button">运行</button>
        <button id="download" type="button">下载</button>
      </div>
    </div>
    <p id="status" role="status"></p>
  </section>
</main>
<script>
const run = document.querySelector('#run');
const download = document.querySelector('#download');
const status = document.querySelector('#status');
const version = document.querySelector('#version');
let installed = ${isInstalled()};
let pending;
let waiter;
function update(value, message, installedVersion) {
  installed = value;
  run.disabled = !installed;
  download.disabled = false;
  download.textContent = installed ? '重新下载' : '下载';
  status.textContent = message;
  version.textContent = installedVersion ? 'v' + installedVersion : (installed ? '版本未知' : '');
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
  run.disabled = download.disabled = true;
  if (action === 'download') status.textContent = '正在下载…';
  pending = action;
  flush();
}
run.onclick = () => send('run');
download.onclick = () => send('download');
update(installed, installed ? '已安装，可运行或重新下载。' : '从 GitHub 下载后即可运行。', ${JSON.stringify(installedVersion())});
</script>
</html>`);

let open = true;
const updatePage = (message) => view.evaluateJavaScript(
  `update(${isInstalled()}, ${JSON.stringify(message)}, ${JSON.stringify(installedVersion())}); true`, false,
);
async function handleActions() {
  while (open) {
    const action = await view.evaluateJavaScript('nextEvent(completion)', true);
    if (!open) return;
    try {
      if (action === 'download') {
        await downloadCalendar();
        if (open) await updatePage('已下载，点击「运行」打开个人日历。');
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
