/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Video, 
  Loader2, 
  Play, 
  AlertCircle,
  Download,
  CheckCircle2,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload } from '../components/ImageUpload';
import { MarketSettings } from '../components/MarketSettings';
import { generateTikTokVideo } from '../services/gemini';
import { Country } from '../types';
import { COUNTRY_CONFIG } from '../constants';

import { useConfig } from '../contexts/ConfigContext';

interface VideoModuleProps {
  isHighQuality: boolean;
  customApiKey: string;
  hasKey: boolean | null;
  state: {
    modelImage: string | null;
    country: Country;
    productName: string;
    videoScript: string;
    resultVideo: string | null;
  };
  setState: React.Dispatch<React.SetStateAction<{
    modelImage: string | null;
    country: Country;
    productName: string;
    videoScript: string;
    resultVideo: string | null;
  }>>;
}

export const VideoModule: React.FC<VideoModuleProps> = ({ isHighQuality, customApiKey, hasKey, state, setState }) => {
  const { modelImage, country, productName, videoScript, resultVideo } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useConfig();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, modelImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!modelImage || !productName) {
      setError(t('module.upload_ref') + ' ' + t('module.product_name'));
      return;
    }

    const effectiveApiKey = customApiKey || process.env.GEMINI_API_KEY;
    setIsGenerating(true);
    setError(null);
    setState(prev => ({ ...prev, resultVideo: null }));

    try {
      let result: string;
      if (effectiveApiKey) {
        result = await generateTikTokVideo({
          modelImage,
          productImage: null,
          productName,
          scenePrompt: '',
          videoScript,
          country,
          apiKey: effectiveApiKey,
          isHighQuality,
          mode: 'video'
        });
      } else {
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelImage,
            productName,
            videoScript,
            country
          })
        });
        const responseText = await response.text();
        let data;
        try { data = JSON.parse(responseText); } catch (e) {
          const snippet = responseText.substring(0, 100).replace(/<[^>]*>?/gm, '');
          throw new Error(`服务器响应格式错误: ${snippet}...`);
        }
        if (!response.ok) throw new Error(data.error || '后端生成失败');
        result = data.videoUrl;
      }
      setState(prev => ({ ...prev, resultVideo: result }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成过程中发生错误。');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResult = () => {
    if (resultVideo) {
      const link = document.createElement('a');
      link.href = resultVideo;
      link.download = `tiktok-video-${productName.replace(/\s+/g, '-')}.mp4`;
      link.click();
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
            <Monitor className="w-4 h-4" /> {t('module.visual_assets')}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <ImageUpload 
              label={t('module.upload_ref')} 
              subLabel="模特与产品参考图" 
              image={modelImage} 
              onUpload={handleImageUpload} 
              type="model" 
            />
          </div>
        </section>

        <MarketSettings 
          country={country}
          setCountry={(c) => setState(prev => ({ ...prev, country: c }))}
          productName={productName}
          setProductName={(val) => setState(prev => ({ ...prev, productName: val }))}
          scenePrompt=""
          setScenePrompt={() => {}}
          videoScript={videoScript}
          setVideoScript={(val) => setState(prev => ({ ...prev, videoScript: val }))}
          mode="video"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !modelImage || !productName}
          className={`w-full py-6 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
            isGenerating || !modelImage || !productName
            ? 'bg-card text-text-muted/30 border border-border cursor-not-allowed'
            : 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent/20'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('module.generating')}
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {t('module.generate_video')}
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
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">{t('module.preview')}</h2>
            {resultVideo && (
              <button 
                onClick={downloadResult}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent hover:text-accent-hover transition-colors"
              >
                <Download className="w-4 h-4" /> {t('module.download')}
              </button>
            )}
          </div>

          <div className="relative aspect-[9/16] bg-card border border-border rounded-2xl overflow-hidden flex items-center justify-center group shadow-sm">
            <AnimatePresence mode="wait">
              {resultVideo ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <video src={resultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
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
                  <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-text-main">{t('module.tiktok_ready')}</span>
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
                    <Video className="w-8 h-8 text-text-muted/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-text-muted">{t('module.wait')}</p>
                    <p className="text-[10px] text-text-muted/40 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                      {t('module.tips')}
                    </p>
                  </div>
                  {isGenerating && (
                    <div className="absolute inset-0 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-main">{t('module.generating')}</p>
                        <p className="text-[9px] text-text-muted uppercase tracking-widest">{COUNTRY_CONFIG[country].label}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-2 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('module.tips')}</h3>
            <ul className="text-[10px] text-text-muted space-y-1 list-disc pl-4 leading-relaxed">
              <li>视频生成可能需要 1-2 分钟，请耐心等待。</li>
              <li>脚本描述越具体，视频动作越自然。</li>
              <li>AI 将自动调整光影以匹配目标国家的氛围。</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};
