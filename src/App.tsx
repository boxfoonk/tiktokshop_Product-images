/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Upload, 
  Globe, 
  ShoppingBag, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API (Initial instance for general use, will be recreated for generation)
let ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Country = 'Brazil' | 'Germany' | 'France' | 'UK' | 'Japan';

// Extend Window interface for AI Studio APIs
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const COUNTRY_CONFIG: Record<Country, { label: string; flag: string; style: string; defaultPrompt: string }> = {
  Brazil: {
    label: '巴西',
    flag: '🇧🇷',
    style: '热情、明亮、温暖的自然光、充满活力。',
    defaultPrompt: 'A high-energy TikTok POV scene in a Rio de Janeiro beach background or a lush tropical courtyard. Bright natural sunlight, vibrant colors, model naturally showcasing the product to the camera.'
  },
  Germany: {
    label: '德国',
    flag: '🇩🇪',
    style: '现代、极简、注重质感、理性、结构感强。',
    defaultPrompt: 'A clean, modern TikTok unboxing or review scene in a Berlin industrial-style loft. Neutral tones, sharp focus, professional minimalist aesthetic, model demonstrating product utility.'
  },
  France: {
    label: '法国',
    flag: '🇫🇷',
    style: '优雅、艺术感、柔和、法式浪漫、历史感。',
    defaultPrompt: 'An elegant TikTok lifestyle scene at a chic Parisian street cafe or a Haussmann-style apartment. Soft romantic lighting, artistic composition, model naturally using the product in a stylish setting.'
  },
  UK: {
    label: '英国',
    flag: '🇬🇧',
    style: '经典、街头文化、复古与现代融合、冷调。',
    defaultPrompt: 'A dynamic TikTok street-style scene in a London red-brick neighborhood or Notting Hill. Slightly cool tones, eclectic urban vibe, model naturally interacting with the product in a busy city setting.'
  },
  Japan: {
    label: '日本',
    flag: '🇯🇵',
    style: '干净、极简、小清新、禅意、未来感与传统的融合。',
    defaultPrompt: 'A minimalist TikTok lifestyle scene in a clean Tokyo urban apartment or a neon-lit Shibuya street at night. Zen aesthetics, balanced composition, model showcasing the product with a futuristic yet traditional vibe.'
  }
};

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

  const modelInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

  // Check for API key on mount
  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback for local dev if needed
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per instructions
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

  const generateImage = async () => {
    if (!modelImage || !productImage || !productName) {
      setError('请提供模特图片、产品图片和产品名称。');
      return;
    }

    if (!hasKey) {
      setError('请先选择 API Key 以使用高质量生成模型。');
      await handleSelectKey();
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Re-initialize GoogleGenAI right before call to use the latest key
      const currentAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const finalPrompt = scenePrompt || COUNTRY_CONFIG[country].defaultPrompt;
      
      const systemInstruction = `
        You are a world-class E-commerce Visual Designer and Scene Integration Specialist for TikTok.
        Your task is to seamlessly blend the provided model image and product image into a high-quality, high-conversion TikTok marketing visual.
        
        STRICT CONSTRAINTS:
        1. Keep the model's facial features, body type, and original pose natural and recognizable.
        2. Ensure the product (${productName}) is clearly visible, accurately shaped, and naturally integrated (e.g., held by the model, worn, or placed nearby).
        3. The scene must strictly follow the aesthetic of ${country}: ${COUNTRY_CONFIG[country].style}
        4. Scene Context: ${finalPrompt}
        5. TikTok Optimization: Center the key elements (model and product) to avoid being blocked by TikTok UI elements (bottom text, right-side buttons).
        6. Visual Style: High saturation, impactful lighting, professional commercial photography.
        7. NO WATERMARKS: Do not include any watermarks, logos (other than the product's own brand), or text overlays.
        8. NO STICKERS/EFFECTS: Do not add any artificial stickers, emojis, or digital special effects. The image should look like a real, high-end professional photograph.
        9. CLARITY: Generate a crystal clear, high-resolution image with sharp details on both the model and the product.
        
        Output only the final composite image.
      `;

      const response = await currentAi.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            { inlineData: { data: modelImage.split(',')[1], mimeType: 'image/png' } },
            { inlineData: { data: productImage.split(',')[1], mimeType: 'image/png' } },
            { text: systemInstruction }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: "2K"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error('生成图片失败，请重试。');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Requested entity was not found')) {
        setHasKey(false);
        setError('API Key 无效或已过期，请重新选择。');
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Sparkles className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">TikTok 电商视觉设计师</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">电商场景合成专家</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest text-white/60">
          <span>全球市场</span>
          <span>AI 合成</span>
          <span>转化率优化</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 01. 视觉素材
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Model Upload */}
              <div 
                onClick={() => modelInputRef.current?.click()}
                className={`relative aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                  modelImage ? 'border-orange-500/50' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={modelInputRef} 
                  onChange={(e) => handleImageUpload(e, 'model')} 
                  className="hidden" 
                  accept="image/*"
                />
                {modelImage ? (
                  <>
                    <img src={modelImage} alt="Model" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-[10px] uppercase tracking-widest font-bold">更换模特</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-white/20" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">上传模特图</p>
                    <p className="text-[9px] text-white/40 mt-1">人像/全身照</p>
                  </div>
                )}
              </div>

              {/* Product Upload */}
              <div 
                onClick={() => productInputRef.current?.click()}
                className={`relative aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                  productImage ? 'border-orange-500/50' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={productInputRef} 
                  onChange={(e) => handleImageUpload(e, 'product')} 
                  className="hidden" 
                  accept="image/*"
                />
                {productImage ? (
                  <>
                    <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-[10px] uppercase tracking-widest font-bold">更换产品</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-white/20" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">上传产品图</p>
                    <p className="text-[9px] text-white/40 mt-1">清晰的产品实拍图</p>
                  </div>
                )}
              </div>
            </div>
          </section>

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

          <button
            onClick={generateImage}
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
                      {/* Right side buttons */}
                      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                      </div>
                      {/* Bottom text */}
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

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 p-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">
          由 Gemini AI 驱动 &bull; 专为 TikTok 创作者设计
        </p>
      </footer>
    </div>
  );
}
