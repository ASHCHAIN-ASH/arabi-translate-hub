import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Check, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  onChange?: (dataUrl: string | null) => void;
  className?: string;
  height?: number;
  disabled?: boolean;
  initialValue?: string | null;
}

/**
 * لوحة توقيع رقمي بالإصبع/الفأرة باستخدام Canvas
 * - يدعم اللمس والماوس
 * - يُخرج صورة Base64 PNG
 */
export const SignaturePad: React.FC<SignaturePadProps> = ({
  onChange,
  className,
  height = 200,
  disabled = false,
  initialValue = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasSignature, setHasSignature] = useState(!!initialValue);

  const getContext = () => canvasRef.current?.getContext('2d') ?? null;

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a';
    if (initialValue) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    setupCanvas();
    const handler = () => setupCanvas();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [setupCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || disabled) return;
    e.preventDefault();
    const ctx = getContext();
    if (!ctx || !lastPointRef.current) return;
    const point = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  };

  const end = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setHasSignature(true);
      onChange?.(dataUrl);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange?.(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-colors overflow-hidden bg-card',
          hasSignature ? 'border-primary/50' : 'border-border',
          disabled && 'opacity-60 pointer-events-none'
        )}
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={start}
          onMouseMove={draw}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={draw}
          onTouchEnd={end}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2 text-muted-foreground">
            <PenLine className="w-8 h-8 opacity-40" />
            <span className="text-sm">وقّع هنا بإصبعك أو الفأرة</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={disabled || !hasSignature}
        >
          <Eraser className="w-4 h-4 ml-1" />
          مسح
        </Button>
        {hasSignature && (
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            تم التوقيع
          </span>
        )}
      </div>
    </div>
  );
};

export default SignaturePad;
