"use client";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BookType, BookA, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function LandingPage() {
  const { t } = useI18n();

  const subjects = [
    { id: "mathematics", name: t("landing.math"), icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10", border: "hover:border-blue-500/50" },
    { id: "bengali", name: t("landing.bengali"), icon: BookType, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/50" },
    { id: "english", name: t("landing.english"), icon: BookA, color: "text-purple-500", bg: "bg-purple-500/10", border: "hover:border-purple-500/50" }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto space-y-12">
      <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary">{t("landing.title")}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t("landing.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
        {subjects.map((subject, i) => (
          <Link key={subject.id} href={`/${subject.id}`}>
            <Card className={`relative overflow-hidden h-full group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 hover:scale-[1.02] border-2 border-muted/50 hover:border-primary/30 rounded-none animate-in fade-in slide-in-from-bottom-8`} style={{ animationDelay: `${i * 150}ms` }}>
              {/* Interactive background shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-gradient-to-br from-primary via-transparent to-transparent transition-opacity duration-700" />
              
              <CardContent className="relative flex flex-col items-center text-center p-8 lg:p-12 space-y-6 z-10">
                <div className={`p-6 rounded-none ${subject.bg} ${subject.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm group-hover:shadow-md`}>
                  <subject.icon className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{subject.name}</h2>
                  <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors duration-300">{t("landing.explore")}</p>
                </div>
                <div className="pt-4 flex items-center justify-center text-primary font-bold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 blur-sm group-hover:blur-none duration-500">
                  {t("landing.enter")} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
