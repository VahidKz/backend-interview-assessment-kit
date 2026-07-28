# Exercise: Node.js URL Status Worker

Build a small Node.js service that accepts URLs, checks their HTTP status in the
background, and exposes the latest result.

This is an original exercise inspired by recurring backend assessment patterns:
queues, retries, HTTP timeouts, idempotency, validation, and operational
visibility.

## Product Brief

Support teams want to monitor a list of supplier catalog URLs. Users submit a
batch of URLs. The system should check each URL asynchronously and store the
latest result.

## Public API

```http
POST /url-checks
GET /url-checks/:id
GET /url-checks?status=completed&page=1&limit=20
```

## Functional Requirements

- Accept a list of HTTP or HTTPS URLs.
- Reject invalid URLs and non-HTTP protocols.
- Deduplicate URLs inside the same request.
- Enqueue one job per accepted URL.
- Fetch each URL with a timeout.
- Store status code, response time, checked-at timestamp, redirect target, and
  error category.
- Retry transient failures with exponential backoff.
- Expose pending, processing, completed, and failed states.

## Non-Functional Requirements

- Limit worker concurrency.
- Make the job idempotent.
- Avoid logging full sensitive URLs.
- Add request IDs to logs.
- Add tests for validation, enqueueing, worker success, worker failure, and
  pagination.

## Suggested Data Model

```ts
type UrlCheckStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface UrlCheck {
  id: string;
  normalizedUrl: string;
  urlHash: string;
  status: UrlCheckStatus;
  httpStatusCode?: number;
  responseTimeMs?: number;
  redirectUrl?: string;
  errorCategory?: 'timeout' | 'dns' | 'tls' | 'http' | 'network' | 'unknown';
  attempts: number;
  checkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Architecture Shape

```text
Controller -> SubmitUrlChecksUseCase -> UrlCheckRepository
                                      -> UrlCheckQueue

Worker -> CheckUrlUseCase -> HttpClientPort
                         -> UrlCheckRepository
                         -> Logger/Metrics
```

## Solution Notes

- Normalize URLs before hashing. For example, lowercase the host and remove
  fragments.
- Use a unique index on `urlHash` if the latest result per URL is enough. Use a
  separate request table if each submitted batch needs its own audit trail.
- Keep HTTP fetching behind a port so worker tests can simulate timeouts,
  redirects, and DNS failures.
- Use a queue library such as BullMQ when Redis is available. For a tiny local
  exercise, an in-memory queue is acceptable only if the limitation is explicit.
- Use `AbortController` with `fetch` so timeout behavior is controlled by your
  code instead of hanging sockets.

## Acceptance Tests

- `POST /url-checks` rejects `file://etc/passwd`.
- Duplicate URLs in the same payload produce one queued job.
- A successful `200` response moves the record to `completed`.
- A timeout records `errorCategory = timeout` and retries when attempts remain.
- A repeated job does not create duplicate rows.
- `GET /url-checks` paginates deterministically.

## Interview Walkthrough

Open with the operational model: "I split request ingestion from URL checking so
the API remains fast and the worker can be retried independently." Then explain
how validation protects security, how idempotency prevents duplicate work, and
how failed jobs are inspected.

## Senior Extensions

- Add per-host rate limiting.
- Block private IP ranges to reduce SSRF risk.
- Store historical observations separately from the latest status.
- Emit metrics for queue depth, job duration, failure category, and retry count.

