import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'LICENSE',
  'package.json',
  '.gitignore',
  '.github/workflows/ci.yml',
  'tracks/nodejs.md',
  'tracks/laravel.md',
  'tracks/system-design.md',
  'exercises/nodejs-url-worker.md',
  'exercises/nodejs-stream-transform.md',
  'exercises/laravel-product-feed-import.md',
  'exercises/laravel-fakestore-api.md',
  'drills/live-debugging.md',
  'scorecards/senior-backend-rubric.md',
  'study-plans/14-day-backend-interview-plan.md',
  'docs/source-policy.md',
  'docs/source-notes.md',
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

function listMarkdownFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return listMarkdownFiles(absolutePath);
    }

    return entry.endsWith('.md') ? [absolutePath] : [];
  });
}

for (const file of listMarkdownFiles(root)) {
  const content = readFileSync(file, 'utf8');
  if (!content.match(/^#\s.+/m)) {
    failures.push(`Markdown file must have an H1: ${relative(root, file)}`);
  }

  if (content.includes('TODO')) {
    failures.push(`Markdown file contains TODO placeholder: ${relative(root, file)}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Repository checks passed.');
