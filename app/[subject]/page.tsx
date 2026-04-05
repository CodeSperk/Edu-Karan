"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, ArrowRight, Library, Layers, BookOpen, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

const getMockData = (t: any): Record<string, any> => ({
  mathematics: {
    classes: {
      "Class 1": {
        "Chapter 1: Numbers": ["Counting 1-10", "Basic Addition"],
        "Chapter 2: Shapes": ["2D Shapes"]
      },
      "Class 2": {
        "Chapter 1: Arithmetic": ["Core Operations", "Subtraction Rules"],
        "Chapter 2: Measurement": ["Length", "Weight", "Time"]
      }
    },
    tools: [
      { id: "math-operations", title: t("tool.basic_math"), description: t("tool.basic_math_desc"), icon: Calculator, tags: ["Class 1", "Class 2", "Arithmetic"] }
    ]
  },
  bengali: { classes: {}, tools: [] },
  english: { classes: {}, tools: [] }
});

export default function SubjectPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const data = getMockData(t)[subjectId] || { classes: {}, tools: [] };
  const subjectNameTranslated = subjectId === "mathematics" ? t("landing.math") : subjectId === "bengali" ? t("landing.bengali") : t("landing.english");

  const [cls, setCls] = useState<string>("");
  const [chap, setChap] = useState<string>("");
  const [les, setLes] = useState<string>("");

  const classList = Object.keys(data.classes);
  const chapterList = cls ? Object.keys(data.classes[cls] || {}) : [];
  const lessonList = chap && cls ? (data.classes[cls][chap] || []) : [];

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500 py-4 max-w-7xl">
       <div className="-mb-2">
         <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-2 -ml-3 text-muted-foreground hover:text-primary">
           <ArrowLeft className="w-4 h-4" /> {t("subject.back")}
         </Button>
       </div>

       <div className="space-y-2 mb-8">
         <h1 className="text-3xl md:text-5xl font-bold font-heading text-primary capitalize">{subjectNameTranslated} {t("subject.materials")}</h1>
         <p className="text-muted-foreground">{t("subject.subtitle")}</p>
       </div>

       {/* FILTER BAR */}
       <Card className="bg-card shadow-sm border-border/50 rounded-xl">
         <CardContent className="p-4 md:p-6">
           <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
              <Search className="w-5 h-5"/> {t("subject.filter_config")}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-1">
                <Select value={cls} onValueChange={(v) => { setCls(v || ""); setChap(""); setLes(""); }}>
                  <SelectTrigger className="h-10 md:h-12 rounded-lg font-medium"><SelectValue placeholder={t("subject.select_class")} /></SelectTrigger>
                  <SelectContent>
                    {classList.length > 0 ? classList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>) : <SelectItem value="none" disabled>{t("subject.no_classes")}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select value={chap} onValueChange={(v) => { setChap(v || ""); setLes(""); }} disabled={!cls}>
                  <SelectTrigger className="h-10 md:h-12 rounded-lg font-medium"><SelectValue placeholder={t("subject.select_chapter")} /></SelectTrigger>
                  <SelectContent>
                    {chapterList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Select value={les} onValueChange={(v) => setLes(v || "")} disabled={!chap}>
                  <SelectTrigger className="h-10 md:h-12 rounded-lg font-medium"><SelectValue placeholder={t("subject.select_lesson")} /></SelectTrigger>
                  <SelectContent>
                    {lessonList.map((l: any) => <SelectItem key={l as string} value={l as string}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
           </div>
         </CardContent>
       </Card>

       {/* AVAILABLE TOOLS */}
       <div className="space-y-6 pt-4">
          <h2 className="text-xl md:text-2xl font-bold font-heading">{t("subject.interactive_tools")}</h2>
          {data.tools.length === 0 ? (
             <div className="text-muted-foreground p-12 text-center bg-card rounded-xl border border-dashed text-sm">{t("subject.no_tools")}</div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
               {data.tools.map((tool: any) => (
                 <Card key={tool.id} className="group hover:border-primary/50 transition-colors cursor-pointer rounded-xl overflow-hidden" onClick={() => router.push(`/tool/${tool.id}`)}>
                   <CardContent className="p-4 md:p-6 flex items-start gap-4 md:gap-6">
                      <div className="p-3 md:p-4 bg-primary/10 text-primary rounded-xl group-hover:scale-105 transition-transform"><tool.icon className="w-6 h-6 md:w-8 md:h-8"/></div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-base md:text-lg">{tool.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                        <div className="flex gap-2 pt-2 flex-wrap">
                          {tool.tags.map((t: string) => <span key={t} className="text-[10px] bg-muted px-2 py-1 rounded-md font-semibold text-muted-foreground">{t}</span>)}
                        </div>
                      </div>
                      <div className="shrink-0 pt-2"><ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"/></div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          )}
       </div>
    </div>
  );
}
