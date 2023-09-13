import { IconName } from "@blueprintjs/icons"
import { Context } from "js-slang"

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