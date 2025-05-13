// src/context/LanguageProvider.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import type { Language, LanguageContextType } from "@/types";

const DEFAULT_LANGUAGE: Language = "en";
const LOCAL_STORAGE_KEY = "app_lang_v3_final";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Language | null;
      return (saved === "en" || saved === "zh") ? saved : DEFAULT_LANGUAGE;
    } catch (e) { console.warn("localStorage access error for language", e); return DEFAULT_LANGUAGE; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) { console.warn("localStorage write error for language", e); }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const value = { language, setLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}; 