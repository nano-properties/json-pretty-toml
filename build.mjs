#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs'

// 简单移除类型注解
const ts = readFileSync('index.ts', 'utf8')
const js = ts
  .replace(/:\s*Record<string\s*,\s*unknown>/g, '')
  .replace(/:\s*string\s*\[\]/g, '')
  .replace(/:\s*unknown/g, '')
  .replace(/:\s*string/g, '')
  .replace(/:\s*number/g, '')
  .replace(/:\s*boolean/g, '')
  .replace(/private\s+/g, '')
  .replace(/export\s+class/g, 'class')

writeFileSync('index.js', js)
console.log('Build complete: index.js')
