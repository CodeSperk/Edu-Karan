"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToolConfigManager } from "@/components/tool-engine/ToolConfigManager";
import { LayoutRenderer } from "@/components/tool-engine/LayoutRenderer";
import { useToolConfig } from "@/hooks/useToolConfig";
import { useGenerator } from "@/hooks/useGenerator";
import { useCalculation } from "@/hooks/useCalculation";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function MathWorkspace() {
  const router = useRouter();
  const { t } = useI18n();
  const { config, updateConfig } = useToolConfig();
  const { data: problems, generate } = useGenerator(config);
  const { 
    answers, 
    submitAnswer, 
    checkAnswer, 
    getScore, 
    resetCalculation 
  } = useCalculation(problems);

  useEffect(() => {
    resetCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problems]);

  const [answerBank, setAnswerBank] = useState<number[]>([]);
  
  useEffect(() => {
    if (problems.length > 0 && config.allowDrag) {
      const correct = problems.map(p => p.correctAnswer);
      const decoys: number[] = [];
      for(let i = 0; i < problems.length; i++) {
        decoys.push(correct[i] + Math.floor(Math.random() * 10) + 1);
        decoys.push(Math.max(0, correct[i] - Math.floor(Math.random() * 10) - 1));
      }
      const pool = Array.from(new Set([...correct, ...decoys])).sort(() => Math.random() - 0.5);
      setAnswerBank(pool.slice(0, Math.max(problems.length * 2, 5)));
    } else {
      setAnswerBank([]);
    }
  }, [problems, config.allowDrag]);

  const score = getScore();
  const allAnswered = problems.length > 0 && problems.every(p => answers[p.id] !== undefined && answers[p.id] !== null);

  let gridClass = "";
  if (config.cardsPerRow !== "auto" && config.cardsPerRow !== undefined) {
    if (config.cardsPerRow === 1) gridClass = "grid grid-cols-1 gap-6 w-full";
    else if (config.cardsPerRow === 2) gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full";
    else if (config.cardsPerRow === 3) gridClass = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full";
    else gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full";
  } else {
    if (config.layout === "horizontal") {
      gridClass = "grid grid-cols-1 gap-6 w-full";
    } else {
      if (problems.length === 2) gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full";
      else gridClass = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full";
    }
  }

  if (problems.length === 1) {
    gridClass = "flex-1 flex flex-col items-center justify-center w-full min-h-[40vh]";
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <div className="flex items-center pb-4">
         <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-3 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4"/> {t("tool.back")}
         </Button>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 flex-1 h-full w-full">
        {/* Sidebar Tool Configurator (Desktop only) */}
        <aside className="hidden xl:block w-40 flex-shrink-0">
          <ToolConfigManager config={config} updateConfig={updateConfig} onGenerate={generate} />
        </aside>

        {/* Main Workspace */}
        <section className="flex flex-col flex-1 space-y-4 pb-2 w-full max-w-full overflow-hidden">
          
          {/* Mobile & Tablet Tool Configurator */}
          <div className="xl:hidden w-full mb-2">
            <ToolConfigManager config={config} updateConfig={updateConfig} onGenerate={generate} />
          </div>

          <div className={gridClass}>
            {problems.map((problem, i) => (
              <LayoutRenderer 
                key={problem.id}
                layoutType={config.layout}
                operatorType={config.type}
                problem={problem}
                userAnswer={answers[problem.id] ?? null}
                onAnswerChange={(ans) => submitAnswer(problem.id, ans)}
                isCorrect={checkAnswer(problem.id)}
                totalQuestions={problems.length}
                allowDrag={config.allowDrag}
                colorVariant={i}
              />
            ))}
          </div>

          {config.allowDrag && !allAnswered && answerBank.length > 0 && (
            <div className="mt-6 p-4 md:p-6 bg-card border rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-4 text-center tracking-widest">{t("tool.drag_answers")}</h3>
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                {answerBank.map((ans, i) => (
                  <div 
                    key={i} 
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", ans.toString());
                    }}
                    className="bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xl md:text-2xl px-5 md:px-6 py-2 md:py-3 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-primary/20 shadow-sm select-none"
                  >
                    {ans}
                  </div>
                ))}
              </div>
            </div>
          )}

          {allAnswered && (
            <div className="mt-12 flex flex-col items-center justify-center p-8 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in zoom-in slide-in-from-bottom-4">
              <div className="w-20 h-20 bg-green-500/15 text-green-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-500/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">{t("tool.complete")}</h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-8 text-center">{t("tool.score", { correct: score.correct, total: score.total })} <span className="font-bold">({score.percentage.toFixed(0)}%)</span></p>
              <Button size="lg" onClick={generate} className="gap-2 font-semibold text-base py-6 px-8 rounded-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all">
                <RefreshCcw className="w-5 h-5"/> {t("tool.generate_new")}
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
