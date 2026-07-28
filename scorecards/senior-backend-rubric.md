# Senior Backend Rubric

Use this rubric to evaluate interview answers, take-home submissions, and live
debugging exercises.

## Score Levels

| Score | Meaning |
| --- | --- |
| 1 | Incomplete or mostly incorrect. |
| 2 | Works only for the happy path. |
| 3 | Correct with basic tests and acceptable structure. |
| 4 | Production-aware with clear tradeoffs and strong tests. |
| 5 | Senior-level: robust, observable, scalable, secure, and easy to change. |

## Correctness

**Score 5 looks like:**

- Requirements are implemented directly.
- Edge cases are named and tested.
- Invalid input fails clearly.
- Repeated execution is safe where the domain requires idempotency.

**Weak signals:**

- Hidden requirements are ignored.
- Tests pass by hardcoding expected fixtures.
- Errors are swallowed or converted to vague messages.

## Architecture

**Score 5 looks like:**

- Controllers, commands, jobs, use cases, domain logic, and adapters have clear
  responsibilities.
- External services sit behind interfaces or ports.
- Data mapping is explicit.
- Abstractions reduce coupling instead of hiding simple code.

**Weak signals:**

- Controllers contain import logic, HTTP calls, validation, and persistence.
- Tests require live external APIs.
- Framework convenience replaces domain clarity.

## Performance

**Score 5 looks like:**

- Large files are streamed or chunked.
- Database writes are batched where appropriate.
- Indexes match common query patterns.
- Queue concurrency and retry behavior are controlled.
- Memory and event loop blocking risks are considered.

**Weak signals:**

- Full files are loaded into memory without limit.
- One database query runs per row on large imports.
- Retry loops can overload dependencies.

## Testing

**Score 5 looks like:**

- Unit tests cover pure logic.
- Feature or integration tests cover public contracts.
- Failure paths are tested.
- Test doubles replace live networks.
- Regression tests capture discovered bugs.

**Weak signals:**

- Only the happy path is tested.
- Tests assert implementation details rather than behavior.
- External services are required for the normal test suite.

## Security

**Score 5 looks like:**

- Input is validated at boundaries.
- URL workers defend against SSRF.
- Secrets are not logged.
- Rate limits and timeouts exist.
- SQL and sort fields are allowlisted.

**Weak signals:**

- Raw request parameters become query builder field names.
- Submitted URLs can access private networks.
- Error logs expose tokens, credentials, or full sensitive payloads.

## Operations

**Score 5 looks like:**

- README documents setup, commands, and assumptions.
- Health checks and logs are meaningful.
- Failed jobs can be inspected and retried.
- Migrations and rollback concerns are considered.
- Metrics identify slow imports, queue lag, and dependency failures.

**Weak signals:**

- "It works locally" is the only operational story.
- No plan exists for retry, recovery, or partial failure.

## Communication

**Score 5 looks like:**

- The candidate explains tradeoffs clearly.
- Assumptions are stated without over-explaining.
- Debugging steps are methodical.
- The final summary names what changed and how it was verified.

**Weak signals:**

- The candidate silently edits for a long time.
- They rewrite unrelated code.
- They cannot explain why the chosen approach fits the problem.

