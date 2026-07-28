# Live Debugging Drills

These drills prepare candidates for interviews where the task is an existing
codebase with failing tests, incomplete behavior, or hidden edge cases.

## Debugging Loop

Use this loop out loud:

1. Run the failing test or command.
2. Read the failure carefully.
3. Locate the smallest code path involved.
4. State the expected behavior.
5. Add or tighten a focused test if the behavior is not already captured.
6. Make the smallest production change.
7. Run the focused test, then the related suite.

## Drill 1: Hidden Products Are Imported

**Symptom:** A test expects hidden products to be skipped, but they appear in the
database.

**Likely root causes:**

- The importer validates only `status` and ignores `visible`.
- The feed parser treats `"false"` as truthy.
- The filter runs after persistence.

**Senior fix direction:**

- Normalize booleans explicitly.
- Filter before calling the repository.
- Add a regression test with string and boolean values.

## Drill 2: Missing Names Hit Database Errors

**Symptom:** Importing a feed fails with a database not-null exception for
`products.name`.

**Likely root causes:**

- Validation is missing at the import boundary.
- Empty strings are not normalized to null or rejected.
- The importer assumes the supplier feed is trustworthy.

**Senior fix direction:**

- Add a row validator with row number and failure reason.
- Skip or quarantine invalid rows before persistence.
- Keep the database constraint as a final guard.

## Drill 3: Too Many SQL Queries

**Symptom:** A product import passes functionally but times out on large feeds.

**Likely root causes:**

- One insert or update per row.
- Existence checks inside a loop.
- N+1 loading of related categories or suppliers.

**Senior fix direction:**

- Chunk rows.
- Preload reference data.
- Use batch `upsert`.
- Add a performance regression test around query count or execution time.

## Drill 4: Fetch Replacement Breaks Error Handling

**Symptom:** An API integration now treats `404` responses as successful empty
payloads.

**Likely root causes:**

- Code moved from Axios to `fetch` and expected non-2xx responses to throw.
- The response body is parsed before checking status.

**Senior fix direction:**

- Check `response.ok`.
- Map status codes to domain errors.
- Add tests for `200`, `404`, `429`, `500`, timeout, and invalid JSON.

## Drill 5: Stream Output Drops Last Line

**Symptom:** A file transform works for most rows but drops the last row when
the file has no trailing newline.

**Likely root causes:**

- The transform only pushes lines emitted by `split('\n')`.
- The remaining carry buffer is never flushed.

**Senior fix direction:**

- Keep a carry string between chunks.
- Push the carry in `_flush`.
- Test input with and without trailing newline.

## Drill 6: Queue Retries Duplicate Rows

**Symptom:** Retried jobs create duplicate products.

**Likely root causes:**

- Insert-only persistence.
- No unique index on the external ID.
- Job payload lacks a stable idempotency key.

**Senior fix direction:**

- Add a unique constraint.
- Use upsert or find-update-create inside a transaction.
- Make retry behavior part of the test suite.

## Interview Habits That Help

- Narrate the current hypothesis, not every keystroke.
- Keep the patch narrow.
- Prefer clear tests over clever fixes.
- Name the operational risk if the bug escaped to production.
- Explain what you would monitor after deploying the fix.

