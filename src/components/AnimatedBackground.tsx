import { useState, useEffect } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  icon: string;
  rotation: number;
  rotationSpeed: number;
}

const AnimatedBackground = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  // الرموز القانونية والملفات
  const icons = ['⚖️', '📋', '📄', '📑', '🏛️', '📋', '⚖️', '📜', '🔏', '📊'];

  useEffect(() => {
    // إنشاء العناصر المتحركة
    const initialElements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 30 + 20,
      speed: Math.random() * 0.5 + 0.2,
      icon: icons[Math.floor(Math.random() * icons.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2
    }));

    setElements(initialElements);

    // حركة العناصر
    const animateElements = () => {
      setElements(prev => prev.map(element => ({
        ...element,
        y: element.y <= -50 ? window.innerHeight + 50 : element.y - element.speed,
        rotation: element.rotation + element.rotationSpeed
      })));
    };

    const interval = setInterval(animateElements, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* الخلفية المتدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40" />
      
      {/* الشبكة الخفيفة */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* العناصر المتحركة */}
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute animate-float opacity-20 dark:opacity-10"
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            fontSize: `${element.size}px`,
            transform: `rotate(${element.rotation}deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          {element.icon}
        </div>
      ))}

      {/* تأثيرات الضوء */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default AnimatedBackground;