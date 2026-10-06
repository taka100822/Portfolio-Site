import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import autoEn from './en.json';
import manualEn from './en.manual.json';

// 日本語の文言そのものをキーにして英訳を引く。
// en.json は scripts/translate.mjs が自動で作り、en.manual.json は手直し用（こちらが優先）
// 改行まわりの空白はキーに含めない（scripts/translate.mjs の normalize と同じ）
export const normalize = (text) => text.replace(/[ \t]*\n[ \t]*/g, '\n').trim();

const EN = { ...autoEn, ...manualEn };
const STORAGE_KEY = 'lang';
const LANGS = ['ja', 'en'];

const initialLang = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // 保存できない環境ではブラウザの言語設定で決める
  }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || 'ja'];
  return prefs[0].toLowerCase().startsWith('ja') ? 'ja' : 'en';
};

const LangContext = createContext({ lang: 'ja', setLang: () => {}, t: (text) => text });

export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できなくても切り替え自体はできる
    }
  }, []);

  // 訳がまだない文言は日本語のまま出す
  const t = useCallback((text) => {
    if (lang === 'ja' || typeof text !== 'string') return text;
    return EN[normalize(text)] ?? text;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
