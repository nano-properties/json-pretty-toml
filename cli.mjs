#!/usr/bin/env node

class TOMLWriter {
  indent = '  '

  convert(json) {
    const lines = []

    for (const [tableName, tableValue] of Object.entries(json)) {
      lines.push(`[${this.formatKey(tableName)}]`)

      if (this.isObject(tableValue)) {
        for (const [secondKey, secondValue] of Object.entries(tableValue)) {
          if (this.isObject(secondValue)) {
            for (const [thirdKey, thirdValue] of Object.entries(secondValue)) {
              const dottedKey = `${this.formatKey(secondKey)}.${this.formatKey(thirdKey)}`
              lines.push(`${dottedKey} = ${this.formatValue(thirdValue, '')}`)
            }
          } else {
            lines.push(`${this.formatKey(secondKey)} = ${this.formatValue(secondValue, '')}`)
          }
        }
      } else {
        lines.push(`value = ${this.formatValue(tableValue, '')}`)
      }

      lines.push('')
    }

    return lines.join('\n').trim()
  }

  formatValue(value, currentIndent) {
    if (value === null) return '""'
    if (typeof value === 'string') return JSON.stringify(value)
    if (typeof value === 'number') return String(value)
    if (typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) {
      return this.formatArray(value, currentIndent)
    }
    if (this.isObject(value)) {
      return this.formatInlineTable(value, currentIndent)
    }
    return String(value)
  }

  formatArray(arr, currentIndent) {
    if (arr.length === 0) return '[]'

    const hasObject = arr.some((v) => this.isObject(v))
    if (!hasObject) {
      const items = arr.map((v) => this.formatValue(v, currentIndent)).join(', ')
      return `[${items}]`
    }

    const nextIndent = currentIndent + this.indent
    const items = arr.map((v) => {
      const formatted = this.isObject(v) ? this.formatInlineTable(v, nextIndent) : this.formatValue(v, nextIndent)
      return `${nextIndent}${formatted},`
    })

    return `[\n${items.join('\n')}\n${currentIndent}]`
  }

  formatInlineTable(obj, currentIndent) {
    const nextIndent = currentIndent + this.indent
    const entries = Object.entries(obj)

    const isSimple = entries.length <= 2 && entries.every(([, v]) => !this.isObject(v) && !Array.isArray(v))

    if (isSimple) {
      const inline = entries.map(([k, v]) => `${this.formatKey(k)} = ${this.formatValue(v, currentIndent)}`).join(', ')
      return `{ ${inline} }`
    }

    const lines = entries.map(([k, v]) => {
      const value = this.formatValue(v, nextIndent)
      return `${nextIndent}${this.formatKey(k)} = ${value},`
    })

    return `{\n${lines.join('\n')}\n${currentIndent}}`
  }

  formatKey(key) {
    return /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(key)
  }

  isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }
}

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
