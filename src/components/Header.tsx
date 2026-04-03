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
    <header className="border-b border-border p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center relative shadow-sm">
          <Sparkles className="text-white w-6 h-6" />
          {isHighQuality && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="高画质模式已开启" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">TikTok 视觉设计师</h1>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">AI 创意合成专家</p>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${isHighQuality ? 'border-green-200 text-green-600 bg-green-50' : 'border-border text-text-muted'} uppercase tracking-widest font-bold`}>
              {isHighQuality ? '2K 高画质' : '标准画质'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest text-text-muted mr-4">
          <span>全球市场</span>
          <span>AI 合成</span>
          <span>转化率优化</span>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg border transition-all ${
            showSettings ? 'bg-accent border-accent text-white shadow-md shadow-accent/20' : 'bg-white border-border text-text-muted hover:border-accent hover:text-accent'
          }`}
          title="设置 API Key"
        >
          <Globe className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
