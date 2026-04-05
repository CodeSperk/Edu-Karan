export type ToolMode = "random" | "custom";
export type ToolLayout = "vertical" | "horizontal";
export type CarryMode = "any" | "with-carry" | "without-carry";
export type MathOperator = "addition" | "subtraction" | "multiplication" | "division";

export interface ToolConfig {
  id: string;
  type: string;
  mode: ToolMode;
}

export interface MathToolConfig extends ToolConfig {
  type: MathOperator;
  digits: number;
  columns: number;
  layout: ToolLayout;
  allowDrag: boolean;
  numbers?: number[];
  count: number;
  carryMode: CarryMode;
  cardsPerRow?: number | "auto";
}
