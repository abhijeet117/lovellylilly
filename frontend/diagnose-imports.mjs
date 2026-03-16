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

// Targets we care about
const commonDirs = ['components', 'context', 'layout', 'hooks', 'services', 'utils', 'styles']

for (const filePath of allFiles) {
  let content = readFileSync(filePath, 'utf-8')
  let lines = content.split('\n')
  let changed = false

  const dirOfFile = dirname(filePath)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Look for imports from common directories with ../ prefix
    const importMatch = line.match(/(import|from)\s+(['"])(\.\.\/[^'"]+)\2/)
    if (importMatch) {
      const relPath = importMatch[3]
      const quote = importMatch[2]
      
      // Check if this relPath points to one of our common dirs
      const parts = relPath.split('/')
      // If it starts with ../ and the next part is one of commonDirs or is another ../
      if (parts[0] === '..' && (commonDirs.some(d => parts.includes(d)) || parts[1] === '..')) {
        
        let currentResolved = resolve(dirOfFile, relPath)
        // Check if it exists as a file or directory
        let exists = false
        try {
          // Try exact, .jsx, .js, /index.jsx, /index.js
          const candidates = [
            currentResolved,
            currentResolved + '.jsx',
            currentResolved + '.js',
            join(currentResolved, 'index.jsx'),
            join(currentResolved, 'index.js')
          ]
          exists = candidates.some(c => {
            try { return statSync(c).isFile() || statSync(c).isDirectory() } catch(e) { return false }
          })
        } catch (e) {}

        if (!exists) {
          // Try adding one more ../
          let deeperPath = join('..', relPath).replace(/\\/g, '/')
          let deeperResolved = resolve(dirOfFile, deeperPath)
          
          let deeperExists = false
          const deeperCandidates = [
            deeperResolved,
            deeperResolved + '.jsx',
            deeperResolved + '.js',
            join(deeperResolved, 'index.jsx'),
            join(deeperResolved, 'index.js')
          ]
          deeperExists = deeperCandidates.some(c => {
            try { return statSync(c).isFile() || statSync(c).isDirectory() } catch(e) { return false }
          })

          if (deeperExists) {
            lines[i] = line.replace(relPath, deeperPath)
            changed = true
            console.log(`🔧 Fixed in ${dirname(filePath).replace(PROJECT_ROOT, '')}\\${dirname(filePath).split('\\').pop()}: ${relPath} -> ${deeperPath}`)
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

console.log(`\n✅ Finished scan. Fixed ${fixCount} files.`)
