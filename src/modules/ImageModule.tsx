/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ImageIcon, 
  Loader2, 
  Sparkles, 
  AlertCircle,
  Download,
  CheckCircle2,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload } from '../components/ImageUpload';
import { MarketSettings } from '../components/MarketSettings';
import { generateTikTokVisual } from '../services/gemini';
import { Country } from '../types';
import { COUNTRY_CONFIG } from '../constants';

interface ImageModuleProps {
  isHighQuality: boolean;
  customApiKey: string;
  hasKey: boolean | null;
  state: {
    modelImage: string | null;
    productImage: string | null;
    country: Country;
    productName: string;
    scenePrompt: string;
    resultImage: string | null;
  };
  setState: React.Dispatch<React.SetStateAction<{
    modelImage: string | null;
    productImage: string | null;
    country: Country;
    productName: string;
    scenePrompt: string;
    resultImage: string | null;
  }>>;
}

export const ImageModule: React.FC<ImageModuleProps> = ({ isHighQuality, customApiKey, hasKey, state, setState }) => {
  const { modelImage, productImage, country, productName, scenePrompt, resultImage } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'model' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          [type === 'model' ? 'modelImage' : 'productImage']: reader.result as string
        }));
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
    setIsGenerating(true);
    setError(null);
    setState(prev => ({ ...prev, resultImage: null }));

    try {
      let result: string;
      if (effectiveApiKey) {
        result = await generateTikTokVisual({
          modelImage,
          productImage,
          productName,
          scenePrompt: scenePrompt || COUNTRY_CONFIG[country].defaultPrompt,
          country,
          apiKey: effectiveApiKey,
          isHighQuality,
          mode: 'image'
        });
      } else {
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
        try { data = JSON.parse(responseText); } catch (e) {
          const snippet = responseText.substring(0, 100).replace(/<[^>]*>?/gm, '');
          throw new Error(`服务器响应格式错误: ${snippet}...`);
        }
        if (!response.ok) throw new Error(data.error || '后端生成失败');
        result = data.imageUrl;
      }
      setState(prev => ({ ...prev, resultImage: result }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成过程中发生错误。');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `tiktok-image-${productName.replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
            <Monitor className="w-4 h-4" /> 01. 视觉素材
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
              subLabel="产品实拍图" 
              image={productImage} 
              onUpload={(e) => handleImageUpload(e, 'product')} 
              type="product" 
            />
          </div>
        </section>

        <MarketSettings 
          country={country}
          setCountry={(c) => setState(prev => ({ ...prev, country: c }))}
          productName={productName}
          setProductName={(val) => setState(prev => ({ ...prev, productName: val }))}
          scenePrompt={scenePrompt}
          setScenePrompt={(val) => setState(prev => ({ ...prev, scenePrompt: val }))}
          videoScript=""
          setVideoScript={() => {}}
          mode="image"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !modelImage || !productImage || !productName}
          className={`w-full py-6 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
            isGenerating || !modelImage || !productImage || !productName
            ? 'bg-white text-text-muted/30 border border-border cursor-not-allowed'
            : 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent/20'
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
            className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </div>

      <div className="lg:col-span-7">
        <div className="sticky top-40 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">视觉预览</h2>
            {resultImage && (
              <button 
                onClick={downloadResult}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent hover:text-accent-hover transition-colors"
              >
                <Download className="w-4 h-4" /> 下载图片
              </button>
            )}
          </div>

          <div className="relative aspect-[9/16] bg-white border border-border rounded-2xl overflow-hidden flex items-center justify-center group shadow-sm">
            <AnimatePresence mode="wait">
              {resultImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <img src={resultImage} alt="Generated Visual" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
                    <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                      <div className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-sm border border-black/10" />
                      <div className="w-8 h-8 rounded-full bg-black/10 backdrop-blur-sm border border-black/10" />
                      <div className="w-8 h-8 rounded-full bg-black/10 backdrop-blur-sm border border-black/10" />
                      <div className="w-8 h-8 rounded-full bg-black/10 backdrop-blur-sm border border-black/10" />
                    </div>
                    <div className="absolute bottom-10 left-4 right-20 space-y-2">
                      <div className="h-4 w-32 bg-black/10 rounded backdrop-blur-sm" />
                      <div className="h-3 w-full bg-black/5 rounded backdrop-blur-sm" />
                      <div className="h-3 w-2/3 bg-black/5 rounded backdrop-blur-sm" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-text-main">TikTok 适用</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12 space-y-6"
                >
                  <div className="w-20 h-20 mx-auto border-2 border-dashed border-border rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-text-muted/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-text-muted">等待生成</p>
                    <p className="text-[10px] text-text-muted/40 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                      上传模特和产品图，见证 AI 的魔力。
                    </p>
                  </div>
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-main">正在融合像素</p>
                        <p className="text-[9px] text-text-muted uppercase tracking-widest">正在应用 {COUNTRY_CONFIG[country].label} 审美风格</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 rounded-xl bg-white border border-border space-y-2 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">专业建议</h3>
            <ul className="text-[10px] text-text-muted space-y-1 list-disc pl-4 leading-relaxed">
              <li>使用高分辨率图片以获得最佳合成效果。</li>
              <li>模特“拿着”或与空间“互动”的姿势效果最好。</li>
              <li>AI 将自动调整光影以匹配目标国家的氛围。</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};
