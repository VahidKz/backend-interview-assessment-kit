# 14-Day Backend Interview Plan

This plan is for a backend engineer preparing for Laravel, Node.js, queue,
import, API, and system design interviews.

## Day 1: Baseline

- Read `README.md`.
- Answer five questions from `tracks/nodejs.md` and five from
  `tracks/laravel.md` without looking at the outlines.
- Score yourself with `scorecards/senior-backend-rubric.md`.

## Day 2: Node Runtime

- Study event loop, blocking work, worker pool, and streams.
- Implement the stream transform exercise.
- Explain backpressure out loud in two minutes.

## Day 3: Node HTTP Integrations

- Practice Fetch and Axios error semantics.
- Write test cases for timeout, non-2xx status, invalid JSON, and retry.
- Design an HTTP client abstraction.

## Day 4: Node Queue Worker

- Implement the URL worker exercise at pseudocode or project level.
- Add idempotency rules.
- Explain retry, dead-letter handling, and metrics.

## Day 5: Laravel Import Debugging

- Work through the product feed import exercise.
- Write the failing tests first.
- Practice explaining why filtering belongs before persistence.

## Day 6: Laravel Queues

- Review job attempts, backoff, failed jobs, and uniqueness.
- Convert the import into chunked queued work.
- Explain how an operator retries failures.

## Day 7: API Filtering And Sorting

- Build a filter object for product listing.
- Allowlist sort fields.
- Add pagination tests and invalid-parameter tests.

## Day 8: Testing Day

- Take one Node exercise and one Laravel exercise.
- Add tests for happy path, invalid input, dependency failure, and idempotency.
- Remove any test that relies on the live network.

## Day 9: System Design Imports

- Answer the marketplace import pipeline prompt.
- Draw the flow from supplier feed to database to search/read model.
- Name five failure modes and recovery paths.

## Day 10: Caching And Read Models

- Practice cache key design and invalidation.
- Explain when search belongs outside the relational database.
- Discuss eventual consistency honestly.

## Day 11: Security Review

- Review SSRF, input validation, secret logging, SQL injection through dynamic
  sorts, and rate limits.
- Add a security note to one exercise solution.

## Day 12: Live Debugging

- Run through `drills/live-debugging.md`.
- Timebox each drill to 20 minutes.
- Practice narrating hypotheses calmly.

## Day 13: Mock Interview

- Pick one coding exercise and one system design prompt.
- Record yourself explaining the design and tradeoffs.
- Score the answer with the rubric.

## Day 14: Final Polish

- Revisit weak areas from the rubric.
- Prepare three stories: a performance fix, a production incident, and a design
  tradeoff.
- Review common mistakes and senior talking points.

