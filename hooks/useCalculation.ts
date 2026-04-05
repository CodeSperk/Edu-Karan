"use client";

import { useState } from "react";
import { AdditionProblem } from "@/lib/generator/addition";
import { verifyAdditionAnswer, calculateScore } from "@/lib/calculation/addition";

export function useCalculation(problems: AdditionProblem[]) {
  // Map of problem.id -> user's inputted number
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  
  const submitAnswer = (problemId: string, answer: number | null) => {
    setAnswers(prev => ({ ...prev, [problemId]: answer }));
  };
  
  const checkAnswer = (problemId: string): boolean | null => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return null;
    const userAnswer = answers[problemId];
    if (userAnswer === undefined || userAnswer === null) return null;
    
    return verifyAdditionAnswer(problem, userAnswer);
  };
  
  const getScore = () => {
    return calculateScore(problems, answers);
  };

  const resetCalculation = () => {
    setAnswers({});
  };
  
  return { answers, submitAnswer, checkAnswer, getScore, resetCalculation };
}
