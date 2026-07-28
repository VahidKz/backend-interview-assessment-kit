# Exercise: Laravel Product Feed Import

Build or repair a Laravel command that imports marketplace products from a CSV
feed. The goal is to demonstrate debugging, data validation, query efficiency,
and clean boundaries.

## Prompt

A supplier sends this CSV:

```csv
external_id,name,status,visible,price_cents,stock
p-100,Organic Apple,active,true,249,40
p-101,,active,true,199,20
p-102,Hidden Pear,active,false,299,15
p-103,Disabled Banana,disabled,true,129,0
```

Only active and visible products with a non-empty name should be imported.

## Requirements

- Create an Artisan command: `catalog:import-products {path}`.
- Validate each row before persistence.
- Skip invalid, hidden, or disabled rows with a reason.
- Upsert by `external_id`.
- Process large files in chunks.
- Return an import summary.
- Add tests for filtering, validation, idempotency, and query count.

## Suggested Migration

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('external_id')->unique();
    $table->string('name');
    $table->unsignedInteger('price_cents');
    $table->unsignedInteger('stock');
    $table->timestamps();
});
```

## Application Shape

```text
Console Command -> ImportProductFeed
                -> ProductFeedReader
                -> ProductFeedRowValidator
                -> ProductRepository
                -> ImportSummary
```

## Solution Outline

1. Parse the CSV in chunks instead of reading the whole file.
2. Convert each row into a typed data object.
3. Reject rows when `status !== active`, `visible !== true`, or `name` is empty.
4. Use `upsert` with `external_id` as the unique key.
5. Collect summary counts and failure reasons.
6. Keep logging concise: include row number and reason, not the entire feed.

## Example Summary

```json
{
  "processed": 4,
  "created": 1,
  "updated": 0,
  "skipped": 3,
  "skipReasons": {
    "missing_name": 1,
    "not_visible": 1,
    "disabled": 1
  }
}
```

## Tests

- Imports only `p-100` from the sample feed.
- Running the command twice does not duplicate products.
- A row with an empty name is skipped before hitting the database constraint.
- The importer uses chunked/batched persistence.
- Invalid files fail with a clear error.

## Senior Talking Points

- Database constraints are the last line of defense, not the only validation.
- Upsert makes repeated imports safe.
- Chunking controls memory and query volume.
- Import summaries help product and operations teams understand partial success.
- A queue can be added later by dispatching one job per chunk or per supplier
  feed, depending on retry needs.

