# Exercise: Node.js Stream Transform

Write a Node.js command that reads a large text file, transforms each row, and
writes a normalized output file without loading the entire input into memory.

## Prompt

The input file contains newline-delimited product names. Each output line should
be trimmed, converted to uppercase, and skipped if it becomes empty.

## Constraints

- The input can be larger than available memory.
- Partial lines can span multiple chunks.
- Stream errors must reject the command.
- Output order must match input order.
- The transform should be unit-testable without real files.

## Suggested Design

```text
CLI -> NormalizeFileUseCase -> createReadStream
                            -> ProductNameTransform
                            -> createWriteStream
```

## Transform Implementation Idea

```ts
import { Transform, TransformCallback } from 'node:stream';

export class ProductNameTransform extends Transform {
  private carry = '';

  override _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const parts = `${this.carry}${chunk.toString('utf8')}`.split('\n');
    this.carry = parts.pop() ?? '';

    const output = parts
      .map((line) => line.trim().toUpperCase())
      .filter(Boolean)
      .join('\n');

    if (output) {
      this.push(`${output}\n`);
    }

    callback();
  }

  override _flush(callback: TransformCallback) {
    const output = this.carry.trim().toUpperCase();
    if (output) {
      this.push(`${output}\n`);
    }
    callback();
  }
}
```

## Test Cases

- Empty input creates empty output.
- Whitespace-only lines are skipped.
- `apple\nbanana` becomes `APPLE\nBANANA\n`.
- A chunk boundary inside `banana` still produces one normalized row.
- A read error rejects the use case.
- A write error rejects the use case.

## Senior Discussion

Backpressure is the main reason this design is safer than `readFile`. The
readable stream should slow down when the writable stream cannot keep up.
`pipeline` is preferred because it forwards errors and cleans up stream stages.

## Extensions

- Add CSV parsing while preserving quoted commas.
- Add concurrency-limited enrichment from an external API.
- Add progress events every N rows.
- Add a maximum row length to defend against malformed input.

