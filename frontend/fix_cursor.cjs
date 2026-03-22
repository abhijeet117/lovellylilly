const fs = require('fs');
const glob = require('glob'); // Not available? I'll just use fs recursively or find
const execSync = require('child_process').execSync;
try {
  const result = execSync('find src -name "*.css" -type f').toString().split('\n').filter(Boolean);
  for (const file of result) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('cursor: none')) {
      content = content.replace(/cursor:\s*none;?/g, 'cursor: pointer;');
      fs.writeFileSync(file, content);
      console.log('Fixed cursor in ' + file);
    }
  }
} catch (e) {
  // Check typical files instead if find fails (windows)
  const files = ['src/index.css', 'src/App.css', 'src/pages/LandingPage.css'];
  for (const file of files) {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('cursor: none')) {
        content = content.replace(/cursor:\s*none;?/g, 'cursor: pointer;');
        fs.writeFileSync(file, content);
        console.log('Fixed cursor in ' + file);
      }
    }
  }
}
