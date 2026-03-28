/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Country = 'Brazil' | 'Germany' | 'France' | 'UK' | 'Japan';

export interface CountryConfig {
  label: string;
  flag: string;
  style: string;
  defaultPrompt: string;
}

export interface GenerationParams {
  modelImage: string;
  productImage: string;
  productName: string;
  scenePrompt: string;
  country: Country;
  apiKey: string;
  isHighQuality: boolean;
}
