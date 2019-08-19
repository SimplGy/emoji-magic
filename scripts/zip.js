const fs = require('fs');
const child_process = require("child_process");

const zipFile = './dist/emoji-magic.zip';

try {
  fs.unlinkSync(zipFile); // rm if already there
} catch (err) {
  // it's fine if the file doesn't exist
}

// bring over only the good stuff
const includes = [
  'manifest.json',
  'icons/*.png',
  'src/*/*.js',
  'src/*/*.css',
  'src/*/*.html',
  '_locales',
  'src/*/data/*.js',
];

child_process.execSync(`zip -r ${zipFile} ${includes.join(' ')}`, {
  cwd: '.'
});