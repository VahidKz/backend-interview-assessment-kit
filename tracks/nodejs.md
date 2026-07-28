# Node.js Interview Track

This track focuses on backend interviews where Node.js is tested through
runtime behavior, API design, async control flow, streams, queues, data
integrity, and live debugging.

Use the prompts as spoken interview practice. A senior answer should explain
the tradeoff, name the failure mode, and show how the implementation would be
tested.

## 1. Event Loop And Blocking Work

**Question:** A Node.js API becomes slow whenever users upload large files and a
CSV normalization step runs. What is happening, and how would you fix it?

**Senior answer outline:**

- Node.js runs JavaScript callbacks on the event loop. CPU-heavy parsing,
  synchronous filesystem calls, huge JSON operations, or complex regular
  expressions can block unrelated requests.
- I would first measure the hot path with request timing, CPU profiling, and
  event loop delay metrics.
- Streaming parsing should replace full-file buffering when possible.
- CPU-heavy work should move to worker threads, a job queue, or a separate
  service. Network and filesystem operations should use non-blocking APIs.
- The endpoint should acknowledge upload receipt, persist job state, enqueue
  processing, and expose status through a separate read endpoint.

**Common mistakes:**

- Saying "Node.js is single threaded" without mentioning libuv, async I/O, or
  worker pool behavior.
- Moving work to a queue without adding idempotency or retry boundaries.
- Reading the entire file into memory before parsing.

**Follow-ups:**

- How would you detect event loop lag in production?
- When would you choose worker threads instead of BullMQ?
- How do you protect the upload endpoint from huge or malformed files?

## 2. Streams And Backpressure

**Question:** You need to process a 5 GB text export, transform each line, and
write the result to object storage. Why are streams safer than loading the file
into memory?

**Senior answer outline:**

- Streams process data in chunks, which keeps memory bounded.
- Backpressure lets a slow writable destination tell the readable source to slow
  down instead of buffering unbounded data.
- `pipeline` or `finished` should be used so errors from any stream stage are
  handled consistently.
- Line-level transforms should preserve partial lines across chunks.
- The implementation should test success, upstream failure, downstream failure,
  and partial line boundaries.

**Implementation sketch:**

```ts
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

export async function normalizeFile(input: string, output: string) {
  let carry = '';

  const normalizeLines = new Transform({
    transform(chunk, _encoding, callback) {
      const lines = `${carry}${chunk.toString('utf8')}`.split('\n');
      carry = lines.pop() ?? '';
      this.push(lines.map((line) => line.trim().toUpperCase()).join('\n'));
      callback();
    },
    flush(callback) {
      if (carry) this.push(carry.trim().toUpperCase());
      callback();
    },
  });

  await pipeline(
    createReadStream(input),
    normalizeLines,
    createWriteStream(output),
  );
}
```

**Follow-ups:**

- What changes if the transform makes HTTP calls?
- How would you limit concurrency inside a stream transform?
- How do you expose progress without coupling it to the stream code?

## 3. HTTP Integration With Retries

**Question:** Build a service that fetches products from a third-party API and
stores normalized records. How do you make the integration reliable?

**Senior answer outline:**

- Separate transport, mapping, persistence, and orchestration.
- Treat timeouts, non-2xx responses, schema drift, and rate limits as expected
  failure cases.
- Use explicit retry policies only for transient errors. Avoid retrying invalid
  data.
- Add idempotency keys or natural unique constraints so repeated imports do not
  duplicate records.
- Persist raw response metadata only when it helps debugging and does not leak
  secrets or violate data retention rules.

**Testing signal:**

- Unit-test the mapper.
- Contract-test the external response shape with fixtures.
- Integration-test retry and duplicate handling with test doubles.

## 4. Fetch, Axios, And Error Semantics

**Question:** What is an easy bug when replacing Axios with `fetch` in Node.js?

**Senior answer outline:**

- `fetch` resolves for HTTP error statuses. A `404` or `500` is not a rejected
  promise unless the request itself fails at the network layer.
- Code must check `response.ok` and decide how to map status codes to domain
  errors.
- Timeouts should use `AbortController` or a shared HTTP client abstraction.
- The body should be consumed carefully, because it can only be read once.

**Example:**

```ts
const response = await fetch(url, { signal });

if (!response.ok) {
  throw new ExternalApiError(response.status, await response.text());
}

return response.json();
```

## 5. Queue Worker Design

**Question:** Design a worker that checks thousands of URLs, records status
codes, and retries transient failures.

**Senior answer outline:**

- Model work as jobs with stable identifiers, attempts, state, timestamps, and
  last error.
- Keep the producer simple: validate input, deduplicate, enqueue.
- Keep the worker idempotent: re-running the same URL should update the same
  record or append a new observation intentionally.
- Use exponential backoff for network failures and explicit handling for
  permanent client errors.
- Limit concurrency and outbound rate. Protect DNS, sockets, and downstream
  services.
- Add dead-letter handling or failed-job inspection for repeated failures.

**Good production details:**

- Persist request duration, status code, redirect target, and failure category.
- Store enough metadata for support, but avoid logging full sensitive URLs.
- Emit metrics for queue depth, job duration, error rate, and retries.

## 6. JavaScript Proxy Validation

**Question:** A coding task asks you to validate assignments using a JavaScript
`Proxy`. What are the maintainability risks?

**Senior answer outline:**

- A `Proxy` can centralize runtime validation, but it hides normal assignment
  semantics.
- Validation should be deterministic, small, and side-effect free.
- The trap should return `true` for successful writes and throw domain-specific
  errors for invalid writes.
- For application DTOs, schema validators such as Zod, Joi, class-validator, or
  framework pipes are often clearer than Proxy-based magic.

**Follow-ups:**

- How do you keep error messages useful?
- When would runtime validation still be needed in a TypeScript project?
- What should happen for unknown properties?

## 7. API Pagination, Filtering, And Sorting

**Question:** Implement `GET /products` with filtering, sorting, and pagination.
What decisions matter?

**Senior answer outline:**

- Define allowed filters and sort fields explicitly. Never pass raw query
  strings into SQL or query builders.
- Use stable pagination. Offset pagination is simple; cursor pagination is
  better for large or frequently changing datasets.
- Keep total counts optional or cached when they become expensive.
- Return metadata such as page, limit, total when useful, and next cursor when
  using cursor pagination.
- Add compound indexes that match common filter and sort patterns.

**Common test cases:**

- Unknown sort field is rejected.
- `limit` has a maximum.
- Empty result is a valid successful response.
- Filtering and sorting compose correctly.

## 8. MongoDB Or Mongoose Transactions

**Question:** A registration flow creates a user, profile, and billing customer.
How do you avoid partial writes?

**Senior answer outline:**

- Put database writes that must commit together inside a transaction.
- External side effects, such as creating a billing customer, need a saga,
  outbox pattern, or compensating action because they cannot be rolled back by a
  database transaction.
- Use unique constraints for identity and retry-safe behavior.
- Keep transaction scope short and avoid network calls inside it.

## 9. Live Debugging Existing Code

**Question:** You receive a failing Node.js repository and a test suite. What is
your process?

**Senior answer outline:**

- Run the tests first and read the failure message before editing.
- Reproduce the smallest failing path.
- Inspect contracts around the failure: DTOs, schemas, database constraints,
  and mocked external clients.
- Add or adjust a test for the discovered behavior before changing production
  code when the expected behavior is clear.
- Keep the patch small, then run the relevant tests and a broader check.

**What interviewers watch:**

- Whether you explain assumptions as you go.
- Whether you resist broad rewrites.
- Whether you can distinguish root cause from incidental failures.

## 10. Senior System Thinking In Node.js

**Question:** What makes a Node.js backend "senior" beyond passing the coding
task?

**Senior answer outline:**

- Clear module boundaries and dependency direction.
- Controlled concurrency and memory use.
- Observability by design: logs, metrics, request IDs, health checks.
- Security hygiene: validation, secrets handling, rate limits, dependency
  review, least-privilege credentials.
- Test strategy that matches risk: unit tests for pure logic, integration tests
  for adapters, end-to-end tests for critical contracts.
- Operational thinking around deploys, migrations, retries, and rollback.

