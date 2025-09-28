import React, { useEffect } from 'react';

interface ContentProtectionProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    Firebug?: any;
  }
}

const ContentProtection: React.FC<ContentProtectionProps> = ({ children }) => {
  useEffect(() => {
    // منع النقر بالزر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع اختصارات لوحة المفاتيح
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع Ctrl+A (تحديد الكل)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+C (نسخ)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+V (لصق)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+X (قص)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+S (حفظ)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+P (طباعة)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // منع F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // منع السحب والإفلات
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // منع التحديد
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // منع النسخ من خلال الماوس
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // إضافة المستمعين
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);

    // حماية إضافية ضد فتح Developer Tools
    const devToolsChecker = setInterval(() => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      
      // إذا كان الفرق أكبر من 100ms، فمن المحتمل أن Developer Tools مفتوحة
      if (end - start > 100) {
        // إعادة توجيه أو إخفاء المحتوى
        document.body.style.display = 'none';
        alert('تم اكتشاف محاولة فتح أدوات المطور. الموقع محمي ضد النسخ.');
        window.location.reload();
      }
    }, 1000);

    // منع الطباعة
    const preventPrint = (e: Event) => {
      e.preventDefault();
      alert('الطباعة غير مسموحة لحماية المحتوى');
      return false;
    };
    
    window.addEventListener('beforeprint', preventPrint);

    // تنظيف المستمعين عند إلغاء التركيب
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsChecker);
      window.removeEventListener('beforeprint', preventPrint);
    };
  }, []);

  // حماية الصور
  const protectImages = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.pointerEvents = 'none';
      img.draggable = false;
      img.oncontextmenu = () => false;
      img.onselectstart = () => false;
      img.ondragstart = () => false;
    });
  };

  useEffect(() => {
    // تطبيق حماية الصور عند تحميل المكون
    const timer = setTimeout(protectImages, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="content-protection-wrapper protected-content"
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onDragStart={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      
      {/* طبقة حماية إضافية شفافة */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999999,
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default ContentProtection;