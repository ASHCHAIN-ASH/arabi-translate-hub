import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PenLine } from "lucide-react";

interface Props {
  value?: string;
  onChange: (dataUrl: string | null) => void;
  height?: number;
}

/**
 * لوحة رسم التوقيع - تدعم الماوس واللمس.
 * تُرجع التوقيع كـ Base64 PNG عبر onChange.
 */
const SignaturePad: React.FC<Props> = ({ value, onChange, height = 180 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!value);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // إعداد الكانفاس مع DPR للحصول على رسم حاد
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0a1f3d";
    ctx.lineWidth = 2.4;
    // خلفية بيضاء
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // إذا كان هناك توقيع سابق، ارسمه
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value;
      setHasDrawn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  };

  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    lastPos.current = null;
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (dataUrl) onChange(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div
        className="relative rounded-xl border-2 border-dashed border-primary/40 bg-white overflow-hidden touch-none"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <PenLine className="h-8 w-8 mb-2 opacity-40" />
            <span className="text-sm">ارسم توقيعك هنا بالماوس أو الإصبع</span>
          </div>
        )}
        {/* خط أساس التوقيع */}
        <div className="pointer-events-none absolute bottom-6 right-8 left-8 border-b border-dashed border-muted-foreground/30" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasDrawn ? "✓ تم رسم التوقيع" : "التوقيع المرسوم إلزامي للحُجّية القانونية"}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={!hasDrawn}>
          <Eraser className="h-4 w-4 ml-1" /> مسح
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
