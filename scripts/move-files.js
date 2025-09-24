const fs = require('fs');
const path = require('path');

const srcDir = 'docs/browser';
const destDir = 'docs';

// Function to copy a directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Check if browser directory exists
if (fs.existsSync(srcDir)) {
  console.log('Moving files from docs/browser to docs...');

  // Get all items in the browser directory
  const items = fs.readdirSync(srcDir);

  items.forEach(item => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Remove the browser directory
  fs.rmSync(srcDir, { recursive: true, force: true });

  console.log('✅ Files successfully moved from docs/browser to docs');
  console.log('✅ Browser directory removed');
} else {
  console.log('❌ docs/browser directory not found');
}
