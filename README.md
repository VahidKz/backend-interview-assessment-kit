# Backend Interview Assessment Kit

An original, practice-oriented interview preparation kit for backend engineers
working with Node.js, Laravel, PHP, queues, APIs, imports, streams, caching, and
system design.

The repository is written like a real assessment workbook: each question has the
signal an interviewer is looking for, a senior-level answer outline, common
mistakes, and follow-up prompts that expose depth.

## Why This Exists

Backend interviews often repeat the same shape even when the wording changes:
debug an import, design a queue worker, explain event loop behavior, optimize a
slow endpoint, write an API integration, or reason about failing tests in an
existing codebase.

This kit turns those recurring patterns into ethical, original practice
material. It does not copy private assessments or forum posts. Public sources
and local assessment notes were used as inputs for topic selection, then the
questions and solutions were rewritten from scratch.

## Repository Map

- `tracks/nodejs.md` - Node.js interview questions, senior answer outlines, and
  debugging prompts.
- `tracks/laravel.md` - Laravel and PHP backend questions covering imports,
  queues, APIs, testing, and performance.
- `tracks/system-design.md` - architecture prompts for job processing, caching,
  imports, and search-style read models.
- `exercises/` - practical take-home style drills with solution guides.
- `drills/` - live debugging and communication drills.
- `scorecards/` - rubrics for evaluating senior backend answers.
- `study-plans/` - structured preparation plans.
- `docs/` - source policy, public-source notes, and local assessment map.

## How To Use

1. Pick one track and answer out loud before reading the suggested answer.
2. Implement one exercise in a fresh branch with tests.
3. Score the result with `scorecards/senior-backend-rubric.md`.
4. Repeat the same problem with a stricter constraint: larger data volume,
   failing dependency, rate limit, partial retry, or missing test coverage.

## Quality Gate

Run the repository checks locally:

```bash
npm run check
```

The check verifies required files, Markdown headings, and that the local
assessment source map covers the important reports used to shape this kit.

## Source Ethics

This project uses public documentation, public GitHub discussions/repositories,
and local Markdown assessment notes as research signals. The content here is
paraphrased, synthesized, and organized as original study material.

See `docs/source-policy.md`, `docs/source-notes.md`, and
`docs/local-assessment-map.md` for the exact rules and source map used while
creating it.
