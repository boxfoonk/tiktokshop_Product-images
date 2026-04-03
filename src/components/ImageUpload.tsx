/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  subLabel: string;
  image: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: 'model' | 'product';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, subLabel, image, onUpload, type }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      onClick={() => inputRef.current?.click()}
      className={`relative aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
        image ? 'border-accent/50 bg-accent/5' : 'border-border bg-white hover:border-accent hover:bg-accent/5'
      }`}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={onUpload} 
        className="hidden" 
        accept="image/*"
      />
      {image ? (
        <>
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white">更换{label}</p>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <Upload className="w-8 h-8 mx-auto mb-2 text-text-muted/20" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">上传{label}图</p>
          <p className="text-[9px] text-text-muted/40 mt-1">{subLabel}</p>
        </div>
      )}
    </div>
  );
};
