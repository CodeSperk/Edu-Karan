"use client";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <Button variant="outline" size="sm" onClick={() => setLocale(locale === "en" ? "bn" : "en")} className="gap-2 shrink-0 rounded-full w-9 h-9 md:w-auto md:h-10 md:px-4 border-2 border-border/50 text-foreground transition-all hover:bg-muted focus:ring-2 focus:ring-primary/20">
      <Languages className="w-4 h-4"/>
      <span className="hidden md:inline font-semibold">{locale === "en" ? "বাংলা" : "English"}</span>
    </Button>
  );
}
