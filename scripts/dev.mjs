import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const node = process.execPath;
const api = spawn(node, [resolve(projectRoot, 'server/index.js')], { cwd: projectRoot, stdio: 'inherit' });
const vite = spawn(node, [resolve(projectRoot, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5175', '--strictPort'], { cwd: projectRoot, stdio: 'inherit' });

let stopping = false;
function stopAll() {
  if (stopping) return;
  stopping = true;
  api.kill('SIGTERM');
  vite.kill('SIGTERM');
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
api.on('exit', (code) => {
  if (!stopping && code !== 0) stopAll();
});
vite.on('exit', (code) => {
  if (!stopping && code !== 0) stopAll();
});
