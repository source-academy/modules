import type { ModuleSideContent } from "@sourceacademy/modules-lib/types";

type RequireProvider = (s: string) => any;

declare const partialTab: (provider: RequireProvider) => {
  default: ModuleSideContent
};

export default partialTab;