/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../contexts/ConfigContext';

interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  hasKey: boolean | null;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  showSettings, 
  setShowSettings, 
  customApiKey, 
  setCustomApiKey,
  hasKey
}) => {
  const { t } = useConfig();
  const isHighQuality = !!customApiKey || hasKey === true;

  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-card border-b border-border overflow-hidden"
        >
          <div className="max-w-7xl mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent">{t('settings.title')}</h3>
              <button onClick={() => setShowSettings(false)} className="text-[10px] uppercase text-text-muted hover:text-text-main">{t('settings.close')}</button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('settings.apikey')}</label>
              <div className="flex gap-2">
                <input 
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder={t('settings.placeholder')}
                  className="flex-1 bg-bg-main border border-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-accent transition-colors shadow-sm text-text-main"
                />
                <div className="px-4 py-3 rounded-lg bg-card border border-border flex items-center gap-2 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${isHighQuality ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-border'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
                    {isHighQuality ? t('settings.hq_mode') : t('settings.default_mode')}
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-text-muted/60">
                {t('settings.tip')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
