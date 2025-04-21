const fs = require('fs');
const path = require('path');

try {
  const tailwindPkgPath = require.resolve('tailwindcss/package.json');
  const pkg = require(tailwindPkgPath);
  const versionFile = path.join(path.dirname(tailwindPkgPath), 'version.js');

  if (!fs.existsSync(versionFile)) {
    const content = `module.exports = { version: '${pkg.version}' };\n`;
    fs.writeFileSync(versionFile, content, 'utf8');
    console.log(`[fix-tailwind-version] Created missing version.js for Tailwind v${pkg.version}`);
  }
} catch (err) {
  console.error('[fix-tailwind-version] Could not patch Tailwind:', err.message);
}
