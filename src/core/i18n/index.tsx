/**
 * 轻量 i18n：中英双语，跟随用户选择并持久化，默认中文
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadJSON, saveJSON } from '../storage';
import { zh, type Dictionary } from './locales/zh';
import { en } from './locales/en';

export type Lang = 'zh' | 'en';

const DICTIONARIES: Record<Lang, Dictionary> = { zh, en };
const STORAGE_KEY = 'settings.lang';

type TFn = (key: string, params?: Record<string, string | number>) => string;

interface I18nContextValue {
  lang: Lang;
  t: TFn;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** 支持点号路径取嵌套文案，如 typeNames.phone */
function lookup(dict: Dictionary, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

function translate(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>,
): string {
  const raw = lookup(DICTIONARIES[lang], key) ?? lookup(DICTIONARIES.zh, key);
  let text = typeof raw === 'string' ? raw : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    loadJSON<Lang>(STORAGE_KEY, 'zh').then(saved => {
      if (saved === 'zh' || saved === 'en') {
        setLang(saved);
      }
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      saveJSON(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback<TFn>((key, params) => translate(lang, key, params), [lang]);

  const value = useMemo(() => ({ lang, t, toggleLang }), [lang, t, toggleLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
