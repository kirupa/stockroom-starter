// Generates the agent files for GitHub Copilot (.github/agents) and Claude Code
// (.claude/agents) from the one source of truth in stations/.
//
//   npm run agents            write the generated files
//   npm run agents -- --check fail if any generated file is out of date

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MARKER = '<!-- Generated from stations/{file} by "npm run agents". Edit that file instead. -->';
const STOCKROOM_TOOLS = [
  'search_source', 'find_symbol', 'read_source', 'list_source',
  'follow_references', 'who_references', 'find_rules', 'find_examples',
];
const SERVE = ['--no-install', 'stockroom', 'serve', '--watch'];

function parse(file) {
  const text = fs.readFileSync(path.join(ROOT, 'stations', file), 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`stations/${file} needs front matter with name, description, and writes.`);
  const meta = Object.fromEntries(m[1].split(/\r?\n/).map((l) => l.match(/^([\w-]+)\s*:\s*(.*)$/)).filter(Boolean).map((kv) => [kv[1], kv[2].trim()]));
  for (const key of ['name', 'description']) {
    if (!meta[key]) throw new Error(`stations/${file} is missing "${key}" in its front matter.`);
  }
  return { file, name: meta.name, description: meta.description, writes: meta.writes !== 'false', body: m[2].trim() };
}

const list = (items) => `[${items.map((i) => JSON.stringify(i)).join(', ')}]`;

function copilot(s) {
  const tools = s.writes ? ['read', 'edit', 'search', 'execute', 'stockroom/*'] : ['read', 'search', 'execute', 'stockroom/*'];
  return `---
name: ${s.name}
description: ${JSON.stringify(s.description)}
tools: ${list(tools)}
mcp-servers:
  stockroom:
    type: local
    command: npx
    args: ${list(SERVE)}
    tools: ["*"]
---

${MARKER.replace('{file}', s.file)}

${s.body}
`;
}

function claude(s) {
  const builtIn = s.writes ? ['Read', 'Edit', 'Write', 'Grep', 'Glob', 'Bash'] : ['Read', 'Grep', 'Glob', 'Bash'];
  const tools = [...builtIn, ...STOCKROOM_TOOLS.map((t) => `mcp__stockroom__${t}`)];
  return `---
name: ${s.name}
description: ${JSON.stringify(s.description)}
tools: ${tools.join(', ')}
---

${MARKER.replace('{file}', s.file)}

${s.body}
`;
}

const stations = fs.readdirSync(path.join(ROOT, 'stations')).filter((f) => f.endsWith('.md')).sort().map(parse);
const wanted = new Map();
for (const s of stations) {
  wanted.set(`.github/agents/${s.name}.agent.md`, copilot(s));
  wanted.set(`.claude/agents/${s.name}.md`, claude(s));
}

// Generated files whose station was deleted should go too.
const stale = [];
for (const dir of ['.github/agents', '.claude/agents']) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    const rel = `${dir}/${f}`;
    if (!wanted.has(rel) && fs.readFileSync(path.join(abs, f), 'utf8').includes('by "npm run agents"')) stale.push(rel);
  }
}

const check = process.argv.includes('--check');
const outOfDate = [...wanted].filter(([rel, text]) => {
  const abs = path.join(ROOT, rel);
  return !fs.existsSync(abs) || fs.readFileSync(abs, 'utf8') !== text;
}).map(([rel]) => rel);

if (check) {
  const problems = [...outOfDate, ...stale];
  if (problems.length) {
    console.error(`These agent files don't match stations/: ${problems.join(', ')}. Run "npm run agents".`);
    process.exit(1);
  }
  console.log(`Agent files match stations/ (${stations.length} agents).`);
} else {
  for (const [rel, text] of wanted) {
    fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, rel), text);
  }
  for (const rel of stale) fs.rmSync(path.join(ROOT, rel));
  console.log(`Wrote ${wanted.size} agent files for ${stations.length} agents${stale.length ? `, removed ${stale.length}` : ''}.`);
}
