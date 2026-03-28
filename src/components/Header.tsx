/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  isHighQuality: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showSettings, setShowSettings, isHighQuality }) => {
  return (
    <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center relative">
          <Sparkles className="text-black w-6 h-6" />
          {isHighQuality && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" title="高画质模式已开启" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight uppercase">TikTok 电商视觉设计师</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">电商场景合成专家</p>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${isHighQuality ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-white/10 text-white/30'} uppercase tracking-widest font-bold`}>
              {isHighQuality ? '2K 高画质' : '标准画质'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest text-white/60 mr-4">
          <span>全球市场</span>
          <span>AI 合成</span>
          <span>转化率优化</span>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg border transition-all ${
            showSettings ? 'bg-orange-500 border-orange-500 text-black' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
          }`}
          title="设置 API Key"
        >
          <Globe className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
