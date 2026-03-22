# json-pretty-toml

JSON 转扁平 TOML，最多两层 key。

## 安装

```bash
npm install -g json-pretty-toml
```

或直接用 npx：

```bash
npx json-pretty-toml < input.json
```

## 使用

```bash
json-pretty-toml < input.json > output.toml
```

## 规则

- 第一层 → `[Table]`
- 第二层简单值 → `key = value`
- 第二层对象 → `key.sub = { ... }`

## 示例

```json
{
  "gateway": {
    "port": 18789,
    "auth": { "mode": "token" }
  }
}
```

输出：

```toml
[gateway]
port = 18789
auth.mode = "token"
```

## 要求

Node.js >= 23

## 开发

```bash
bun install
bun test
```

## License

MIT
