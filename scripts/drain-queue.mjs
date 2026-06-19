#!/usr/bin/env node
// Drain: move every item in data/guides-queue.json into data/guides.json now,
// stripping publishOn. Idempotent on slug (skips dupes).
import { readFileSync, writeFileSync } from 'node:fs';

const QUEUE = 'data/guides-queue.json';
const GUIDES = 'data/guides.json';

const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
const guides = JSON.parse(readFileSync(GUIDES, 'utf8'));
const existing = new Set(guides.map((g) => g.slug));

let added = 0;
let skipped = 0;
for (const item of queue) {
  if (existing.has(item.slug)) { skipped++; continue; }
  const { publishOn, ...guide } = item;
  guides.push(guide);
  existing.add(item.slug);
  added++;
}

writeFileSync(GUIDES, JSON.stringify(guides, null, 2) + '\n');
writeFileSync(QUEUE, '[]\n');

console.log(`Drained queue: ${added} published, ${skipped} skipped as dupes.`);
console.log(`Guides total: ${guides.length}. Queue: 0.`);
