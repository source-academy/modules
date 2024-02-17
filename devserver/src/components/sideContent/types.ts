import type { IconName } from "@blueprintjs/icons";
import type { Context } from "js-slang";
import type { JSX } from "react";

export type DebuggerContext = {
  context: Context
}

export type SideContentTab = {
  id: string
  label: string
  iconName: IconName
  body: JSX.Element
}

export type ModuleSideContent = {
  label: string;
  iconName: IconName
  toSpawn?: (context: DebuggerContext) => boolean
  body: (context: DebuggerContext) => JSX.Element
}
