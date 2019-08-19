const fs = require('fs');
const child_process = require("child_process");

const zipFile = './dist/emoji-magic.zip';

fs.unlinkSync(zipFile); // rm if already there

// bring over only the good stuff
const includes = [
  'manifest.json',
  'icons/*.png',
  'src/*/*.js',
  'src/*/*.css',
  'src/*/*.html',
  'src/*/data/*.js',
];

child_process.execSync(`zip -r ${zipFile} ${includes.join(' ')}`, {
  cwd: '.'
});