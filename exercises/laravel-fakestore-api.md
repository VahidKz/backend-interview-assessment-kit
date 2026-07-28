# Exercise: Laravel External Product API

Build a Laravel API that imports product data from a remote store endpoint and
exposes a local, filterable product listing.

## Prompt

Create a small service that fetches product records from a third-party HTTP API,
normalizes the data, stores it locally, and returns products through your own
API.

## Requirements

- `POST /api/imports/products` triggers an import.
- `GET /api/products` lists imported products.
- Filters: `category`, `min_price`, `max_price`, `in_stock`.
- Sorts: `price`, `-price`, `name`, `-name`, `created_at`, `-created_at`.
- Pagination: `page` and `per_page`, with a maximum `per_page`.
- The HTTP client must be fakeable in tests.
- Invalid remote records should not break the whole import.

## Suggested Boundaries

```text
ProductImportController -> ImportRemoteProducts
                         -> RemoteProductClient
                         -> RemoteProductMapper
                         -> ProductRepository

ProductController -> ListProducts
                  -> ProductFilter
                  -> ProductRepository
```

## Mapping Rules

- Use the remote ID as `external_id`.
- Normalize price to cents.
- Trim names and categories.
- Default missing stock to zero only if the business accepts that behavior.
- Reject records with no ID, name, or valid price.

## Example Filter Object

```php
final readonly class ProductFilters
{
    public function __construct(
        public ?string $category,
        public ?int $minPrice,
        public ?int $maxPrice,
        public ?bool $inStock,
        public string $sort,
        public int $page,
        public int $perPage,
    ) {}
}
```

## Test Cases

- Import stores valid remote products.
- Import skips malformed remote products and reports the skipped count.
- Re-import updates existing products by `external_id`.
- Unknown sort fields return validation errors.
- `per_page` above the maximum is rejected or capped intentionally.
- Filtering by category and price returns the expected subset.

## Senior Discussion

The important design choice is not the public API itself; it is the boundary
around the remote dependency. A strong solution treats the remote API as
unreliable, keeps network calls out of tests, validates mapped data, and makes
repeated imports safe.

## Extensions

- Dispatch the import to a queue and expose import status.
- Add rate-limit handling when the upstream API throttles requests.
- Add a dead-letter table for rejected records.
- Add product search as a separate read model when filtering becomes expensive.

