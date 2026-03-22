#!/usr/bin/env node
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
