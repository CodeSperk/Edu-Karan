"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function GlobalSearch() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debouncing
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(query); }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) { setIsOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DB = [
    { id: "mathematics", type: "subject", label: t("landing.math") },
    { id: "bengali", type: "subject", label: t("landing.bengali") },
    { id: "english", type: "subject", label: t("landing.english") },
    { id: "math-operations", type: "tool", label: t("tool.basic_math") }
  ];

  const results = debouncedQuery.length > 0 
      ? DB.filter(item => item.label.toLowerCase().includes(debouncedQuery.toLowerCase()))
      : [];

  return (
    <div className="relative w-full max-w-xs md:max-w-sm shrink-0" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-muted/60 border-border/50 hover:bg-muted focus:bg-background rounded-full h-10 w-full transition-colors shadow-sm placeholder:text-muted-foreground/60"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { if (query.length > 0) setIsOpen(true); }}
        />
      </div>

      {isOpen && debouncedQuery.length > 0 && (
        <Card className="absolute top-full left-0 w-full mt-3 py-2 shadow-2xl border-border/50 z-50 rounded-2xl animate-in fade-in slide-in-from-top-2">
          {results.length === 0 ? (
             <div className="px-4 py-4 text-sm text-muted-foreground text-center">
                {t("search.no_results")} "{debouncedQuery}"
             </div>
          ) : (
             <div className="max-h-[300px] overflow-y-auto">
               {results.map((res) => (
                  <div 
                    key={res.id} 
                    className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b last:border-0 border-border/20 flex flex-col justify-center"
                    onClick={() => {
                       setIsOpen(false);
                       setQuery("");
                       router.push(res.type === "subject" ? `/${res.id}` : `/tool/${res.id}`);
                    }}
                  >
                    <div className="font-semibold text-sm text-foreground">{res.label}</div>
                    <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">{res.type === "subject" ? t("search.subjects") : t("search.tools")}</div>
                  </div>
               ))}
             </div>
          )}
        </Card>
      )}
    </div>
  );
}
