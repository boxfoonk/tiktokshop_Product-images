/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";
import { COUNTRY_CONFIG } from "../constants";

export async function generateTikTokVisual(params: GenerationParams) {
  const { modelImage, productImage, productName, scenePrompt, country, apiKey } = params;
  
  const ai = new GoogleGenAI({ apiKey });
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

  // Determine model based on quality (if key is provided, assume high quality)
  // In a real Cloudflare Worker, we could check environment variables.
  const modelToUse = 'gemini-3.1-flash-image-preview';
  
  const response = await ai.models.generateContent({
    model: modelToUse,
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

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error('生成图片失败，未找到图像数据。');
}
