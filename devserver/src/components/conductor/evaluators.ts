import languageDefinitions from '@sourceacademy/language-directory/dist/directory.json' with { type: 'json' };
import type { IEvaluatorDefinition, ILanguageDefinition } from '@sourceacademy/language-directory/dist/types';
import { generateLanguageMap } from '@sourceacademy/language-directory/dist/util';

export const languageMap = generateLanguageMap(languageDefinitions as ILanguageDefinition[]);

export const evaluatorDefinitionsByLanguage = (languageDefinitions as ILanguageDefinition[]).reduce<Record<string, IEvaluatorDefinition[]>>((res, { name, evaluators }) => {
  return {
    ...res,
    [name]: evaluators
  };
}, {});
