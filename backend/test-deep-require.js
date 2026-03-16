const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('./src');
files.forEach(file => {
    if (file.endsWith('.js')) {
        try {
            console.log(`Requiring ${file}...`);
            require('./' + file);
            console.log(`OK: ${file}`);
        } catch (err) {
            console.error(`FAILED: ${file}`);
            console.error(err.message);
            if (err.stack) console.error(err.stack);
        }
    }
});
