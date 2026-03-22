# json-pretty-toml

JSON 转扁平 TOML，最多两层 key。

## 安装

```bash
git clone https://github.com/nano-properties/json-pretty-toml.git
cd json-pretty-toml
bun install
```

## 使用

```bash
# 从文件转换
bun index.ts < in.json > out.toml

# 或直接输入
echo '{"a":{"b":1}}' | bun index.ts
```

## 规则

| JSON 层级 | TOML 输出 |
|-----------|-----------|
| 第一层 | `[Table]` |
| 第二层简单值 | `key = value` |
| 第二层对象 | `key.sub = { ... }` |

## 示例

输入：

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

## 测试

```bash
bun test
```

## License

MIT
