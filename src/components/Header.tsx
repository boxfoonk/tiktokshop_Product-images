/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Globe, Settings2 } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  isHighQuality: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  showSettings, 
  setShowSettings, 
  showConfig, 
  setShowConfig, 
  isHighQuality 
}) => {
  const { t } = useConfig();

  return (
    <header className="border-b border-border p-6 flex justify-between items-center bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center relative shadow-sm">
          <Sparkles className="text-white w-6 h-6" />
          {isHighQuality && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title={t('settings.hq_mode')} />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">{t('app.title')}</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">{t('app.subtitle')}</p>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${isHighQuality ? 'border-green-200 text-green-600 bg-green-50' : 'border-border text-text-muted'} uppercase tracking-widest font-bold`}>
              {isHighQuality ? '2K ' + t('settings.hq_mode') : t('settings.default_mode')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest text-text-muted mr-4">
          <span>{t('module.target_country')}</span>
          <span>AI {t('nav.image')}</span>
          <span>{t('module.market_creative')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-lg border transition-all ${
              showConfig ? 'bg-accent border-accent text-white shadow-md shadow-accent/20' : 'bg-card border-border text-text-muted hover:border-accent hover:text-accent'
            }`}
            title={t('config.title')}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition-all ${
              showSettings ? 'bg-accent border-accent text-white shadow-md shadow-accent/20' : 'bg-card border-border text-text-muted hover:border-accent hover:text-accent'
            }`}
            title={t('settings.title')}
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
