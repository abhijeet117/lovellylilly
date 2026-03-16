import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join, extname, dirname, resolve } from 'path'

const PROJECT_ROOT = process.cwd()
const FEATURES_ROOT = join(PROJECT_ROOT, 'src/features')
const UI_ROOT = join(PROJECT_ROOT, 'src/components/ui')
const AUTH_COMP_ROOT = join(PROJECT_ROOT, 'src/features/auth/components')

const SOURCE_FILE = join(AUTH_COMP_ROOT, 'PasswordStrengthMeter.jsx')
const DEST_FILE = join(UI_ROOT, 'PasswordStrengthMeter.jsx')

// 1. Move and consolidate
console.log('📦 Consolidating PasswordStrengthMeter...')
try {
  const content = readFileSync(SOURCE_FILE, 'utf-8')
  writeFileSync(DEST_FILE, content, 'utf-8')
  console.log('✅ Successfully consolidated to src/components/ui/')
  // unlinkSync(SOURCE_FILE) // Keeping it for now just in case, will delete at end
} catch (e) {
  console.error('❌ Could not read source file:', e.message)
}

// 2. Global Import Fix
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

console.log(`\n🔍 Scanning ${allFiles.length} feature files for broken imports...`)

for (const filePath of allFiles) {
  let content = readFileSync(filePath, 'utf-8')
  let lines = content.split('\n')
  let changed = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Fix: components/PasswordStrengthMeter -> components/ui/PasswordStrengthMeter
    if (line.includes('components/PasswordStrengthMeter')) {
      lines[i] = line.replace('components/PasswordStrengthMeter', 'components/ui/PasswordStrengthMeter')
      changed = true
      console.log(`🔧 FIXED UI PATH: ${filePath.replace(PROJECT_ROOT, '')}:${i+1}`)
    }
  }

  if (changed) {
    writeFileSync(filePath, lines.join('\n'), 'utf-8')
    fixCount++
  }
}

console.log(`\n✅ Finished global fix. Total files updated: ${fixCount}`)
