import lintPlugin from '@sourceacademy/lint-plugin';

interface RuleInfo {
  name: string;
  desc: string;
}

export default {
  load() {
    return Object.entries(lintPlugin.rules).reduce<RuleInfo[]>((res, [name, rule]) => {
      return [
        ...res,
        { name, desc: rule.meta?.docs?.description ?? '' }
      ];
    }, []);
  }
};
