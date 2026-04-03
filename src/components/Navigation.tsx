/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ImageIcon, Video } from 'lucide-react';

interface NavigationProps {
  activeTab: 'image' | 'video';
  setActiveTab: (tab: 'image' | 'video') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="border-b border-border bg-white sticky top-[89px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'image' ? 'text-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          图片生成
          {activeTab === 'image' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'video' ? 'text-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Video className="w-4 h-4" />
          视频生成
          {activeTab === 'video' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
          )}
        </button>
      </div>
    </nav>
  );
};
