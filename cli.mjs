#!/usr/bin/env node
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(`json-pretty-toml - Convert JSON to flat TOML

Usage:
  json-pretty-toml < input.json > output.toml

Options:
  -h, --help    Show this help message

Sample:
  echo '{"server":{"port":8080}}' | json-pretty-toml

Output:
  [server]
  port = 8080
`)
  process.exit(0)
}

import { TOMLWriter } from './index.ts'

async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

const input = await readStdin()

let json
try {
  json = JSON.parse(input)
} catch {
  console.error('Error: Invalid JSON input')
  process.exit(1)
}

const writer = new TOMLWriter()
console.log(writer.convert(json))
