import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname, resolve } from 'path'

const PROJECT_ROOT = process.cwd()
const FEATURES_ROOT = join(PROJECT_ROOT, 'src/features')

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
let fixCount = 0

function pathExists(base, rel) {
  const abs = resolve(base, rel)
  const candidates = [
    abs,
    abs + '.jsx',
    abs + '.tsx',
    abs + '.js',
    abs + '.ts',
    join(abs, 'index.jsx'),
    join(abs, 'index.tsx'),
    join(abs, 'index.js'),
    join(abs, 'index.ts'),
  ]
  return candidates.some(c => {
    try { return statSync(c).isFile() } catch(e) { return false }
  })
}

for (const filePath of allFiles) {
  let content = readFileSync(filePath, 'utf-8')
  let lines = content.split('\n')
  let changed = false
  const dirOfFile = dirname(filePath)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/(import|from)\s+(['"])(\.\.?\/[^'"]+)\2/)
    if (match) {
      const relPath = match[3]
      const quote = match[2]

      if (!pathExists(dirOfFile, relPath)) {
        // Try adding ../
        let deeperPath = join('..', relPath).replace(/\\/g, '/')
        if (pathExists(dirOfFile, deeperPath)) {
          lines[i] = line.replace(relPath, deeperPath)
          changed = true
          console.log(`🔧 FIXED (Deeper): ${filePath.replace(PROJECT_ROOT, '')} : ${relPath} -> ${deeperPath}`)
          continue
        }

        // Try removing ../
        if (relPath.startsWith('../../')) {
          let shallowerPath = relPath.substring(3)
          if (pathExists(dirOfFile, shallowerPath)) {
            lines[i] = line.replace(relPath, shallowerPath)
            changed = true
            console.log(`🔧 FIXED (Shallower): ${filePath.replace(PROJECT_ROOT, '')} : ${relPath} -> ${shallowerPath}`)
            continue
          }
        } else if (relPath.startsWith('../')) {
          let shallowerPath = relPath.substring(3)
          if (shallowerPath && pathExists(dirOfFile, shallowerPath)) {
            lines[i] = line.replace(relPath, shallowerPath)
            changed = true
            console.log(`🔧 FIXED (Shallower): ${filePath.replace(PROJECT_ROOT, '')} : ${relPath} -> ${shallowerPath}`)
            continue
          }
        }
        
        // Final attempt: Check if it's a specific known issue like missing '/ui/'
        if (relPath.includes('components/PasswordStrengthMeter')) {
            let uiPath = relPath.replace('components/PasswordStrengthMeter', 'components/ui/PasswordStrengthMeter')
            if (pathExists(dirOfFile, uiPath)) {
                lines[i] = line.replace(relPath, uiPath)
                changed = true
                console.log(`🔧 FIXED (Added /ui/): ${filePath.replace(PROJECT_ROOT, '')} : ${relPath} -> ${uiPath}`)
            }
        }
      }
    }
  }

  if (changed) {
    writeFileSync(filePath, lines.join('\n'), 'utf-8')
    fixCount++
  }
}

console.log(`\n✅ Finished. Total files fixed: ${fixCount}`)
