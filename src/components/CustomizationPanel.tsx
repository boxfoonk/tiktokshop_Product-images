/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig, ACCENT_COLORS, Language, Theme } from '../contexts/ConfigContext';
import { Sun, Moon, Languages, Palette } from 'lucide-react';

interface CustomizationPanelProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ show, setShow }) => {
  const { language, setLanguage, theme, setTheme, accentColor, setAccentColor, t } = useConfig();

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-card border-b border-border overflow-hidden"
        >
          <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Theme Toggle */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Sun className="w-4 h-4" /> {t('config.theme')}
              </h3>
              <div className="flex p-1 bg-bg-main rounded-lg border border-border">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    theme === 'light' ? 'bg-card text-accent shadow-sm' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  <Sun className="w-3 h-3" /> {t('config.theme.light')}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark' ? 'bg-card text-accent shadow-sm' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  <Moon className="w-3 h-3" /> {t('config.theme.dark')}
                </button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Palette className="w-4 h-4" /> {t('config.accent')}
              </h3>
              <div className="flex gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      accentColor.name === color.name ? 'border-accent scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Languages className="w-4 h-4" /> {t('config.language')}
              </h3>
              <div className="grid grid-cols-2 gap-2 p-1 bg-bg-main rounded-lg border border-border">
                {[
                  { id: 'zh', label: '中文' },
                  { id: 'en', label: 'English' },
                  { id: 'de', label: 'Deutsch' },
                  { id: 'fr', label: 'Français' },
                  { id: 'pt-BR', label: 'Português' },
                  { id: 'ja', label: '日本語' },
                  { id: 'th', label: 'ไทย' },
                  { id: 'es', label: 'Español' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as Language)}
                    className={`py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                      language === lang.id ? 'bg-card text-accent shadow-sm' : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
