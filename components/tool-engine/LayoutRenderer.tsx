"use client";

import * as React from "react";
import { AdditionProblem } from "@/lib/generator/addition";
import { ToolLayout } from "@/types/tool";

interface LayoutRendererProps {
  layoutType: "vertical" | "horizontal";
  operatorType?: "addition" | "subtraction" | "multiplication" | "division";
  problem: any;
  userAnswer: number | null;
  onAnswerChange: (ans: number | null) => void;
  isCorrect: boolean | null;
  totalQuestions: number;
  allowDrag: boolean;
  colorVariant?: number;
}

export function LayoutRenderer({ layoutType, operatorType = "addition", problem, userAnswer, onAnswerChange, isCorrect, totalQuestions, allowDrag, colorVariant }: LayoutRendererProps) {
  
  const sign = operatorType === "addition" ? "+" : operatorType === "subtraction" ? "-" : operatorType === "multiplication" ? "×" : "÷";
  
  const statusColor = isCorrect === true ? "text-green-600 dark:text-green-400 border-green-500 ring-green-500/20" : isCorrect === false ? "text-red-500 border-red-500 ring-red-500/20" : "border-input";
  
  const themes = [
    "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100",
    "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50 text-sky-950 dark:text-sky-100",
    "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100",
    "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100",
    "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 text-purple-950 dark:text-purple-100"
  ];
  
  const cardStyle = isCorrect === true ? "bg-green-100/50 border-green-300" : isCorrect === false ? "bg-red-100/50 border-red-300" : themes[(colorVariant || 0) % themes.length];
  const bgStatus = isCorrect === true ? "bg-green-500/20" : isCorrect === false ? "bg-red-500/20" : "bg-card/80";

  // Dynamic scaling based on totalQuestions
  let textScale = "text-3xl sm:text-4xl";
  let inputScale = "text-3xl sm:text-4xl w-full max-w-[150px]";
  let paddingScale = "p-5 md:p-6 gap-2";
  let containerScale = "w-fit";

  if (totalQuestions === 1) {
    textScale = "text-5xl sm:text-6xl md:text-8xl";
    inputScale = "text-5xl sm:text-6xl md:text-8xl w-full max-w-[250px] md:max-w-[400px]";
    paddingScale = "p-8 md:p-14 gap-4 md:gap-6";
    containerScale = "w-full max-w-4xl mx-auto flex-1 min-h-[25vh] flex justify-center";
  } else if (totalQuestions === 2) {
    textScale = "text-4xl sm:text-5xl md:text-6xl";
    inputScale = "text-4xl sm:text-5xl md:text-6xl w-full max-w-[200px] md:max-w-[280px]";
    paddingScale = "p-6 md:p-8 gap-4";
    containerScale = "w-full mx-auto";
  }

  // Prevent Horizontal wrapping by estimating char-length and aggressively reducing font size
  if (layoutType === "horizontal") {
    const totalChars = problem.numbers.join("").length + (problem.numbers.length * 2);
    if (totalChars > 16) {
      textScale = "text-xl sm:text-2xl md:text-3xl";
      inputScale = "text-xl sm:text-2xl md:text-3xl w-full max-w-[100px] md:max-w-[140px]";
    } else if (totalChars > 11) {
      textScale = "text-2xl sm:text-3xl md:text-4xl";
      inputScale = "text-2xl sm:text-3xl md:text-4xl w-full max-w-[120px] md:max-w-[160px]";
    } else if (totalQuestions === 1 && totalChars > 7) {
      textScale = "text-4xl sm:text-5xl md:text-6xl";
      inputScale = "text-4xl sm:text-5xl md:text-6xl w-full max-w-[180px] md:max-w-[240px]";
    }
  }
  
  if (layoutType === "vertical") {
    return (
      <div className={`flex flex-col items-end text-right font-mono rounded-xl border shadow-sm transition-all hover:shadow-md ${cardStyle} ${paddingScale} ${containerScale}`}>
        <div className="flex flex-col w-fit items-end">
          {problem.numbers.map((num: number, idx: number) => (
            <div key={idx} className={`flex items-center w-full justify-between gap-6 ${textScale}`}>
              {idx === problem.numbers.length - 1 ? <span className="text-muted-foreground/60 select-none">{sign}</span> : <span className="opacity-0 select-none">{sign}</span>}
              <span className="w-full text-right">{num}</span>
            </div>
          ))}
          <div className="h-[4px] bg-border w-full my-3 rounded-full"/>
          <input 
            type="number"
            readOnly={allowDrag}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const val = e.dataTransfer.getData("text/plain");
              if (val && !isNaN(parseInt(val))) {
                onAnswerChange(parseInt(val));
              }
            }}
            className={`font-mono font-bold outline-none border-2 focus:ring-4 rounded-none px-4 py-2 transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${statusColor} ${bgStatus} ${inputScale} ${allowDrag ? 'cursor-pointer hover:ring-2' : ''}`}
            value={userAnswer ?? ""}
            onChange={(e) => {
              if(!allowDrag) onAnswerChange(e.target.value ? parseInt(e.target.value) : null);
            }}
            onClick={() => {
              if(allowDrag && userAnswer !== null) onAnswerChange(null);
            }}
            title={allowDrag ? "Drag an answer here or click to clear" : ""}
            placeholder="?"
          />
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`flex flex-nowrap overflow-x-auto items-center justify-center font-mono rounded-xl border shadow-sm transition-all hover:shadow-md ${cardStyle} ${paddingScale} ${containerScale}`} style={{ scrollbarWidth: 'none' }}>
      {problem.numbers.map((num: number, idx: number) => (
        <React.Fragment key={idx}>
          <span className={`px-1 sm:px-2 whitespace-nowrap shrink-0 ${textScale}`}>{num}</span>
          {idx < problem.numbers.length - 1 && <span className={`text-muted-foreground/60 select-none shrink-0 ${textScale}`}>{sign}</span>}
        </React.Fragment>
      ))}
      <span className={`px-1 sm:px-2 text-muted-foreground/60 select-none shrink-0 ${textScale}`}>=</span>
      <input 
        type="number"
        readOnly={allowDrag}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const val = e.dataTransfer.getData("text/plain");
          if (val && !isNaN(parseInt(val))) {
            onAnswerChange(parseInt(val));
          }
        }}
        className={`text-center font-mono font-bold outline-none border-2 focus:ring-4 rounded-none px-4 py-2 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${statusColor} ${bgStatus} ${inputScale} ${allowDrag ? 'cursor-pointer hover:ring-2' : ''}`}
        value={userAnswer ?? ""}
        onChange={(e) => {
           if(!allowDrag) onAnswerChange(e.target.value ? parseInt(e.target.value) : null);
        }}
        onClick={() => {
           if(allowDrag && userAnswer !== null) onAnswerChange(null);
        }}
        title={allowDrag ? "Drag an answer here or click to clear" : ""}
        placeholder="?"
      />
    </div>
  );
}
