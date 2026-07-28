# Laravel Interview Track

This track focuses on Laravel and PHP backend interviews where candidates are
asked to debug imports, build APIs, design queues, reason about performance, and
explain tradeoffs in an existing codebase.

## 1. Product Feed Import Debugging

**Question:** A marketplace import command reads a product feed and stores
products in MySQL or PostgreSQL. The tests fail because hidden products appear,
missing names are inserted, and the import runs too many SQL queries. How would
you approach it?

**Senior answer outline:**

- Start with the tests and domain rules before changing code.
- Treat feed data as untrusted input. Validate required fields such as external
  ID, name, status, visibility, price, and stock.
- Filter disabled or hidden products before persistence.
- Reject or quarantine rows with missing required fields instead of relying only
  on database errors.
- Replace row-by-row writes with batched `insert`, `upsert`, or chunked
  operations.
- Add a unique key on the external feed ID so imports are idempotent.
- Record import statistics: processed rows, skipped rows, created rows, updated
  rows, and failures.

**Typical implementation shape:**

```php
final class ImportProductFeed
{
    public function __construct(
        private ProductFeedReader $reader,
        private ProductFeedValidator $validator,
        private ProductRepository $products,
        private ImportReporter $reporter,
    ) {}

    public function handle(string $path): ImportSummary
    {
        foreach ($this->reader->chunks($path, 500) as $chunk) {
            $validRows = $this->validator->validVisibleRows($chunk);
            $this->products->upsertFromFeed($validRows);
            $this->reporter->record($chunk, $validRows);
        }

        return $this->reporter->summary();
    }
}
```

**Follow-ups:**

- How do you test that query count does not regress?
- What happens if the feed contains the same product twice?
- How would you resume an import after a worker crash?

## 2. Laravel Queues And Failed Jobs

**Question:** A queued import job fails randomly when an upstream API is slow.
How would you make it production-ready?

**Senior answer outline:**

- Configure timeouts, attempts, and backoff explicitly.
- Make the job idempotent by using unique constraints, stable external IDs, or
  an import run ID.
- Split a large import into smaller jobs so retrying one failure does not replay
  the whole import.
- Use failed-job storage and provide an operator path for retrying or inspecting
  failures.
- Avoid silently swallowing exceptions. Record enough context to debug without
  logging secrets.
- Consider `ShouldBeUnique` or deduplication locks for jobs that must not run
  concurrently.

**Good answer signal:**

- You mention both the queue mechanics and the domain data consistency.
- You distinguish retryable failures from permanent validation failures.
- You know how an operator would recover the system after a bad deployment or
  outage.

## 3. Fake Store API Integration

**Question:** Build an endpoint that imports products from a public store API,
normalizes the response, and exposes filterable product data. What matters?

**Senior answer outline:**

- Put the HTTP client behind an interface so tests do not depend on the real
  network.
- Validate external response fields before mapping.
- Use DTOs or data objects for the normalized shape.
- Store external IDs with a unique constraint.
- Handle partial failures by reporting which records failed and why.
- Protect the import endpoint with authentication or an internal command,
  depending on the product requirement.

**API contract example:**

```http
POST /api/imports/fake-store
GET /api/products?category=electronics&min_price=50&sort=-price&page=1
```

## 4. Filtering And Sorting APIs

**Question:** The frontend needs product filtering by category, price range, and
stock state. How do you keep the API flexible without making it unsafe?

**Senior answer outline:**

- Accept only documented filter and sort parameters.
- Validate query parameters with Form Requests or a dedicated query DTO.
- Build query scopes for composable filters.
- Map API field names to database columns instead of exposing raw table names.
- Add database indexes based on actual query patterns.
- Test combinations, invalid parameters, empty results, and pagination metadata.

**Example query-scope shape:**

```php
Product::query()
    ->when($filters->category, fn ($query) => $query->whereCategory($filters->category))
    ->when($filters->inStock !== null, fn ($query) => $query->where('stock', $filters->inStock ? '>' : '=', 0))
    ->orderBy($filters->sortColumn(), $filters->sortDirection())
    ->paginate($filters->perPage());
```

## 5. URL Status Worker

**Question:** Design a Laravel worker that receives URLs, checks their HTTP
status, and stores the result.

**Senior answer outline:**

- Use a request model or job table with states such as pending, processing,
  completed, failed, and expired.
- Validate URLs before enqueueing work.
- Use Laravel's HTTP client with timeout and retry settings.
- Store status code, response time, redirect URL, checked-at timestamp, and
  error category.
- Limit concurrency and consider per-host rate limits.
- Make the job retry-safe and avoid duplicate records by using a stable request
  ID or URL hash.

**Follow-ups:**

- How do you handle DNS failures?
- How do you prevent SSRF when users submit URLs?
- How would you show progress for a batch?

## 6. Caching And Freshness

**Question:** A product listing endpoint is slow but the data can be five
minutes stale. What caching design would you use?

**Senior answer outline:**

- Cache by normalized filter key, not raw query string.
- Use short TTLs for highly dynamic data and explicit invalidation for known
  writes.
- Avoid cache stampede with locks or refresh-ahead for hot keys.
- Cache the read model, not user-specific authorization decisions, unless the
  key includes user context.
- Add metrics for hit rate, miss latency, and refresh failures.

## 7. Validation Boundaries

**Question:** Where should validation live in a Laravel application?

**Senior answer outline:**

- Form Requests or controller-level validation protect HTTP boundaries.
- Domain services still need invariants for code paths that do not enter through
  HTTP.
- Database constraints protect final integrity.
- External input mappers should validate third-party data before it enters the
  core model.
- Tests should cover all important boundaries, not only the happy-path request.

## 8. Laravel Testing Strategy

**Question:** What should be tested in a Laravel assessment repository?

**Senior answer outline:**

- Feature tests for API contracts, validation errors, auth rules, and database
  state.
- Unit tests for pure mappers, filters, and policies.
- Queue tests that assert jobs are dispatched with the right payload and that
  job handlers are idempotent.
- Database tests for migrations, indexes, and unique constraints where relevant.
- Regression tests for previously discovered bugs.

## 9. PHP API Caller Exercise

**Question:** Write a small API caller that fetches remote records, filters by a
field, sorts by another field, and prints results. What makes the solution
senior?

**Senior answer outline:**

- Separate CLI parsing, HTTP access, filtering, sorting, and formatting.
- Validate supported fields and sort directions.
- Handle network failure and invalid JSON.
- Keep output deterministic for tests.
- Add fixtures and avoid depending on the live network in automated tests.

## 10. Senior Laravel Signals

**Question:** What does an interviewer notice in a strong Laravel solution?

**Senior answer outline:**

- Intentional boundaries: controllers stay thin, jobs are focused, services do
  one thing, and repositories are used only when they add value.
- Clear migrations and indexes.
- Idempotent writes for imports and queues.
- Honest error handling instead of blanket `try/catch`.
- Tests that prove business behavior, not only framework plumbing.
- Operational notes in the README: setup, commands, assumptions, and recovery.

