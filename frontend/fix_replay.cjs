const fs = require('fs');
let c = fs.readFileSync('src/lib/animations/useLandingPageMotion.ts', 'utf8');

// Replace globally once: true to toggleActions: 'play none none reverse'
c = c.replace(/once:\s*true/g, "toggleActions: 'play none none reverse'");

// For the philosophy grid (About section) and text, use 'play none none none' so it never jumps/blanks out
// Find data-philosophy-grid and data-quote-section
c = c.replace(/trigger: '\[data-philosophy-grid\]', start: 'top 84%', toggleActions: 'play none none reverse'/g, "trigger: '[data-philosophy-grid]', start: 'top 84%', toggleActions: 'play none none none'");
c = c.replace(/trigger: '\[data-quote-section\]', start: 'top 76%', toggleActions: 'play none none reverse'/g, "trigger: '[data-quote-section]', start: 'top 76%', toggleActions: 'play none none none'");
c = c.replace(/trigger: '\[data-quote-section\]', start: 'top 80%', toggleActions: 'play none none reverse'/g, "trigger: '[data-quote-section]', start: 'top 80%', toggleActions: 'play none none none'");
c = c.replace(/trigger: qt, start: 'top 78%', toggleActions: 'play none none reverse'/g, "trigger: qt, start: 'top 78%', toggleActions: 'play none none none'");

fs.writeFileSync('src/lib/animations/useLandingPageMotion.ts', c);
console.log('Restored scroll replayability for all except the unstable About section elements!');
