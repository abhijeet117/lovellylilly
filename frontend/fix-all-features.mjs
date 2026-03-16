import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname } from 'path'

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

console.log(`\n🔍 Scanning ${allFiles.length} feature files...`)

for (const filePath of allFiles) {
  let content = readFileSync(filePath, 'utf-8')
  let changed = false

  // Regex to catch all combinations of:
  // (1) ../ or ../../ or ../../../
  // (2) components/PasswordStrengthMeter
  // (3) missing /ui/
  const regex = /from\s+(['"])(\.\.\/)+(components\/PasswordStrengthMeter)\1/g
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, quote, dots, path) => {
      return `from ${quote}${dots}components/ui/PasswordStrengthMeter${quote}`
    })
    changed = true
    console.log(`🔧 FIXED: ${filePath.replace(PROJECT_ROOT, '')}`)
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf-8')
    fixCount++
  }
}

console.log(`\n✅ Finished global fix. Total files updated: ${fixCount}`)
