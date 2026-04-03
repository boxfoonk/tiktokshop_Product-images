/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, ShoppingBag } from 'lucide-react';
import { Country } from '../types';
import { COUNTRY_CONFIG } from '../constants';
import { useConfig } from '../contexts/ConfigContext';

interface MarketSettingsProps {
  country: Country;
  setCountry: (c: Country) => void;
  productName: string;
  setProductName: (name: string) => void;
  scenePrompt: string;
  setScenePrompt: (prompt: string) => void;
  videoScript: string;
  setVideoScript: (script: string) => void;
  mode: 'image' | 'video';
}

export const MarketSettings: React.FC<MarketSettingsProps> = ({
  country,
  setCountry,
  productName,
  setProductName,
  scenePrompt,
  setScenePrompt,
  videoScript,
  setVideoScript,
  mode
}) => {
  const { t, language } = useConfig();

  return (
    <section className="space-y-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
        <Globe className="w-4 h-4" /> {t('module.market_creative')}
      </h2>

      <div className="space-y-4">
        {/* Country Selection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('module.target_country')}</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(Object.keys(COUNTRY_CONFIG) as Country[]).map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`py-3 rounded-lg border text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                  country === c 
                  ? 'bg-accent border-accent text-white shadow-sm' 
                  : 'bg-card border-border text-text-muted hover:border-accent hover:text-accent'
                }`}
              >
                <span className="text-lg">{COUNTRY_CONFIG[c].flag}</span>
                {COUNTRY_CONFIG[c].label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('module.product_name')}</label>
          <div className="relative">
            <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
            <input 
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={t('module.product_placeholder')}
              className="w-full bg-card border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors shadow-sm text-text-main"
            />
          </div>
        </div>

        {/* Conditional Inputs based on Mode */}
        {mode === 'image' ? (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('module.scene_prompt')}</label>
            <textarea 
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              placeholder={t('module.scene_placeholder')}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-accent transition-colors h-32 resize-none shadow-sm text-text-main"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t('module.video_script')}</label>
            <textarea 
              value={videoScript}
              onChange={(e) => setVideoScript(e.target.value)}
              placeholder={t('module.video_script_placeholder')}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-accent transition-colors h-32 resize-none shadow-sm text-text-main"
            />
          </div>
        )}
      </div>
    </section>
  );
};
