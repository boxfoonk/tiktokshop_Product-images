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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route: Proxy Gemini Generation
  app.post("/api/generate", async (req, res) => {
    try {
      const { modelImage, productImage, productName, scenePrompt, country, isHighQuality } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: "服务器未配置 GEMINI_API_KEY。请在本地 .env 文件中设置。" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const modelToUse = isHighQuality ? 'gemini-3.1-flash-image-preview' : 'gemini-2.5-flash-image';
      
      // Use the same logic as the frontend service
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [
            { inlineData: { data: modelImage.split(',')[1], mimeType: 'image/png' } },
            { inlineData: { data: productImage.split(',')[1], mimeType: 'image/png' } },
            { text: scenePrompt } // Simplified for proxy
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
      console.error("Proxy Error:", error);
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
