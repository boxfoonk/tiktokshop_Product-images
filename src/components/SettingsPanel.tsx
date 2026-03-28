/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  showSettings, 
  setShowSettings, 
  customApiKey, 
  setCustomApiKey 
}) => {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white/5 border-b border-white/10 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500">本地运行设置</h3>
              <button onClick={() => setShowSettings(false)} className="text-[10px] uppercase text-white/40 hover:text-white">关闭</button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Gemini API Key (填入后开启 2K 高画质)</label>
              <div className="flex gap-2">
                <input 
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="在此输入您的 API Key..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${customApiKey ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/20'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                    {customApiKey ? '高画质模式' : '默认画质'}
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-white/30">
                提示：如果您在 AI Studio 预览中运行，可以直接使用平台提供的 Key。本地运行时，填入 Key 可解锁 2K 分辨率。
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
