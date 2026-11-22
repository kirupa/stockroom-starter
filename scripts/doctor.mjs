// A readiness check for the context system. Where "npm run check" looks for
// mistakes, this looks for gaps: kinds of work with no rules, no examples, no
// agent, or starter rules nobody has replaced yet.
//
//   npm run doctor             print the checklist
//   npm run doctor -- --json   print it as JSON
//   npm run doctor -- --strict exit with 1 if anything is missing

import fs from 'node:fs';
import path from 'node:path';
import { build } from 'stockroom-context/src/build.js';
import { Counter } from 'stockroom-context/src/counter.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const STARTER_MARKER = '<!-- Starter rules.';
const LONG_SECTION = 40;

build(ROOT);
const counter = new Counter({ root: ROOT, maxCalls: Infinity });
const q = (sql, ...params) => counter.connected(() => counter.db.prepare(sql).all(...params));

const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'stockroom.json'), 'utf8'));
const stations = fs.readdirSync(path.join(ROOT, 'stations'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ file: `stations/${f}`, text: fs.readFileSync(path.join(ROOT, 'stations', f), 'utf8') }));

const kinds = new Set(config.shelves.flatMap((s) => s.for ?? []));
for (const row of q("SELECT DISTINCT applies_to FROM files WHERE applies_to != ''")) {
  for (const k of row.applies_to.split(',').filter(Boolean)) kinds.add(k);
}
for (const row of q('SELECT DISTINCT topic FROM examples')) kinds.add(row.topic);

const report = { kinds: [], general: [] };
const item = (status, text, next = null) => ({ status, text, next });

for (const kind of [...kinds].sort()) {
  const items = [];
  const work = q(`SELECT count(*) AS n FROM files WHERE kind = 'code' AND applies_to LIKE ?`, `%,${kind},%`)[0].n;
  const shelves = config.shelves.filter((s) => (s.for ?? []).includes(kind)).map((s) => `${s.path}/`);
  items.push(work
    ? item('ok', `${work} file${work === 1 ? '' : 's'} of ${kind} work on the shelves`)
    : item('missing', `No ${kind} work on the shelves yet`, shelves.length
      ? `Put finished ${kind} work in ${shelves.join(' or ')}. Examples don't count, because agents reuse what's on the shelves.`
      : `Add a shelf for ${kind} to stockroom.json (the add-kind-of-work skill does this).`));

  const rules = q(`SELECT s.heading, s.level, f.path FROM sections s JOIN files f ON f.id = s.file_id
    WHERE f.kind = 'guidance' AND (f.applies_to = '' OR f.applies_to LIKE ?)`, `%,${kind},%`);
  const files = [...new Set(rules.map((r) => r.path))];
  items.push(rules.length
    ? item('ok', `${rules.length} rule section${rules.length === 1 ? '' : 's'} in ${files.join(', ')}`)
    : item('missing', `No rules for ${kind}`, `Use the write-rules skill to write guidance with "for: [${kind}]" at the top.`));

  // Two files that both apply to this kind of work and share a heading usually
  // means two rules for the same thing, which an agent can't reconcile.
  const seen = new Map();
  for (const r of rules.filter((x) => x.level > 1)) {
    const key = r.heading.toLowerCase();
    seen.set(key, [...(seen.get(key) ?? []), r.path]);
  }
  for (const [heading, paths] of seen) {
    const unique = [...new Set(paths)];
    if (unique.length > 1) {
      items.push(item('missing', `Two sets of rules for "${heading}" apply to ${kind}: ${unique.join(' and ')}`,
        `Keep one, or take ${kind} out of the other file's "for:" line.`));
    }
  }

  const starter = q(`SELECT f.path FROM files f WHERE f.kind = 'guidance' AND f.applies_to LIKE ? AND instr(f.body, ?) > 0`, `%,${kind},%`, STARTER_MARKER);
  if (starter.length) {
    items.push(item('todo', `Still using the starter rules in ${starter.map((r) => r.path).join(', ')}`,
      'Use the write-rules skill to replace them with your own, then delete the "Starter rules" comment.'));
  }

  for (const verdict of ['approved', 'rejected']) {
    const n = q('SELECT count(*) AS n FROM examples WHERE topic = ? AND verdict = ?', kind, verdict)[0].n;
    items.push(n
      ? item('ok', `${n} ${verdict} example${n === 1 ? '' : 's'}`)
      : item('missing', `No ${verdict} examples for ${kind}`, `Use the add-example skill to add one to examples/${kind}/${verdict}/ with the reason next to it.`));
  }

  const agent = stations.find((s) => s.text.includes(`for: ${kind}`));
  items.push(agent
    ? item('ok', `An agent asks for ${kind} rules: ${agent.file}`)
    : item('missing', `No agent asks for ${kind} rules`, 'Use the add-kind-of-work skill to add a station for it.'));

  report.kinds.push({ kind, items });
}

const noNote = q(`SELECT f.path FROM examples e JOIN files f ON f.id = e.file_id
  WHERE e.note_path IS NULL AND (e.note IS NULL OR e.note = f.summary)`);
if (noNote.length) {
  report.general.push(item('todo', `${noNote.length} example${noNote.length === 1 ? ' has' : 's have'} no reason next to ${noNote.length === 1 ? 'it' : 'them'}: ${noNote.map((r) => r.path).join(', ')}`,
    'Add a Markdown file with the same name, with verdict and note in its front matter.'));
}

const untagged = q("SELECT path FROM files WHERE kind = 'guidance' AND applies_to = ''");
if (untagged.length) {
  report.general.push(item('todo', `Guidance without a "for:" line applies to every kind of work: ${untagged.map((r) => r.path).join(', ')}`,
    'Add "for: [...]" to the front matter so each agent only sees the rules for its work.'));
}

const sections = q(`SELECT s.file_id, s.heading, s.start_line, s.level, f.path FROM sections s JOIN files f ON f.id = s.file_id
  WHERE f.kind = 'guidance' ORDER BY f.path, s.start_line`);
const long = [];
sections.forEach((s, i) => {
  if (s.level < 2) return;
  const next = sections.slice(i + 1).find((n) => n.file_id === s.file_id && n.level <= s.level);
  const lines = q('SELECT lines FROM files WHERE id = ?', s.file_id)[0].lines;
  const length = (next ? next.start_line : lines + 1) - s.start_line;
  if (length > LONG_SECTION) long.push(`${s.path} > ${s.heading} (${length} lines)`);
});
if (long.length) {
  report.general.push(item('todo', `Long rule sections, which agents have to read in one piece: ${long.join(', ')}`,
    'Split each one under smaller headings, one topic per heading.'));
}

// Names the rules tell agents to use should exist in the code.
const unknown = q(`SELECT DISTINCT s.name, f.path FROM symbols s JOIN files f ON f.id = s.file_id
  WHERE f.kind = 'guidance' AND s.role = 'use' AND s.kind IN ('token', 'class')
    AND s.name NOT IN (SELECT name FROM symbols s2 JOIN files f2 ON f2.id = s2.file_id WHERE s2.role = 'def' AND f2.kind = 'code')
  ORDER BY f.path, s.name`).filter((u) => /^(--|\.)[A-Za-z_]/.test(u.name));
if (unknown.length) {
  report.general.push(item('missing', `The rules mention names that aren't defined anywhere: ${unknown.map((u) => `${u.name} (${u.path})`).join(', ')}`,
    'Define them in the code, or fix the rule so agents aren\'t sent looking for something that doesn\'t exist.'));
} else {
  report.general.push(item('ok', 'Every token and class the rules mention is defined'));
}

const tokens = q("SELECT count(DISTINCT name) AS n FROM symbols WHERE kind = 'token' AND role = 'def'")[0].n;
report.general.push(tokens
  ? item('ok', `${tokens} design tokens defined`)
  : item('missing', 'No design tokens defined', 'Put your colors, fonts, and sizes in site/css/tokens.css as CSS custom properties.'));

const skipped = q('SELECT path, reason FROM skipped');
if (skipped.length) {
  report.general.push(item('todo', `${skipped.length} file${skipped.length === 1 ? ' is' : 's are'} left out of the index: ${skipped.map((s) => `${s.path} (${s.reason})`).join(', ')}`,
    'Agents will say a person needs to look at these. Move secrets out of the shelves, or split big files.'));
}
counter.close();

const all = [...report.kinds.flatMap((k) => k.items), ...report.general];
const count = (status) => all.filter((i) => i.status === status).length;
report.summary = { ok: count('ok'), todo: count('todo'), missing: count('missing') };

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const mark = { ok: '[x]', todo: '[~]', missing: '[ ]' };
  const print = (i) => {
    console.log(`  ${mark[i.status]} ${i.text}`);
    if (i.next) console.log(`      next: ${i.next}`);
  };
  for (const k of report.kinds) {
    console.log(`\n${k.kind}`);
    k.items.forEach(print);
  }
  console.log('\neverything');
  report.general.forEach(print);
  console.log(`\n${report.summary.ok} ready, ${report.summary.todo} to improve, ${report.summary.missing} missing.`);
}
if (process.argv.includes('--strict') && report.summary.missing) process.exitCode = 1;
