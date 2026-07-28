# Source Notes

These public sources were used as research signals on July 28, 2026. The
questions and solution guides in this repository are original and paraphrased.

## Official Documentation

| Source | Signal Used |
| --- | --- |
| [Node.js: Don't Block the Event Loop](https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop) | Runtime questions should test blocking CPU work, event loop responsiveness, and moving expensive work out of request handlers. |
| [Node.js: Event Loop, Timers, and `nextTick`](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) | Event loop answers should distinguish JavaScript execution from async I/O handled outside the main callback path. |
| [Node.js Streams API](https://nodejs.org/api/stream.html) | Stream exercises should cover readable, writable, transform, `pipeline`, and error handling. |
| [Node.js: How To Use Streams](https://nodejs.org/learn/modules/how-to-use-streams) | Large-file exercises should emphasize chunked processing and backpressure. |
| [Laravel Queues](https://laravel.com/docs/13.x/queues) | Laravel queue answers should cover attempts, backoff, failed jobs, retry, and operational recovery. |
| [Laravel Validation](https://laravel.com/docs/13.x/validation) | Import and API exercises should validate at HTTP and data-ingestion boundaries. |
| [Laravel Query Builder](https://laravel.com/docs/13.x/queries) | Product import and filter exercises should discuss allowlisted query fields and upsert-style idempotency. |
| [Laravel HTTP Tests](https://laravel.com/docs/13.x/http-tests) | Laravel API exercises should include feature tests for validation, contracts, and database state. |

## Forums, Discussions, And GitHub Repositories

| Source | Signal Used |
| --- | --- |
| [GitHub Community discussion: large CSV imports in Laravel](https://github.com/orgs/community/discussions/166350) | Large imports should avoid request timeouts, keep the UI responsive, and report row-level failures. |
| [Laravel Excel discussion: CSV import performance](https://github.com/SpartnerNL/Laravel-Excel/discussions/3586) | For CSV-only workloads, candidates should consider simpler streaming parsers and measure library overhead. |
| [Laravel 12 large CSV queue example repository](https://github.com/itstuffsolutions/laravel-12-import-large-csv-file-using-queue-step-by-step-guide) | Queue-based CSV imports are a common public teaching pattern for chunking and background processing. |
| [Laracasts discussion: CSV import best practice](https://laracasts.com/discuss/channels/requests/best-practice-for-csv-file-import) | Community advice commonly points to file validation and queued processing for imports. |
| [Reddit Laravel thread: processing a million-line CSV](https://www.reddit.com/r/laravel/comments/y6yeq3/need_help_in_processing_a_csv_file_with_around_a/) | Memory-efficient line-by-line processing is a repeated concern in Laravel import questions. |
| [rahuljindal1/node-interview-questions](https://github.com/rahuljindal1/node-interview-questions) | Node.js repositories often focus on streams, backpressure, `pipe`, `pipeline`, and error handling. |
| [NodeJS interview questions gist](https://gist.github.com/paulfranco/9f88a2879b7b7d88de5d1921aef2093b) | Public question banks repeatedly test async APIs, event loop basics, and runtime fundamentals. |
| [Devinterview Node.js interview repository](https://github.com/Devinterview-io/node-interview-questions) | Public interview prep commonly covers event loop, thread pool, Express, and production backend concepts. |
| [Devinterview Laravel interview repository](https://github.com/Devinterview-io/laravel-interview-questions) | Public Laravel prep commonly covers controllers, Eloquent, middleware, validation, and testing. |
