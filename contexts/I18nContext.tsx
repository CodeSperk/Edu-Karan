"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Locale, TranslationKey } from "@/locales/translations";

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("bn"); // Default Bengali natively
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mredukaron-locale");
    if (saved === "en" || saved === "bn") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("mredukaron-locale", l);
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let str = translations[locale][key] || translations["en"][key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return str;
  };

  // Provide invisible flash during mount for consistent SSG handling
  if (!mounted) {
     return (
        <I18nContext.Provider value={{ locale: "bn", setLocale, t: (key) => translations["bn"][key] }}>
          {children}
        </I18nContext.Provider>
     );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};
