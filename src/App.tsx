/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ImageIcon, 
  Loader2, 
  Sparkles, 
  AlertCircle,
  Download,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Extend Window interface for AI Studio APIs
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Components
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageUpload } from './components/ImageUpload';
import { MarketSettings } from './components/MarketSettings';

// Services & Types
import { generateTikTokVisual } from './services/gemini';
import { Country } from './types';
import { COUNTRY_CONFIG } from './constants';

export default function App() {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [country, setCountry] = useState<Country>('Japan');
  const [productName, setProductName] = useState('');
  const [scenePrompt, setScenePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

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

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'model' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'model') setModelImage(reader.result as string);
        else setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!modelImage || !productImage || !productName) {
      setError('请提供模特图片、产品图片和产品名称。');
      return;
    }

    const effectiveApiKey = customApiKey || process.env.GEMINI_API_KEY;
    
    // Determine quality based on whether a key was explicitly provided or selected in AI Studio
    const isHighQuality = !!customApiKey || (hasKey === true && !!window.aistudio);

    setIsGenerating(true);
    setError(null);

    try {
      let result: string;
      
      if (effectiveApiKey) {
        // Option A: Client-side generation (if key is available)
        result = await generateTikTokVisual({
          modelImage,
          productImage,
          productName,
          scenePrompt: scenePrompt || COUNTRY_CONFIG[country].defaultPrompt,
          country,
          apiKey: effectiveApiKey,
          isHighQuality
        });
      } else {
        // Option B: Server-side generation (Proxy mode)
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelImage,
            productImage,
            productName,
            scenePrompt: scenePrompt || COUNTRY_CONFIG[country].defaultPrompt,
            country,
            isHighQuality
          })
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("JSON Parse Error. Raw response:", responseText);
          const snippet = responseText.substring(0, 100).replace(/<[^>]*>?/gm, '');
          throw new Error(`服务器响应格式错误: ${snippet}... (可能是图片过大或后端崩溃)`);
        }

        if (!response.ok) throw new Error(data.error || '后端生成失败');
        result = data.imageUrl;
      }
      
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Requested entity was not found') || err.message?.includes('API_KEY_INVALID')) {
        if (customApiKey) {
          setError('您填入的 API Key 无效或不支持该模型。请检查后重试。');
        } else {
          setHasKey(false);
          setError('API Key 无效或已过期，请重新选择或填入 Key。');
        }
      } else {
        setError(err.message || '生成过程中发生错误。');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `tiktok-design-${productName.replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  const isHighQuality = !!customApiKey || (hasKey === true && !!window.aistudio);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black">
      <Header showSettings={showSettings} setShowSettings={setShowSettings} isHighQuality={isHighQuality} />
      
      <SettingsPanel 
        showSettings={showSettings} 
        setShowSettings={setShowSettings} 
        customApiKey={customApiKey} 
        setCustomApiKey={setCustomApiKey} 
        hasKey={hasKey}
      />

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 01. 视觉素材
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload 
                label="模特" 
                subLabel="人像/全身照" 
                image={modelImage} 
                onUpload={(e) => handleImageUpload(e, 'model')} 
                type="model" 
              />
              <ImageUpload 
                label="产品" 
                subLabel="清晰的产品实拍图" 
                image={productImage} 
                onUpload={(e) => handleImageUpload(e, 'product')} 
                type="product" 
              />
            </div>
          </section>

          <MarketSettings 
            country={country}
            setCountry={setCountry}
            productName={productName}
            setProductName={setProductName}
            scenePrompt={scenePrompt}
            setScenePrompt={setScenePrompt}
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !modelImage || !productImage || !productName}
            className={`w-full py-6 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              isGenerating || !modelImage || !productImage || !productName
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-orange-500 text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(249,115,22,0.3)]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在合成场景...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                生成 TikTok 带货素材
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">视觉预览</h2>
              {resultImage && (
                <button 
                  onClick={downloadResult}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <Download className="w-4 h-4" /> 下载图片
                </button>
              )}
            </div>

            <div className="relative aspect-[9/16] bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center group">
              <AnimatePresence mode="wait">
                {resultImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative"
                  >
                    <img src={resultImage} alt="Generated Visual" className="w-full h-full object-cover" />
                    
                    {/* TikTok UI Overlay Simulation */}
                    <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                      </div>
                      <div className="absolute bottom-10 left-4 right-20 space-y-2">
                        <div className="h-4 w-32 bg-white/20 rounded backdrop-blur-md" />
                        <div className="h-3 w-full bg-white/10 rounded backdrop-blur-md" />
                        <div className="h-3 w-2/3 bg-white/10 rounded backdrop-blur-md" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[9px] uppercase tracking-widest font-bold">TikTok 适用</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-12 space-y-6"
                  >
                    <div className="w-20 h-20 mx-auto border-2 border-dashed border-white/10 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white/10" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white/40">等待生成</p>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                        上传素材并选择目标市场，见证 AI 的魔力。
                      </p>
                    </div>
                    
                    {isGenerating && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest">正在融合像素</p>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">正在应用 {COUNTRY_CONFIG[country].label} 审美风格</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">专业建议</h3>
              <ul className="text-[10px] text-white/60 space-y-1 list-disc pl-4 leading-relaxed">
                <li>使用高分辨率图片以获得最佳合成效果。</li>
                <li>模特“拿着”或与空间“互动”的姿势效果最好。</li>
                <li>AI 将自动调整光影以匹配目标国家的氛围。</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-white/10 p-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">
          由 Gemini AI 驱动 &bull; 专为 TikTok 创作者设计
        </p>
      </footer>
    </div>
  );
}
