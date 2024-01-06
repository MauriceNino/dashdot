const { deploy } = require('@docusaurus/core/lib/commands/deploy');

deploy(__dirname, {
  skipBuild: true,
  outDir: '../../dist/apps/docs',
});
