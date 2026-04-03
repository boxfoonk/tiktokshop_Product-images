/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'en' | 'de' | 'fr' | 'pt-BR' | 'ja' | 'th' | 'es';
export type Theme = 'light' | 'dark';

export interface AccentColor {
  name: string;
  value: string;
  hover: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Sky', value: '#0ea5e9', hover: '#0284c7' },
  { name: 'Rose', value: '#f43f5e', hover: '#e11d48' },
  { name: 'Violet', value: '#8b5cf6', hover: '#7c3aed' },
  { name: 'Emerald', value: '#10b981', hover: '#059669' },
  { name: 'Amber', value: '#f59e0b', hover: '#d97706' },
];

interface ConfigContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    'app.title': 'TikTok 视觉设计师',
    'app.subtitle': 'AI 创意合成专家',
    'app.footer': '由 Gemini AI 驱动 • 专为 TikTok 创作者设计',
    'nav.image': '图片生成',
    'nav.video': '视频生成',
    'settings.title': '运行设置',
    'settings.close': '关闭',
    'settings.apikey': 'Gemini API Key (填入后开启 2K 高画质)',
    'settings.placeholder': '在此输入您的 API Key...',
    'settings.hq_mode': '高画质模式',
    'settings.default_mode': '默认画质 (无需 Key)',
    'settings.tip': '提示：如果您在 AI Studio 预览中运行，可以直接使用平台提供的 Key。本地运行时，填入 Key 可解锁 2K 分辨率。',
    'config.title': '个性化设置',
    'config.theme': '主题模式',
    'config.theme.light': '日间模式',
    'config.theme.dark': '夜间模式',
    'config.accent': '主题配色',
    'config.language': '语言选择',
    'module.visual_assets': '01. 视觉素材',
    'module.market_creative': '02. 市场与创意',
    'module.generate_image': '生成 TikTok 带货素材',
    'module.generate_video': '生成 TikTok 营销视频',
    'module.generating': '正在生成...',
    'module.preview': '视觉预览',
    'module.download': '下载',
    'module.tips': '专业建议',
    'module.wait': '等待生成',
    'module.upload_prefix': '上传',
    'module.change_prefix': '更换',
    'module.upload_model': '模特图',
    'module.upload_product': '产品图',
    'module.upload_ref': '参考图',
    'module.target_country': '目标国家',
    'module.product_name': '产品名称',
    'module.scene_prompt': '场景描述（可选）',
    'module.video_script': '视频脚本 / 动作描述',
    'module.product_placeholder': '例如：降噪蓝牙耳机',
    'module.scene_placeholder': '留空则自动匹配 TikTok 热门带货场景...',
    'module.video_script_placeholder': '描述模特的动作，例如：模特拿起耳机戴上，露出满意的笑容...',
    'module.tiktok_ready': 'TikTok 适用',
    'module.error_format': '服务器响应格式错误',
    'module.error_backend': '后端生成失败',
    'module.error_general': '生成过程中发生错误',
  },
  en: {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'AI Creative Synthesis Expert',
    'app.footer': 'Powered by Gemini AI • Designed for TikTok Creators',
    'nav.image': 'Image Gen',
    'nav.video': 'Video Gen',
    'settings.title': 'Runtime Settings',
    'settings.close': 'Close',
    'settings.apikey': 'Gemini API Key (Unlock 2K High Quality)',
    'settings.placeholder': 'Enter your API Key here...',
    'settings.hq_mode': 'High Quality Mode',
    'settings.default_mode': 'Default Quality (No Key)',
    'settings.tip': 'Tip: If running in AI Studio, use the platform key. For local use, enter a key to unlock 2K resolution.',
    'config.title': 'Personalization',
    'config.theme': 'Theme Mode',
    'config.theme.light': 'Light Mode',
    'config.theme.dark': 'Dark Mode',
    'config.accent': 'Accent Color',
    'config.language': 'Language',
    'module.visual_assets': '01. Visual Assets',
    'module.market_creative': '02. Market & Creative',
    'module.generate_image': 'Generate TikTok Asset',
    'module.generate_video': 'Generate TikTok Video',
    'module.generating': 'Generating...',
    'module.preview': 'Visual Preview',
    'module.download': 'Download',
    'module.tips': 'Pro Tips',
    'module.wait': 'Waiting for Generation',
    'module.upload_prefix': 'Upload',
    'module.change_prefix': 'Change',
    'module.upload_model': 'Model',
    'module.upload_product': 'Product',
    'module.upload_ref': 'Reference',
    'module.target_country': 'Target Country',
    'module.product_name': 'Product Name',
    'module.scene_prompt': 'Scene Description (Optional)',
    'module.video_script': 'Video Script / Action Description',
    'module.product_placeholder': 'e.g. Noise Cancelling Headphones',
    'module.scene_placeholder': 'Leave empty for auto-matched TikTok scenes...',
    'module.video_script_placeholder': 'Describe actions, e.g. Model puts on headphones and smiles...',
    'module.tiktok_ready': 'TikTok Ready',
    'module.error_format': 'Server response format error',
    'module.error_backend': 'Backend generation failed',
    'module.error_general': 'An error occurred during generation',
  },
  de: {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'KI-Experte für kreative Synthese',
    'app.footer': 'Unterstützt von Gemini AI • Entwickelt für TikTok-Ersteller',
    'nav.image': 'Bildgen.',
    'nav.video': 'Videogen.',
    'settings.title': 'Laufzeiteinstellungen',
    'settings.close': 'Schließen',
    'settings.apikey': 'Gemini API-Schlüssel (2K High Quality freischalten)',
    'settings.placeholder': 'Geben Sie hier Ihren API-Schlüssel ein...',
    'settings.hq_mode': 'Hochqualitätsmodus',
    'settings.default_mode': 'Standardqualität (Kein Schlüssel)',
    'settings.tip': 'Tipp: Wenn Sie in der AI Studio-Vorschau arbeiten, verwenden Sie den Plattform-Schlüssel. Für die lokale Nutzung geben Sie einen Schlüssel ein, um die 2K-Auflösung freizuschalten.',
    'config.title': 'Personalisierung',
    'config.theme': 'Themenmodus',
    'config.theme.light': 'Heller Modus',
    'config.theme.dark': 'Dunkler Modus',
    'config.accent': 'Akzentfarbe',
    'config.language': 'Sprache',
    'module.visual_assets': '01. Visuelle Assets',
    'module.market_creative': '02. Markt & Kreativität',
    'module.generate_image': 'TikTok-Asset generieren',
    'module.generate_video': 'TikTok-Video generieren',
    'module.generating': 'Generierung...',
    'module.preview': 'Visuelle Vorschau',
    'module.download': 'Herunterladen',
    'module.tips': 'Profis-Tipps',
    'module.wait': 'Warten auf Generierung',
    'module.upload_prefix': 'Hochladen',
    'module.change_prefix': 'Ändern',
    'module.upload_model': 'Modell',
    'module.upload_product': 'Produkt',
    'module.upload_ref': 'Referenz',
    'module.target_country': 'Zielland',
    'module.product_name': 'Produktname',
    'module.scene_prompt': 'Szenenbeschreibung (Optional)',
    'module.video_script': 'Videoskript / Aktionsbeschreibung',
    'module.product_placeholder': 'z.B. Noise-Cancelling-Kopfhörer',
    'module.scene_placeholder': 'Leer lassen für automatisch angepasste TikTok-Szenen...',
    'module.video_script_placeholder': 'Beschreiben Sie Aktionen, z.B. Modell setzt Kopfhörer auf und lächelt...',
    'module.tiktok_ready': 'TikTok-bereit',
    'module.error_format': 'Fehler im Serverantwortformat',
    'module.error_backend': 'Backend-Generierung fehlgeschlagen',
    'module.error_general': 'Ein Fehler ist während der Generierung aufgetreten',
  },
  fr: {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'Expert en synthèse créative IA',
    'app.footer': 'Propulsé par Gemini AI • Conçu pour les créateurs TikTok',
    'nav.image': 'Gén. d\'images',
    'nav.video': 'Gén. de vidéos',
    'settings.title': 'Paramètres d\'exécution',
    'settings.close': 'Fermer',
    'settings.apikey': 'Clé API Gemini (Débloquer la haute qualité 2K)',
    'settings.placeholder': 'Entrez votre clé API ici...',
    'settings.hq_mode': 'Mode haute qualité',
    'settings.default_mode': 'Qualité par défaut (Sans clé)',
    'settings.tip': 'Conseil : Si vous exécutez dans l\'aperçu AI Studio, utilisez la clé de la plateforme. Pour une utilisation locale, entrez une clé pour débloquer la résolution 2K.',
    'config.title': 'Personnalisation',
    'config.theme': 'Mode Thème',
    'config.theme.light': 'Mode Clair',
    'config.theme.dark': 'Mode Sombre',
    'config.accent': 'Couleur d\'accentuation',
    'config.language': 'Langue',
    'module.visual_assets': '01. Atouts visuels',
    'module.market_creative': '02. Marché & Créativité',
    'module.generate_image': 'Générer un atout TikTok',
    'module.generate_video': 'Générer une vidéo TikTok',
    'module.generating': 'Génération...',
    'module.preview': 'Aperçu visuel',
    'module.download': 'Télécharger',
    'module.tips': 'Conseils de pro',
    'module.wait': 'En attente de génération',
    'module.upload_prefix': 'Télécharger',
    'module.change_prefix': 'Changer',
    'module.upload_model': 'Modèle',
    'module.upload_product': 'Produit',
    'module.upload_ref': 'Référence',
    'module.target_country': 'Pays cible',
    'module.product_name': 'Nom du produit',
    'module.scene_prompt': 'Description de la scène (Facultatif)',
    'module.video_script': 'Script vidéo / Description de l\'action',
    'module.product_placeholder': 'ex: Casque à réduction de bruit',
    'module.scene_placeholder': 'Laissez vide pour des scènes TikTok adaptées automatiquement...',
    'module.video_script_placeholder': 'Décrivez les actions, ex: Le modèle met le casque et sourit...',
    'module.tiktok_ready': 'Prêt pour TikTok',
    'module.error_format': 'Erreur de format de réponse du serveur',
    'module.error_backend': 'Échec de la génération du backend',
    'module.error_general': 'Une erreur s\'est produite lors de la génération',
  },
  'pt-BR': {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'Especialista em Síntese Criativa de IA',
    'app.footer': 'Alimentado por Gemini AI • Projetado para criadores do TikTok',
    'nav.image': 'Gerar Imagem',
    'nav.video': 'Gerar Vídeo',
    'settings.title': 'Configurações de Execução',
    'settings.close': 'Fechar',
    'settings.apikey': 'Chave API Gemini (Desbloquear Alta Qualidade 2K)',
    'settings.placeholder': 'Digite sua chave API aqui...',
    'settings.hq_mode': 'Modo de Alta Qualidade',
    'settings.default_mode': 'Qualidade Padrão (Sem Chave)',
    'settings.tip': 'Dica: Se estiver executando na visualização do AI Studio, use a chave da plataforma. Para uso local, insira uma chave para desbloquear a resolução 2K.',
    'config.title': 'Personalização',
    'config.theme': 'Modo de Tema',
    'config.theme.light': 'Modo Claro',
    'config.theme.dark': 'Modo Escuro',
    'config.accent': 'Cor de Destaque',
    'config.language': 'Idioma',
    'module.visual_assets': '01. Ativos Visuais',
    'module.market_creative': '02. Mercado e Criativo',
    'module.generate_image': 'Gerar Ativo do TikTok',
    'module.generate_video': 'Gerar Vídeo do TikTok',
    'module.generating': 'Gerando...',
    'module.preview': 'Visualização Visual',
    'module.download': 'Baixar',
    'module.tips': 'Dicas Profissionais',
    'module.wait': 'Aguardando Geração',
    'module.upload_prefix': 'Carregar',
    'module.change_prefix': 'Alterar',
    'module.upload_model': 'Modelo',
    'module.upload_product': 'Produto',
    'module.upload_ref': 'Referência',
    'module.target_country': 'País de Destino',
    'module.product_name': 'Nome do Produto',
    'module.scene_prompt': 'Descrição da Cena (Opcional)',
    'module.video_script': 'Roteiro do Vídeo / Descrição da Ação',
    'module.product_placeholder': 'ex: Fones de ouvido com cancelamento de ruído',
    'module.scene_placeholder': 'Deixe vazio para cenas do TikTok combinadas automaticamente...',
    'module.video_script_placeholder': 'Descreva as ações, ex: O modelo coloca os fones de ouvido e sorri...',
    'module.tiktok_ready': 'Pronto para TikTok',
    'module.error_format': 'Erro de formato de resposta do servidor',
    'module.error_backend': 'Falha na geração do backend',
    'module.error_general': 'Ocorreu um erro durante a geração',
  },
  ja: {
    'app.title': 'TikTok ビジュアルデザイナー',
    'app.subtitle': 'AI クリエイティブ合成エキスパート',
    'app.footer': 'Gemini AI 搭載 • TikTok クリエイター向けに設計',
    'nav.image': '画像生成',
    'nav.video': '動画生成',
    'settings.title': '実行設定',
    'settings.close': '閉じる',
    'settings.apikey': 'Gemini API キー (2K 高画質をアンロック)',
    'settings.placeholder': 'ここに API キーを入力...',
    'settings.hq_mode': '高画質モード',
    'settings.default_mode': 'デフォルト画質 (キーなし)',
    'settings.tip': 'ヒント: AI Studio プレビューで実行している場合は、プラットフォームキーを使用してください。ローカルで使用する場合は、キーを入力して 2K 解像度をアンロックしてください。',
    'config.title': 'パーソナライズ',
    'config.theme': 'テーマモード',
    'config.theme.light': 'ライトモード',
    'config.theme.dark': 'ダークモード',
    'config.accent': 'アクセントカラー',
    'config.language': '言語',
    'module.visual_assets': '01. ビジュアルアセット',
    'module.market_creative': '02. マーケット & クリエイティブ',
    'module.generate_image': 'TikTok アセットを生成',
    'module.generate_video': 'TikTok 動画を生成',
    'module.generating': '生成中...',
    'module.preview': 'ビジュアルプレビュー',
    'module.download': 'ダウンロード',
    'module.tips': 'プロのヒント',
    'module.wait': '生成待機中',
    'module.upload_prefix': 'アップロード',
    'module.change_prefix': '変更',
    'module.upload_model': 'モデル',
    'module.upload_product': '製品',
    'module.upload_ref': '参照',
    'module.target_country': '対象国',
    'module.product_name': '製品名',
    'module.scene_prompt': 'シーンの説明 (オプション)',
    'module.video_script': '動画スクリプト / アクションの説明',
    'module.product_placeholder': '例：ノイズキャンセリングヘッドホン',
    'module.scene_placeholder': '自動マッチングのために空のままにしてください...',
    'module.video_script_placeholder': '動作を説明してください（例：モデルがヘッドホンを装着して微笑む...）',
    'module.tiktok_ready': 'TikTok 対応',
    'module.error_format': 'サーバーレスポンス形式エラー',
    'module.error_backend': 'バックエンド生成に失敗しました',
    'module.error_general': '生成中にエラーが発生しました',
  },
  th: {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'ผู้เชี่ยวชาญด้านการสังเคราะห์ความคิดสร้างสรรค์ด้วย AI',
    'app.footer': 'ขับเคลื่อนโดย Gemini AI • ออกแบบมาสำหรับผู้สร้าง TikTok',
    'nav.image': 'สร้างรูปภาพ',
    'nav.video': 'สร้างวิดีโอ',
    'settings.title': 'การตั้งค่ารันไทม์',
    'settings.close': 'ปิด',
    'settings.apikey': 'คีย์ API Gemini (ปลดล็อกคุณภาพสูง 2K)',
    'settings.placeholder': 'ป้อนคีย์ API ของคุณที่นี่...',
    'settings.hq_mode': 'โหมดคุณภาพสูง',
    'settings.default_mode': 'คุณภาพเริ่มต้น (ไม่มีคีย์)',
    'settings.tip': 'เคล็ดลับ: หากรันในการแสดงตัวอย่าง AI Studio ให้ใช้คีย์ของแพลตฟอร์ม สำหรับการใช้งานในเครื่อง ให้ป้อนคีย์เพื่อปลดล็อกความละเอียด 2K',
    'config.title': 'การปรับแต่งส่วนตัว',
    'config.theme': 'โหมดธีม',
    'config.theme.light': 'โหมดสว่าง',
    'config.theme.dark': 'โหมดมืด',
    'config.accent': 'สีเน้น',
    'config.language': 'ภาษา',
    'module.visual_assets': '01. สินทรัพย์ภาพ',
    'module.market_creative': '02. ตลาดและความคิดสร้างสรรค์',
    'module.generate_image': 'สร้างสินทรัพย์ TikTok',
    'module.generate_video': 'สร้างวิดีโอ TikTok',
    'module.generating': 'กำลังสร้าง...',
    'module.preview': 'ตัวอย่างภาพ',
    'module.download': 'ดาวน์โหลด',
    'module.tips': 'เคล็ดลับระดับโปร',
    'module.wait': 'รอการสร้าง',
    'module.upload_prefix': 'อัปโหลด',
    'module.change_prefix': 'เปลี่ยน',
    'module.upload_model': 'นางแบบ',
    'module.upload_product': 'สินค้า',
    'module.upload_ref': 'ข้อมูลอ้างอิง',
    'module.target_country': 'ประเทศเป้าหมาย',
    'module.product_name': 'ชื่อสินค้า',
    'module.scene_prompt': 'คำอธิบายฉาก (ไม่บังคับ)',
    'module.video_script': 'สคริปต์วิดีโอ / คำอธิบายท่าทาง',
    'module.product_placeholder': 'เช่น หูฟังตัดเสียงรบกวน',
    'module.scene_placeholder': 'เว้นว่างไว้สำหรับฉาก TikTok ที่จับคู่โดยอัตโนมัติ...',
    'module.video_script_placeholder': 'อธิบายท่าทาง เช่น นางแบบสวมหูฟังแล้วยิ้ม...',
    'module.tiktok_ready': 'พร้อมสำหรับ TikTok',
    'module.error_format': 'ข้อผิดพลาดรูปแบบการตอบกลับของเซิร์ฟเวอร์',
    'module.error_backend': 'การสร้างแบ็กเอนด์ล้มเหลว',
    'module.error_general': 'เกิดข้อผิดพลาดระหว่างการสร้าง',
  },
  es: {
    'app.title': 'TikTok Visual Designer',
    'app.subtitle': 'Experto en síntesis creativa de IA',
    'app.footer': 'Impulsado por Gemini AI • Diseñado para creadores de TikTok',
    'nav.image': 'Gen. de imagen',
    'nav.video': 'Gen. de video',
    'settings.title': 'Configuración de tiempo de ejecución',
    'settings.close': 'Cerrar',
    'settings.apikey': 'Clave API de Gemini (Desbloquear alta calidad 2K)',
    'settings.placeholder': 'Ingrese su clave API aquí...',
    'settings.hq_mode': 'Modo de alta calidad',
    'settings.default_mode': 'Calidad predeterminada (Sin clave)',
    'settings.tip': 'Consejo: Si se ejecuta en la vista previa de AI Studio, use la clave de la plataforma. Para uso local, ingrese una clave para desbloquear la resolución 2K.',
    'config.title': 'Personalización',
    'config.theme': 'Modo de tema',
    'config.theme.light': 'Modo claro',
    'config.theme.dark': 'Modo oscuro',
    'config.accent': 'Color de acento',
    'config.language': 'Idioma',
    'module.visual_assets': '01. Activos visuales',
    'module.market_creative': '02. Mercado y creatividad',
    'module.generate_image': 'Generar activo de TikTok',
    'module.generate_video': 'Generar video de TikTok',
    'module.generating': 'Generando...',
    'module.preview': 'Vista previa visual',
    'module.download': 'Descargar',
    'module.tips': 'Consejos profesionales',
    'module.wait': 'Esperando generación',
    'module.upload_prefix': 'Subir',
    'module.change_prefix': 'Cambiar',
    'module.upload_model': 'Modelo',
    'module.upload_product': 'Producto',
    'module.upload_ref': 'Referencia',
    'module.target_country': 'País de destino',
    'module.product_name': 'Nombre del producto',
    'module.scene_prompt': 'Descripción de la escena (Opcional)',
    'module.video_script': 'Guion de video / Descripción de la acción',
    'module.product_placeholder': 'p. ej. Auriculares con cancelación de ruido',
    'module.scene_placeholder': 'Deje vacío para escenas de TikTok emparejadas automáticamente...',
    'module.video_script_placeholder': 'Describa las acciones, p. ej. El modelo se pone los auriculares y sonríe...',
    'module.tiktok_ready': 'Listo para TikTok',
    'module.error_format': 'Error de formato de respuesta del servidor',
    'module.error_backend': 'Error en la generación del backend',
    'module.error_general': 'Ocurrió un error durante la generación',
  }
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'zh';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as Theme) || 'light';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('app-accent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ACCENT_COLORS[0];
      }
    }
    return ACCENT_COLORS[0];
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-accent', JSON.stringify(accentColor));
    document.documentElement.style.setProperty('--accent-color', accentColor.value);
    document.documentElement.style.setProperty('--accent-color-hover', accentColor.hover);
  }, [accentColor]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <ConfigContext.Provider value={{ language, setLanguage, theme, setTheme, accentColor, setAccentColor, t }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
