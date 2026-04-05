"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToolConfigManager } from "@/components/tool-engine/ToolConfigManager";
import { LayoutRenderer } from "@/components/tool-engine/LayoutRenderer";
import { useToolConfig } from "@/hooks/useToolConfig";
import { useGenerator } from "@/hooks/useGenerator";
import { useCalculation } from "@/hooks/useCalculation";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, ArrowLeft, SlidersHorizontal, X, FileText } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";

export default function MathWorkspace() {
  const router = useRouter();
  const [focusedProblemId, setFocusedProblemId] = useState<string | null>(null);
  const [examState, setExamState] = useState<"idle" | "naming" | "active" | "submitted">("idle");
  const [examName, setExamName] = useState("");
  const [examCount, setExamCount] = useState(5);
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
    if (config.cardsPerRow === 1) gridClass = "grid grid-cols-1 gap-4 w-full";
    else if (config.cardsPerRow === 2) gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full auto-rows-[1fr]";
    else if (config.cardsPerRow === 3) gridClass = "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full flex-1 auto-rows-[1fr]";
    else gridClass = "grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 w-full flex-1 auto-rows-[1fr]";
  } else {
    if (config.layout === "horizontal") {
      gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full auto-rows-[1fr]";
    } else {
      if (problems.length === 2) gridClass = "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full auto-rows-[1fr]";
      else gridClass = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full flex-1 auto-rows-[1fr]";
    }
  }

  if (problems.length === 1) {
    gridClass = "flex-1 flex flex-col items-center justify-center w-full min-h-[40vh]";
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 flex-1 h-full w-full">
        {/* Sidebar Tool Configurator (Desktop only) */}
        <aside className="hidden xl:flex w-40 flex-shrink-0 flex-col space-y-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="w-fit gap-2 -ml-3 text-muted-foreground hover:text-primary rounded-none">
             <ArrowLeft className="w-4 h-4"/> {t("tool.back")}
          </Button>
          <ToolConfigManager config={config} updateConfig={updateConfig} onGenerate={generate} />
          {examState === "idle" && (
            <Button variant="default" className="w-full rounded-none shadow-none mt-4 border border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary" onClick={() => { setExamName(""); setExamCount(config.count); setExamState("naming"); }}>
               <FileText className="w-4 h-4 mr-2" /> Examine Yourself
            </Button>
          )}
        </aside>

        {/* Main Workspace */}
        <section className="flex flex-col flex-1 space-y-4 pb-2 w-full max-w-full overflow-hidden">
          
          {/* Mobile & Tablet Tool Configurator */}
          <div className="xl:hidden w-full mb-6 z-40 sticky top-2 bg-background/95 backdrop-blur-sm py-2 px-2 flex justify-between items-center border rounded-none shadow-sm">
             <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-muted-foreground hover:text-primary rounded-none">
                <ArrowLeft className="w-4 h-4"/> {t("tool.back")}
             </Button>
             <div className="flex items-center gap-1">
               {examState === "idle" && (
                 <Button variant="default" size="sm" className="gap-1 shrink-0 rounded-none bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 shadow-none border px-3" onClick={() => { setExamName(""); setExamState("naming"); }}>
                   <FileText className="w-4 h-4" /> Exam
                 </Button>
               )}
             <Sheet>
                <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border h-9 px-3 gap-2 shrink-0 rounded-none border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground">
                   <SlidersHorizontal className="w-4 h-4" /> {t("landing.explore")}
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col rounded-t-3xl border-primary/20">
                   <SheetHeader className="p-5 border-b text-left pb-4">
                      <SheetTitle className="font-heading text-xl">{t("subject.filter_config")}</SheetTitle>
                      <SheetDescription className="text-xs">{t("landing.explore")}</SheetDescription>
                   </SheetHeader>
                   <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                      <ToolConfigManager config={config} updateConfig={updateConfig} onGenerate={generate} />
                   </div>
                </SheetContent>
             </Sheet>
             </div>
          </div>

          {examState === "naming" ? (
             <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 text-center animate-in fade-in zoom-in-95 mt-10">
                <div className="max-w-sm w-full space-y-6 bg-card p-6 lg:p-8 rounded-none border shadow-2xl">
                   <FileText className="w-12 h-12 text-primary mx-auto opacity-80" />
                   <h2 className="text-2xl font-heading font-bold text-foreground">Examine Yourself</h2>
                   <p className="text-muted-foreground text-sm">Enter your name and desired number of questions to start.</p>
                   <div className="space-y-4 text-left">
                     <div>
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Student Name</label>
                       <input 
                          type="text" 
                          value={examName} 
                          onChange={(e) => setExamName(e.target.value)} 
                          placeholder="e.g. Rahim" 
                          className="w-full text-center text-md h-12 bg-background border-2 focus:ring-4 outline-none rounded-none transition-all px-4 font-bold" 
                          autoFocus 
                       />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Number of Questions</label>
                       <input 
                          type="number" 
                          min="1" 
                          max="100" 
                          value={examCount} 
                          onChange={(e) => setExamCount(parseInt(e.target.value) || 5)} 
                          className="w-full text-center text-md h-12 bg-background border-2 focus:ring-4 outline-none rounded-none transition-all px-4 font-bold" 
                       />
                     </div>
                   </div>
                   <div className="flex flex-col gap-3 pt-4">
                      <Button size="lg" className="rounded-none w-full font-bold text-lg" disabled={!examName.trim()} onClick={() => {
                        updateConfig({ count: examCount });
                        setTimeout(generate, 50);
                        setExamState("active");
                      }}>Start Exam</Button>
                      <Button variant="outline" size="lg" className="rounded-none w-full" onClick={() => setExamState("idle")}>Cancel</Button>
                   </div>
                </div>
             </div>
          ) : (
            <>
          <div className={gridClass}>
            {problems.map((problem, i) => (
              <LayoutRenderer 
                key={problem.id}
                layoutType={config.layout}
                operatorType={config.type}
                problem={problem}
                userAnswer={answers[problem.id] ?? null}
                onAnswerChange={(ans) => submitAnswer(problem.id, ans, examState === "active")}
                isCorrect={examState === "active" ? null : checkAnswer(problem.id)}
                totalQuestions={problems.length}
                allowDrag={config.allowDrag}
                colorVariant={i}
                onCardClick={() => setFocusedProblemId(problem.id)}
                cardsPerRow={config.cardsPerRow}
              />
            ))}
          </div>

          {examState === "active" && (
            <div className="mt-8 flex justify-center pb-12 animate-in fade-in slide-in-from-bottom-8">
               <Button size="lg" className="rounded-none px-12 py-8 text-2xl font-bold shadow-xl hover:shadow-2xl transition-all border-2 border-primary" onClick={() => setExamState("submitted")}>
                  Submit Examination
               </Button>
            </div>
          )}

          {config.allowDrag && (!allAnswered || examState === "active") && examState !== "submitted" && answerBank.length > 0 && (
            <div className="mt-6 p-4 md:p-6 bg-card border rounded-none shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-4 text-center tracking-widest">{t("tool.drag_answers")}</h3>
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                {answerBank.map((ans, i) => (
                  <div 
                    key={i} 
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", ans.toString());
                    }}
                    className="bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xl md:text-2xl px-5 md:px-6 py-2 md:py-3 rounded-none cursor-grab active:cursor-grabbing transition-all border border-primary/20 shadow-sm select-none"
                  >
                    {ans}
                  </div>
                ))}
              </div>
            </div>
          )}

          {allAnswered && examState === "idle" && (
            <div className="mt-12 flex flex-col items-center justify-center p-8 bg-primary/5 rounded-none border border-primary/20 animate-in fade-in zoom-in slide-in-from-bottom-4">
              <div className="w-20 h-20 bg-green-500/15 text-green-500 rounded-none flex items-center justify-center mb-4 ring-8 ring-green-500/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">{t("tool.complete")}</h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-8 text-center">{t("tool.score", { correct: score.correct, total: score.total })} <span className="font-bold">({score.percentage.toFixed(0)}%)</span></p>
              <Button size="lg" onClick={generate} className="gap-2 font-semibold text-base py-6 px-8 rounded-none shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all">
                <RefreshCcw className="w-5 h-5"/> {t("tool.generate_new")}
              </Button>
            </div>
          )}

          {examState === "submitted" && (
            (() => {
              const pct = score.percentage;
              let examGreeting = "";
              let examColor = "";
              if (pct >= 80) {
                 examGreeting = `Yay, you did excellent!`;
                 examColor = "text-green-600";
              } else if (pct >= 60) {
                 examGreeting = `Yay, you did wonderful!`;
                 examColor = "text-emerald-500";
              } else if (pct < 33) {
                 examGreeting = `Sorry ${examName}, you have failed.`;
                 examColor = "text-red-500";
              } else {
                 examGreeting = `Good effort, ${examName}!`;
                 examColor = "text-blue-500";
              }
              
              return (
                <div className="mt-12 flex flex-col items-center justify-center p-8 lg:p-12 bg-card rounded-none border border-primary/20 shadow-xl animate-in fade-in zoom-in slide-in-from-bottom-4">
                  <div className={`w-24 h-24 bg-primary/5 rounded-none flex items-center justify-center mb-6 ring-8 ring-primary/5 ${examColor}`}>
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-black mb-4 text-center mt-4 ${examColor}`}>
                     {examGreeting}
                  </h2>
                  {pct >= 33 && (
                    <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground text-center">
                       Congratulations <span className="text-primary">{examName}</span>!
                    </h3>
                  )}
                  <p className="text-muted-foreground text-xl md:text-2xl mb-10 text-center max-w-2xl leading-relaxed">
                    You scored <span className="font-bold text-primary">{score.correct * 5}</span> out of <span className="font-bold">{score.total * 5}</span>.<br/><br/>
                    (<span className="font-bold text-green-600">{score.correct} correct</span>, <span className="font-bold text-red-500">{score.total - score.correct} failed</span>)
                  </p>
                  <Button size="lg" onClick={() => { setExamState("idle"); setExamName(""); generate(); }} className="gap-2 font-semibold text-lg py-6 px-10 rounded-none shadow-lg hover:-translate-y-1 transition-all">
                    Close Exam Sheet
                  </Button>
                </div>
              );
            })()
          )}
            </>
          )}
        </section>
      </div>

      {focusedProblemId && problems.find(p => p.id === focusedProblemId) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
           <Button variant="ghost" size="icon" className="absolute top-4 right-4 md:top-8 md:right-8 h-12 w-12 rounded-full border-2 bg-background hover:bg-muted" onClick={() => setFocusedProblemId(null)}>
              <X className="w-6 h-6" />
           </Button>
           
           <div className="w-full max-w-5xl flex flex-col items-center justify-center space-y-4 md:space-y-6">
              <div className="w-full shadow-2xl ring-1 ring-border rounded-xl bg-card overflow-hidden">
                 <LayoutRenderer 
                    layoutType={config.layout}
                    operatorType={config.type}
                    problem={problems.find(p => p.id === focusedProblemId)}
                    userAnswer={answers[focusedProblemId] ?? null}
                    onAnswerChange={(ans) => submitAnswer(focusedProblemId, ans, examState === "active")}
                    isCorrect={examState === "active" ? null : checkAnswer(focusedProblemId)}
                    totalQuestions={1} // Forces maximum 100vh scaling
                    allowDrag={config.allowDrag}
                    isFocused={true}
                 />
              </div>

              {config.allowDrag && !allAnswered && answerBank.length > 0 && (
                <div className="w-full max-w-4xl p-4 md:p-6 bg-card border rounded-none shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                  <h3 className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-3 md:mb-4 text-center tracking-widest">{t("tool.drag_answers")}</h3>
                  <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                    {(() => {
                        const p = problems.find(x => x.id === focusedProblemId);
                        if (!p) return null;
                        const correct = p.correctAnswer;
                        const decoys = answerBank.filter(a => a !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
                        const modalAnswers = [correct, ...decoys].sort(() => Math.random() - 0.5);
                        return modalAnswers.map((ans, i) => (
                          <div 
                            key={i} 
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", ans.toString());
                            }}
                            className="bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xl md:text-3xl lg:text-4xl px-6 md:px-8 py-3 md:py-4 rounded-none cursor-grab active:cursor-grabbing transition-all border border-primary/20 shadow-sm select-none"
                          >
                            {ans}
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
