// src/data/homeLabels.ts
import { UILabelRecord } from '@/types';

/**
 * Home Page Labels
 */
export const homeLabels: UILabelRecord[] = [
  // English labels
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializeGameText', 
    languageCode: 'en', 
    translatedText: 'Initialize Game Data' 
  },
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializingText', 
    languageCode: 'en', 
    translatedText: 'Initializing...' 
  },
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializeGameDescription', 
    languageCode: 'en', 
    translatedText: 'This will create sample data for all game systems' 
  },
  
  // Chinese labels
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializeGameText', 
    languageCode: 'zh', 
    translatedText: '初始化游戏数据' 
  },
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializingText', 
    languageCode: 'zh', 
    translatedText: '初始化中...' 
  },
  { 
    scopeKey: 'homeView', 
    labelKey: 'initializeGameDescription', 
    languageCode: 'zh', 
    translatedText: '这将为所有游戏系统创建示例数据' 
  }
];
