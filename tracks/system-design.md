# System Design Track

These prompts prepare backend engineers for conversations that begin as coding
tasks but quickly become architecture discussions: imports, queues, caching,
read models, observability, and failure recovery.

## 1. Marketplace Product Import Pipeline

**Prompt:** Design a system that imports supplier product feeds every hour and
keeps the marketplace catalog searchable.

**Strong answer structure:**

- Ingestion receives supplier files or API responses and records an import run.
- Validation separates accepted rows, rejected rows, and rows needing manual
  review.
- Persistence writes the catalog source of truth with idempotent keys such as
  supplier ID plus external product ID.
- Indexing updates a search read model asynchronously.
- Observability tracks import duration, rejected row count, queue lag, indexing
  failures, and stale products.

**Tradeoffs to name:**

- Row-by-row import is simple but slow. Chunked upserts are better for large
  feeds.
- Synchronous indexing gives immediate freshness but couples API latency to
  search availability.
- A separate search index improves relevance and filter speed but introduces
  eventual consistency.

**Failure modes:**

- Supplier sends malformed data.
- Import job crashes midway.
- Database write succeeds but indexing fails.
- Search index is rebuilt while users are searching.
- A feed removes products accidentally.

**Senior recovery plan:**

- Store import runs and row-level failures.
- Use idempotent upserts.
- Track product freshness and last-seen timestamps.
- Reindex from the database source of truth.
- Add operator commands for retrying failed imports and failed index jobs.

## 2. URL Monitoring Worker

**Prompt:** Design a service that checks millions of URLs daily and shows the
latest status for each URL.

**Core components:**

- API for submission and status reads.
- Database for URL metadata and latest result.
- Queue for check jobs.
- Worker pool with bounded concurrency.
- Metrics and logs for queue health.

**Scalability notes:**

- Partition by URL hash or customer ID when one table becomes hot.
- Use per-host rate limits to avoid hammering a single domain.
- Keep historical observations in a separate table or time-series store.
- Store normalized URL hashes to avoid duplicate work.

**Security notes:**

- Block private network ranges to reduce SSRF risk.
- Enforce HTTP and HTTPS only.
- Set strict timeouts and maximum response size.
- Avoid following redirects indefinitely.

## 3. Filterable Product API

**Prompt:** A product list endpoint supports category, price, stock, sort, and
pagination. It has become slow as the catalog grows. How do you improve it?

**Answer outline:**

- Inspect query plans before changing architecture.
- Add indexes for the most common filter and sort combinations.
- Normalize query input and reject unsupported sorts.
- Move expensive derived fields to a read model when needed.
- Use cursor pagination for large, changing datasets.
- Cache common anonymous queries with short TTLs.
- Add freshness and invalidation rules around cache entries.

**When to introduce search:**

- Keyword relevance, autocomplete, faceting, typo tolerance, and ranking
  requirements exceed what a relational database query should handle.

## 4. Queue Failure Design

**Prompt:** A queue worker processes payments, imports, or indexing jobs. What
does a production-ready failure design include?

**Answer outline:**

- Explicit retry count and backoff.
- Idempotent handlers.
- Dead-letter or failed-job storage.
- Alerting on failure rate and queue age.
- Operator commands for retry and discard.
- Audit trail for business-sensitive actions.
- Separation between transient infrastructure failure and permanent domain
  validation failure.

**Interview phrase that lands well:**

> I want every retry to be safe, every permanent failure to be explainable, and
> every stuck queue to be visible before users report it.

## 5. Cache Design

**Prompt:** A slow endpoint can tolerate five minutes of stale data. Design the
cache.

**Answer outline:**

- Define cache keys from normalized inputs.
- Set TTL based on business freshness.
- Protect hot keys from stampede with locks or refresh-ahead.
- Invalidate intentionally on writes that matter.
- Avoid caching user-specific authorization unless the cache key includes user
  identity and permission state.
- Measure hit rate, miss latency, and stale reads.

## 6. Search Read Model

**Prompt:** A marketplace wants keyword search, filters, sort, autocomplete, and
boosting by stock and freshness.

**Answer outline:**

- Store canonical product data in the relational database.
- Project searchable documents into OpenSearch or Elasticsearch.
- Map category, supplier, region, stock, price, tags, allergens, and freshness
  into index fields.
- Use analyzers for text fields and keyword fields for exact filters.
- Queue indexing after catalog changes.
- Rebuild the index from the database source of truth.
- Track index version, failed indexing jobs, and search latency.

**Relevance discussion:**

- Exact name matches should rank high.
- In-stock and fresh products may receive a boost.
- Filters should not change scoring unexpectedly.
- Sort modes such as price should be explicit and tested.

## 7. Interview Communication Pattern

Use this rhythm when answering system design questions:

1. Restate the goal and constraints.
2. Define the data model.
3. Draw the request or job flow.
4. Name the failure modes.
5. Discuss scale and tradeoffs.
6. Explain how you would test and operate it.

