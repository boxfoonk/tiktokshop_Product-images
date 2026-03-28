/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, CountryConfig } from './types';

export const COUNTRY_CONFIG: Record<Country, CountryConfig> = {
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
