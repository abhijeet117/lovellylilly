const fs = require('fs');
let c = fs.readFileSync('src/lib/animations/useLandingPageMotion.ts', 'utf8');
c = c.replace(/toggleActions:\s*'play none none reverse'/g, "once: true");
fs.writeFileSync('src/lib/animations/useLandingPageMotion.ts', c);
console.log('Reverted to once: true');
