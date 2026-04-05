"use client";

import * as React from "react";
import { ToolLayout } from "@/types/tool";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onCardClick?: () => void;
  isFocused?: boolean;
  cardsPerRow?: number | "auto";
}

export function LayoutRenderer({ layoutType, operatorType = "addition", problem, userAnswer, onAnswerChange, isCorrect, totalQuestions, allowDrag, colorVariant, onCardClick, isFocused, cardsPerRow }: LayoutRendererProps) {
  
  const sign = operatorType === "addition" ? "+" : operatorType === "subtraction" ? "-" : operatorType === "multiplication" ? "×" : "÷";
  
  const statusColor = isCorrect === true ? "text-green-600 dark:text-green-400 border-green-500 ring-green-500/20" : isCorrect === false ? "text-red-500 border-red-500 ring-red-500/20" : "border-input";
  
  const themes = [
    "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100",
    "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/50 text-sky-950 dark:text-sky-100",
    "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100",
    "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100",
    "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 text-purple-950 dark:text-purple-100"
  ];
  
  const cardStyle = isFocused ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-100" 
    : (isCorrect === true ? "bg-green-100/50 border-green-300" : isCorrect === false ? "bg-red-100/50 border-red-300" : themes[(colorVariant || 0) % themes.length]);
  const bgStatus = isCorrect === true ? "bg-green-500/20" : isCorrect === false ? "bg-red-500/20" : "bg-card/80";

  let textScale = "text-3xl sm:text-4xl";
  let inputScale = "text-3xl sm:text-4xl w-full max-w-[150px]";
  let paddingScale = "p-5 md:p-6 gap-2";
  let containerScale = "w-full mx-auto flex items-center justify-center";

  if (totalQuestions === 1) {
    textScale = "text-5xl sm:text-6xl lg:text-7xl";
    inputScale = "text-5xl sm:text-6xl lg:text-7xl w-full max-w-[200px] md:max-w-[300px]";
    paddingScale = "px-6 py-10 md:px-10 lg:py-16 gap-4 md:gap-6";
    containerScale = "w-fit mx-auto flex items-center justify-center";
  } else if (totalQuestions === 2) {
    textScale = "text-5xl sm:text-6xl md:text-7xl";
    inputScale = "text-5xl sm:text-6xl md:text-7xl w-full max-w-[200px] md:max-w-[280px]";
    paddingScale = "py-8 px-4 md:py-12 gap-4";
    containerScale = "w-full mx-auto flex items-center justify-center";
  } else if (totalQuestions === 3 || totalQuestions === 4) {
    textScale = "text-4xl sm:text-5xl md:text-6xl";
    inputScale = "text-4xl sm:text-5xl md:text-6xl w-full min-w-[100px] max-w-[160px] md:min-w-[140px] md:max-w-[220px]";
    paddingScale = "py-6 px-4 md:py-8 gap-3 md:gap-5";
    containerScale = "w-full mx-auto flex items-center justify-center";
  }

  // Prevent Horizontal wrapping by estimating char-length and aggressively reducing font size
  if (layoutType === "horizontal") {
    const totalChars = problem.numbers.join("").length + (problem.numbers.length * 2);
    
    // Dynamically adjust baseline scale based on how many cards share a row
    const effectiveColumns = cardsPerRow === "auto" || !cardsPerRow ? 
         (totalQuestions === 1 ? 1 : 2) : cardsPerRow;
         
    if (effectiveColumns >= 4) {
      textScale = "text-lg sm:text-xl lg:text-lg xl:text-xl";
      inputScale = "text-lg sm:text-xl lg:text-lg xl:text-xl min-w-[60px] max-w-[80px]";
      paddingScale = "p-3 gap-2";
    } else if (effectiveColumns === 3) {
      textScale = "text-xl sm:text-2xl lg:text-xl xl:text-2xl";
      inputScale = "text-xl sm:text-2xl lg:text-xl xl:text-2xl min-w-[70px] max-w-[100px]";
      paddingScale = "p-4 gap-2 lg:gap-3";
    } else if (effectiveColumns === 2) {
      textScale = "text-2xl sm:text-3xl lg:text-2xl xl:text-4xl";
      inputScale = "text-2xl sm:text-3xl lg:text-2xl xl:text-4xl min-w-[80px] max-w-[120px]";
      paddingScale = "p-4 md:p-6 gap-3 lg:gap-4";
    }

    // Override if insanely long characters
    if (totalChars > 16) {
      textScale = "text-lg sm:text-xl lg:text-lg";
      inputScale = "text-lg sm:text-xl lg:text-lg min-w-[60px] max-w-[80px]";
    } else if (totalChars > 11 && effectiveColumns < 3) {
      textScale = "text-xl sm:text-2xl lg:text-xl";
      inputScale = "text-xl sm:text-2xl lg:text-xl min-w-[70px] max-w-[100px]";
    } 
    
    // Exception for Focus Modal or single problems
    if (totalQuestions === 1) {
       textScale = "text-4xl sm:text-5xl md:text-6xl lg:text-7xl";
       inputScale = "text-4xl sm:text-5xl md:text-6xl lg:text-7xl min-w-[120px] max-w-[200px]";
       paddingScale = "py-8 px-6 md:py-14 gap-6";
    }
  }
  
  if (layoutType === "vertical") {
    return (
      <div 
        className={`relative group flex flex-col items-center justify-center font-mono rounded-none border shadow-sm transition-all hover:shadow-md ${cardStyle} ${paddingScale} ${containerScale}`}
      >
        {!isFocused && (
           <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onCardClick}>
              <Maximize2 className="w-5 h-5 text-muted-foreground" />
           </Button>
        )}
        <div className="flex flex-col w-fit items-end">
          {problem.numbers.map((num: number, idx: number) => (
            <div key={idx} className={`flex items-center justify-end w-full gap-5 md:gap-8 ${textScale}`}>
              {idx === problem.numbers.length - 1 ? <span className="text-muted-foreground/60 select-none">{sign}</span> : <span className="opacity-0 select-none">{sign}</span>}
              <span className="text-right tabular-nums tracking-widest">{num}</span>
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
    <div 
        className={`relative group flex overflow-x-auto items-center font-mono rounded-none border shadow-sm transition-all hover:shadow-md ${cardStyle} ${paddingScale} ${containerScale.replace('justify-center', 'justify-start')}`} 
        style={{ scrollbarWidth: 'none' }}
    >
      {!isFocused && (
         <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onCardClick}>
            <Maximize2 className="w-5 h-5 text-muted-foreground" />
         </Button>
      )}
      <div className="flex flex-nowrap items-center w-max mx-auto">
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
          className={`text-center font-mono font-bold outline-none border-2 focus:ring-4 rounded-none px-4 py-2 transition-colors shrink-0 min-w-[80px] sm:min-w-[100px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${statusColor} ${bgStatus} ${inputScale} ${allowDrag ? 'cursor-pointer hover:ring-2' : ''}`}
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
