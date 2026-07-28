import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'LICENSE',
  'package.json',
  '.gitignore',
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
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Repository checks passed.');

