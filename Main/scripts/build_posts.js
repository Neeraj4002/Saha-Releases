#!/usr/bin/env node
/**
 * Builds posts.json from markdown files in /posts.
 *
 * Each markdown file should start with YAML-ish frontmatter:
 *
 * ---
 * title: Why we built Saha without a feed
 * date: 2026-05-12
 * tag: Philosophy
 * excerpt: One or two sentences shown on the blog listing.
 * draft: false
 * ---
 * Actual markdown content goes here...
 *
 * Run: node scripts/build-posts.js
 * Output: posts.json (array of post objects), used by blog.html / post.html
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'posts.json');

function slugify(s) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'post'
  );
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, content: raw.trim() };
  }

  const [, fmBlock, content] = match;
  const meta = {};

  for (const line of fmBlock.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    // Strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value === 'true') value = true;
    else if (value === 'false') value = false;

    meta[key] = value;
  }

  return { meta, content: content.trim() };
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`No posts directory found at ${POSTS_DIR}`);
    fs.writeFileSync(OUTPUT_FILE, '[]\n');
    return;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.md'));

  const posts = files.map((file) => {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { meta, content } = parseFrontmatter(raw);

    const baseName = file.replace(/\.md$/i, '');
    const title = meta.title || baseName;
    const id = meta.id || slugify(title);

    return {
      id,
      title,
      date: meta.date || '1970-01-01',
      tag: meta.tag || '',
      excerpt: meta.excerpt || '',
      draft: meta.draft === true || meta.draft === 'true',
      content,
    };
  });

  // Newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2) + '\n');
  console.log(`Wrote ${posts.length} post(s) to ${OUTPUT_FILE}`);
}

build();