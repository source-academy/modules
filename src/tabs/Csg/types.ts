/* [Exports] */

// React Component Props for the CSG tab
export type Props = {
  debuggerContext: DebuggerContext;
};

// React Component State for the CSG tab
export type State = {
  zoomTooltip: String;
  angleTooltip: String;
  perspectiveTooltip: String;
  fitTooltip: String;
};

// DebuggerContext which is in the frontend's WorkspaceTypes
export type DebuggerContext = any;
