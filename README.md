# json-pretty-toml

Convert JSON to flat TOML with max 2-level keys.

## Installation

```bash
npm install -g json-pretty-toml
```

Or use with npx (no installation):

```bash
npx json-pretty-toml < input.json
```

## Usage

```bash
json-pretty-toml < input.json > output.toml
```

## Rules

- First level → `[Table]`
- Second level primitive → `key = value`
- Second level object → `key.sub = { ... }`

## Example

Input:

```json
{
  "gateway": {
    "port": 18789,
    "auth": { "mode": "token" }
  }
}
```

Output:

```toml
[gateway]
port = 18789
auth.mode = "token"
```

## Requirements

- Node.js >= 23 (native TypeScript support)

## Development

```bash
bun install
bun test
```

## License

MIT
