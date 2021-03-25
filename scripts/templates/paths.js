const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const manifest = path.resolve(root, 'modules.json');
const bundleTemplate = path.resolve(
  root,
  './scripts/templates/templates/__bundle__.ts'
);
const tabTemplate = path.resolve(
  root,
  './scripts/templates/templates/__tab__.tsx'
);

module.exports = {
  root,
  manifest,
  bundleTemplate,
  tabTemplate,
};
