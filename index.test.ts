import { test, expect } from 'bun:test'
import { TOMLWriter } from './index.js'

const writer = new TOMLWriter()

test('basic table', () => {
  const result = writer.convert({ server: { port: 8080 } })
  expect(result).toBe('[server]\nport = 8080')
})

test('nested object expansion', () => {
  const result = writer.convert({
    gateway: {
      auth: { mode: 'token', token: 'abc' },
    },
  })
  expect(result).toBe('[gateway]\nauth.mode = "token"\nauth.token = "abc"')
})

test('array with primitives - single line', () => {
  const result = writer.convert({ list: { items: ['a', 'b', 'c'] } })
  expect(result).toContain('[list]')
  expect(result).toContain('items = ["a", "b", "c"]')
})

test('array with objects - multi line', () => {
  const result = writer.convert({
    models: {
      items: [{ id: 'a', name: 'A' }],
    },
  })
  expect(result).toContain('[models]')
  expect(result).toContain('items = [\n')
  expect(result).toContain('  { id = "a", name = "A" },')
})

test('special characters in key', () => {
  const result = writer.convert({
    auth: { 'moonshot:default': { mode: 'api' } },
  })
  expect(result).toContain('[auth]')
  expect(result).toContain('"moonshot:default".mode = "api"')
})

test('null value', () => {
  const result = writer.convert({ data: { value: null } })
  expect(result).toContain('value = ""')
})

test('boolean and number', () => {
  const result = writer.convert({
    config: { enabled: true, count: 42, pi: 3.14 },
  })
  expect(result).toContain('enabled = true')
  expect(result).toContain('count = 42')
  expect(result).toContain('pi = 3.14')
})

test('top-level non-object', () => {
  const result = writer.convert({ name: 'simple' })
  expect(result).toContain('[name]')
  expect(result).toContain('value = "simple"')
})

test('empty array', () => {
  const result = writer.convert({ data: { items: [] } })
  expect(result).toContain('items = []')
})

test('nested object with arrays', () => {
  const result = writer.convert({
    ui: { allowed: { origins: ['*'], ports: [80, 443] } },
  })
  expect(result).toContain('allowed.origins = ["*"]')
  expect(result).toContain('allowed.ports = [80, 443]')
})

test('complex real-world gateway', () => {
  const json = {
    gateway: {
      port: 18789,
      controlUi: { allowedOrigins: ['*'] },
      auth: { mode: 'token', token: 'secret' },
    },
  }
  const result = writer.convert(json)
  expect(result).toContain('[gateway]')
  expect(result).toContain('port = 18789')
  expect(result).toContain('controlUi.allowedOrigins = ["*"]')
  expect(result).toContain('auth.mode = "token"')
  expect(result).toContain('auth.token = "secret"')
})

test('multi-line object in array', () => {
  const result = writer.convert({
    data: {
      items: [{ id: '1', name: 'First', extra: { foo: 'bar' } }],
    },
  })
  expect(result).toContain('[data]')
  expect(result).toContain('items = [\n')
  expect(result).toContain('  {\n')
  expect(result).toContain('    id = "1"')
})
