const packageJson = require('../package.json')
const fs = require('fs')

const newPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  packageManager: packageJson.packageManager,
  main: packageJson.main,
  scripts: {
    cli: 'node dist/apps/cli/main.js',
  }
}

fs.writeFileSync('dist/package.json', JSON.stringify(newPackageJson, null, 2))