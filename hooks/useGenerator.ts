"use client";

import { useState, useCallback, useEffect } from "react";
import { MathToolConfig } from "@/types/tool";
import { generateMathProblems, MathProblem } from "@/lib/generator/math";

export function useGenerator(config: MathToolConfig) {
  const [data, setData] = useState<MathProblem[]>([]);
  
  const generate = useCallback(() => {
    setData(generateMathProblems(config));
  }, [config]);

  // Re-generate when core data constraints change natively
  useEffect(() => {
    generate();
  }, [config, generate]);

  return { data, generate, setData };
}
