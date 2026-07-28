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
  'docs/local-assessment-map.md',
];

const expectedLocalAssessmentFiles = [
  'assessment_report.md',
  'laravel_assessment_report.md',
  'laravel_reconstructed_question_prompts.md',
  'nodejs_forums_interviewreport.md',
  'nodejs_github_report.md',
  'interview-practice\\q1-product-feed\\Q1_CODE_WALKTHROUGH.md',
  'interview-practice\\q1-product-feed\\proxify-mediafy-assignment-be\\README.md',
  'README.md',
  'metisix-site\\TASK_PLANS.md',
  'metisix-site\\IMPLEMENTATION_NOTES.md',
  'metisix-site\\ACTION_PLAN.md',
  'metisix-site\\AI_PLAYBOOK.md',
  'metisix-site\\marketing\\audit-template.md',
  'metisix-site\\marketing\\capture-kit.md',
  'metisix-site\\marketing\\content-calendar.md',
  'metisix-site\\marketing\\fiverr-gigs.md',
  'metisix-site\\marketing\\linkedin.md',
  'metisix-site\\marketing\\outreach.md',
  'metisix-site\\marketing\\proposals.md',
  'metisix-site\\marketing\\review-flywheel.md',
  'research\\notes\\softwareangels-study.md',
  'research\\notes\\reference-analysis.md',
  'research\\notes\\originalsoftware-study.md',
  'research\\notes\\metisix-direction.md',
  'research\\notes\\metisix-ai-storybook.md',
  'research\\notes\\homepage-section-blueprints.md',
  'research\\notes\\design-patterns.md',
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

const localAssessmentMap = readFileSync(join(root, 'docs/local-assessment-map.md'), 'utf8');
for (const file of expectedLocalAssessmentFiles) {
  if (!localAssessmentMap.includes(file)) {
    failures.push(`Local assessment map is missing: ${file}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Repository checks passed.');
