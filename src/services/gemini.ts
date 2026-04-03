/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import { GenerationParams } from "../types";
import { COUNTRY_CONFIG } from "../constants";

export async function generateTikTokVisual(params: GenerationParams) {
  const { modelImage, productImage, productName, scenePrompt, country, apiKey, isHighQuality } = params;
  
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

  const modelToUse = isHighQuality ? 'gemini-3.1-flash-image-preview' : 'gemini-2.5-flash-image';
  const imageConfig = isHighQuality 
    ? { aspectRatio: "9:16", imageSize: "2K" as const } 
    : { aspectRatio: "9:16" as const };
  
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
      imageConfig
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error('生成图片失败，未找到图像数据。');
}

export async function generateTikTokVideo(params: GenerationParams) {
  const { modelImage, productImage, productName, videoScript, country, apiKey } = params;
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Create a high-conversion TikTok marketing video for ${productName}.
    Market: ${country} (${COUNTRY_CONFIG[country].style})
    Script/Action: ${videoScript || 'The model showcases the product in a lifestyle setting.'}
    Ensure the product is clearly visible and the model looks natural.
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

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error('视频生成失败，未找到视频链接。');

  // To fetch the video, append the Gemini API key to the `x-goog-api-key` header.
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
