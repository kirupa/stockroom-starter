// One-time setup after cloning: turn on the Git hooks that keep the index
// current, and build the index for the first time.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  console.error(`stockroom needs Node.js 22.13 or newer, and this is ${process.versions.node}.`);
  process.exit(1);
}

const run = (cmd, args) => spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });

if (fs.existsSync(path.join(ROOT, '.git'))) {
  run('git', ['config', 'core.hooksPath', '.githooks']);
  for (const hook of fs.readdirSync(path.join(ROOT, '.githooks'))) fs.chmodSync(path.join(ROOT, '.githooks', hook), 0o755);
  console.log('Git hooks are on. The index rebuilds after every pull, merge, checkout, and rebase.');
} else {
  console.log('This folder isn\'t a Git repository yet, so the Git hooks are off. Run "npm run setup" again after "git init".');
}

const built = run('npx', ['--no-install', 'stockroom', 'build']);
if (built.status !== 0) process.exit(built.status ?? 1);

console.log(`
You're set. Next steps:
  1. Put your work on the shelves (site, decks, figures, icons) and your rules in guidance/.
  2. Run "npm run check" to see what the stockroom found.
  3. Open this folder in your agent. VS Code reads .vscode/mcp.json, Claude Code reads .mcp.json,
     and the agents in .github/agents and .claude/agents start the stockroom on their own.
`);
