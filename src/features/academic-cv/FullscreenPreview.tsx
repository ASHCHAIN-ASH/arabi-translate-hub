import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVRenderer } from './templates';
import type { CVData, CVLanguage, CVTemplate } from './types';

interface Props {
  open: boolean;
  onClose: () => void;
  data: CVData;
  lang: CVLanguage;
  template: CVTemplate;
}

export const FullscreenPreview: React.FC<Props> = ({ open, onClose, data, lang, template }) => {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">
            {lang === 'ar' ? 'معاينة كاملة الشاشة' : 'Fullscreen Preview'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="h-8 w-8 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="h-8 w-8 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 gap-1">
            <X className="w-4 h-4" />
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-muted/40 flex items-start justify-center">
        <div
          style={{
            width: '210mm', minHeight: '297mm', background: 'white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
          }}
        >
          <CVRenderer template={template} data={data} lang={lang} />
        </div>
      </div>
    </div>
  );
};
