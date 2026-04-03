/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// 混淆后的 SiliconFlow Key (Base64 + 反转)
const _D_K = "eG9sbHNobWJ1Y2xsc2licWd6eWd5Y3l5d2ZndHdpeGJjbHlpdmhzbHZubnBweXpxbmlha3M=";
const getFallbackKey = () => Buffer.from(_D_K, 'base64').toString().split('').reverse().join('');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 极大化限制以处理超高清 Base64 图片 (200MB)
  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ limit: '200mb', extended: true }));

  // API 路由必须在 Vite 中间件之前
  app.post("/api/generate", async (req, res) => {
    console.log(`[${new Date().toISOString()}] 收到生成请求: ${req.body?.productName || '未命名'}`);
    
    try {
      const { modelImage, productImage, productName, scenePrompt, country, isHighQuality } = req.body || {};
      
      if (!modelImage || !productImage) {
        return res.status(400).json({ error: "请求体解析失败或缺少图片素材。请尝试缩小图片体积。" });
      }

      // 优先级：环境变量 > 混淆的默认 Key
      const apiKey = process.env.GEMINI_API_KEY || getFallbackKey();

      if (!apiKey) {
        return res.status(400).json({ error: "未检测到有效的 API Key。" });
      }

      // 如果是 SiliconFlow 的 Key (sk- 开头)
      if (apiKey.startsWith('sk-')) {
        console.log("检测到 SiliconFlow Key，正在调用 SiliconFlow (FLUX) 接口...");
        
        const sfResponse = await fetch("https://api.siliconflow.cn/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "black-forest-labs/FLUX.1-schnell",
            prompt: `Professional TikTok E-commerce visual for ${productName}. Scene: ${scenePrompt}. Style: High-end commercial photography, vibrant colors, ${country} aesthetic. High resolution, 4k, sharp focus.`,
            image_size: "720x1280",
            batch_size: 1
          })
        });

        const sfData: any = await sfResponse.json();
        if (sfData.images && sfData.images[0]?.url) {
          return res.json({ imageUrl: sfData.images[0].url });
        } else {
          throw new Error(sfData.message || "SiliconFlow 生成失败");
        }
      }

      // 否则使用 Gemini 逻辑
      const ai = new GoogleGenAI({ apiKey });
      const modelToUse = isHighQuality ? 'gemini-3.1-flash-image-preview' : 'gemini-2.5-flash-image';
      
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [
            { inlineData: { data: modelImage.split(',')[1], mimeType: 'image/png' } },
            { inlineData: { data: productImage.split(',')[1], mimeType: 'image/png' } },
            { text: scenePrompt }
          ]
        },
        config: {
          imageConfig: isHighQuality ? { aspectRatio: "9:16", imageSize: "2K" } : { aspectRatio: "9:16" }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
      }

      res.status(500).json({ error: "生成失败，未找到图像数据。" });
    } catch (error: any) {
      console.error("Generation Error:", error);
      res.status(500).json({ error: error.message || "服务器内部错误" });
    }
  });

  app.post("/api/generate-video", async (req, res) => {
    console.log(`[${new Date().toISOString()}] 收到视频生成请求: ${req.body?.productName || '未命名'}`);
    
    try {
      const { modelImage, productImage, productName, videoScript, country } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY || getFallbackKey();

      if (!apiKey) {
        return res.status(400).json({ error: "未检测到有效的 API Key。" });
      }

      // SiliconFlow doesn't support Veo, so we only use Gemini for video
      if (apiKey.startsWith('sk-')) {
        return res.status(400).json({ error: "SiliconFlow 目前仅支持图片生成。请使用 Gemini API Key 以生成视频。" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Create a high-conversion TikTok marketing video for ${productName}.
        Market: ${country}
        Script/Action: ${videoScript || 'The model showcases the product in a lifestyle setting.'}
        Visual Style: High-end professional commercial video, vibrant colors, sharp focus.
      `;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: modelImage.split(',')[1],
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error('视频生成失败，未找到视频链接。');

      const videoResponse = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      const buffer = await videoResponse.arrayBuffer();
      const base64Video = Buffer.from(buffer).toString('base64');
      
      res.json({ videoUrl: `data:video/mp4;base64,${base64Video}` });
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      res.status(500).json({ error: error.message || "服务器内部错误" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn("警告: GEMINI_API_KEY 未设置。请在 .env 中配置以启用默认生成模式。");
    }
  });
}

startServer();
