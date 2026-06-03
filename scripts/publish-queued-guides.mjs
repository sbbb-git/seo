#!/usr/bin/env node
// Daily content drop: move guides whose `publishOn` date has arrived from
// data/guides-queue.json into data/guides.json, then commit. Designed to
// be called by the `daily-content` workflow.
//
// Idempotent: re-running on the same day skips already-published slugs.
// Date-safe: catches up if a previous day was missed (any overdue items
// publish on the next run).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const QUEUE = 'data/guides-queue.json';
const TARGET = 'data/guides.json';
const COMMIT_MSG_PATH = '/tmp/commit-msg.txt';

if (!existsSync(QUEUE)) {
  console.log('No queue file at', QUEUE, '— nothing to do.');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
const guides = JSON.parse(readFileSync(TARGET, 'utf8'));
const existingSlugs = new Set(guides.map((g) => g.slug));

const due = queue.filter(
  (g) => typeof g.publishOn === 'string' && g.publishOn <= today && !existingSlugs.has(g.slug),
);

if (due.length === 0) {
  console.log(`No guides scheduled for ${today}. Queue remaining: ${queue.length}.`);
  process.exit(0);
}

for (const g of due) {
  const { publishOn, ...guide } = g;
  guides.push(guide);
}
const remaining = queue.filter((g) => !due.includes(g));

writeFileSync(TARGET, JSON.stringify(guides, null, 2) + '\n');
writeFileSync(QUEUE, JSON.stringify(remaining, null, 2) + '\n');

console.log(`Published ${due.length} guides. Queue remaining: ${remaining.length}.`);
for (const g of due) console.log(`  - ${g.slug}`);

const summary = due.map((g) => `- ${g.title?.en || g.slug}`).join('\n');
const noun = due.length === 1 ? 'guide' : 'guides';
const msg = `content: scheduled drop ${today} — ${due.length} ${noun}

${summary}

https://claude.ai/code/session_01KMh6tcjcNbc61GocexZdAH
`;
writeFileSync(COMMIT_MSG_PATH, msg);
