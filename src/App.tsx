/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { Navigation } from './components/Navigation';
import { ImageModule } from './modules/ImageModule';
import { VideoModule } from './modules/VideoModule';

// Extend Window interface for AI Studio APIs
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Image Module State
  const [imageState, setImageState] = useState({
    modelImage: null as string | null,
    productImage: null as string | null,
    country: 'Japan' as Country,
    productName: '',
    scenePrompt: '',
    resultImage: null as string | null,
  });

  // Video Module State
  const [videoState, setVideoState] = useState({
    modelImage: null as string | null,
    country: 'Japan' as Country,
    productName: '',
    videoScript: '',
    resultVideo: null as string | null,
  });

  // Check for API key on mount (AI Studio specific)
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback for local dev
      }
    };
    checkKey();
  }, []);

  const isHighQuality = !!customApiKey || (hasKey === true && !!window.aistudio);

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent/20 selection:text-accent">
      <Header showSettings={showSettings} setShowSettings={setShowSettings} isHighQuality={isHighQuality} />
      
      <SettingsPanel 
        showSettings={showSettings} 
        setShowSettings={setShowSettings} 
        customApiKey={customApiKey} 
        setCustomApiKey={setCustomApiKey} 
        hasKey={hasKey}
      />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'image' ? (
            <motion.div
              key="image-module"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ImageModule 
                isHighQuality={isHighQuality} 
                customApiKey={customApiKey} 
                hasKey={hasKey}
                state={imageState}
                setState={setImageState}
              />
            </motion.div>
          ) : (
            <motion.div
              key="video-module"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoModule 
                isHighQuality={isHighQuality} 
                customApiKey={customApiKey} 
                hasKey={hasKey}
                state={videoState}
                setState={setVideoState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-12 border-t border-border p-8 text-center">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.4em]">
          由 Gemini AI 驱动 &bull; 专为 TikTok 创作者设计
        </p>
      </footer>
    </div>
  );
}
