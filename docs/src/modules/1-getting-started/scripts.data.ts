import _package from '../../../../package.json' with { type: 'json' };

type Script = {
  name: string
  info: string
};

export default {
  watch: ['../../../../package.json'],
  load() {
    const [globalScripts, rootScripts] = Object.keys(_package.scripts).reduce<[Script[], Script[]]>(([globals, roots], scriptNames) => {
      const scriptInfo = _package['scripts-info'][scriptNames];

      if (scriptInfo === undefined) return [globals, roots];
      const script: Script = {
        name: scriptNames,
        info: scriptInfo
      };

      if (scriptNames.includes(':')) {
        return [[...globals, script ], roots];
      } else {
        return [globals, [...roots, script]];
      }
    }, [[], []]);

    return {
      globalScripts,
      rootScripts
    };
  }
};
