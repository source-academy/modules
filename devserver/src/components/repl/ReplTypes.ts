import type { InterpreterOutput } from "../../types";

export type OutputProps = {
  output: InterpreterOutput;
  usingSubst?: boolean;
  isHtml?: boolean;
};
