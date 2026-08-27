import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

const creator = RuleCreator(
  name => `https://source-academy.github.io/modules/devdocs/lib/lintplugin/2-rules/${name}.html`
);

export default creator;
