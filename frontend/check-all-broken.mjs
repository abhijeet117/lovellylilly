import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname, resolve } from 'path'

const PROJECT_ROOT = process.cwd()
const FEATURES_ROOT = join(PROJECT_ROOT, 'src/features')

function pathExists(base, rel) {
  const abs = resolve(base, rel)
  const candidates = [
    abs,
    abs + '.jsx', abs + '.tsx', abs + '.js', abs + '.ts',
    join(abs, 'index.jsx'), join(abs, 'index.tsx'), join(abs, 'index.js'), join(abs, 'index.ts'),
  ]
  return candidates.some(c => {
    try { return statSync(c).isFile() } catch(e) { return false }
  })
}

function getAllFiles(dir, files = []) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files)
    } else if (['.jsx', '.tsx', '.js', '.ts'].includes(extname(entry))) {
      files.push(fullPath)
    }
  }
  return files
}

const allFiles = getAllFiles(FEATURES_ROOT)
console.log(`Scanning ${allFiles.length} files in features...`)

for (const filePath of allFiles) {
  const content = readFileSync(filePath, 'utf-8')
  const dirOfFile = dirname(filePath)
  const lines = content.split('\n')
  
  lines.forEach((line, i) => {
    const match = line.match(/(import|from)\s+(['"])(\.\.?\/[^'"]+)\2/)
    if (match) {
      const relPath = match[3]
      if (!pathExists(dirOfFile, relPath)) {
        console.log(`❌ BROKEN: ${filePath.replace(PROJECT_ROOT, '')}:${i+1} : ${relPath}`)
      }
    }
  })
}
