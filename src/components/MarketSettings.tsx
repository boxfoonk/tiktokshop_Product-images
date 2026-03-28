/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, ShoppingBag } from 'lucide-react';
import { Country } from '../types';
import { COUNTRY_CONFIG } from '../constants';

interface MarketSettingsProps {
  country: Country;
  setCountry: (c: Country) => void;
  productName: string;
  setProductName: (name: string) => void;
  scenePrompt: string;
  setScenePrompt: (prompt: string) => void;
}

export const MarketSettings: React.FC<MarketSettingsProps> = ({
  country,
  setCountry,
  productName,
  setProductName,
  scenePrompt,
  setScenePrompt
}) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
        <Globe className="w-4 h-4" /> 02. 市场背景
      </h2>

      <div className="space-y-4">
        {/* Country Selection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">目标国家</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(Object.keys(COUNTRY_CONFIG) as Country[]).map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`py-3 rounded-lg border text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                  country === c 
                  ? 'bg-orange-500 border-orange-500 text-black' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
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
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">产品名称</label>
          <div className="relative">
            <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例如：降噪蓝牙耳机"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Scene Prompt */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">场景描述（可选）</label>
          <textarea 
            value={scenePrompt}
            onChange={(e) => setScenePrompt(e.target.value)}
            placeholder="留空则自动匹配 TikTok 热门带货场景..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors h-32 resize-none"
          />
        </div>
      </div>
    </section>
  );
};
