const fs = require('fs');
let c = fs.readFileSync('src/lib/animations/useLandingPageMotion.ts', 'utf8');
c = c.replace(/once:\s*true/g, "toggleActions: 'play none none reverse'");
fs.writeFileSync('src/lib/animations/useLandingPageMotion.ts', c);
console.log('Done replacement');
