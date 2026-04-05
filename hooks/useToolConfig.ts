"use client";

import { useLocalStorage } from "./useLocalStorage";
import { MathToolConfig } from "@/types/tool";

export const defaultMathConfig: MathToolConfig = {
  id: "default-math",
  type: "addition",
  mode: "random",
  layout: "vertical",
  digits: 2,
  columns: 2,
  allowDrag: true,
  count: 5,
  carryMode: "any",
  cardsPerRow: "auto",
};

export function useToolConfig() {
  const [config, setConfig] = useLocalStorage<MathToolConfig>(
    "mredukaron-active-tool",
    defaultMathConfig
  );

  const updateConfig = (updates: Partial<MathToolConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultMathConfig);
  }

  return { config, updateConfig, setConfig, resetConfig };
}
