// حماية متقدمة ضد أدوات المطور والنسخ

declare global {
  interface Window {
    Firebug?: any;
  }
}

export const initAntiDevTools = () => {
  // إخفاء شارة Lovable
  const hideLovableBadge = () => {
    const selectors = [
      'div[data-testid="lovable-badge"]',
      'a[href*="lovable.dev"]',
      '.lovable-badge',
      '[class*="lovable"]',
      'iframe[src*="lovable"]',
      '[data-lovable]',
      '.edit-button',
      '.edit-in-lovable',
      'button[class*="edit"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        (element as HTMLElement).style.display = 'none !important';
        (element as HTMLElement).style.visibility = 'hidden !important';
        (element as HTMLElement).style.opacity = '0 !important';
        (element as HTMLElement).style.position = 'absolute !important';
        (element as HTMLElement).style.left = '-9999px !important';
        (element as HTMLElement).style.top = '-9999px !important';
        (element as HTMLElement).style.width = '0 !important';
        (element as HTMLElement).style.height = '0 !important';
        (element as HTMLElement).remove();
      });
    });
  };

  // منع النقر بالزر الأيمن
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // منع اختصارات لوحة المفاتيح للنسخ والمطورين
  document.addEventListener('keydown', (e) => {
    // منع F12
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
  });

  // منع السحب والإفلات
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // منع التحديد
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // إخفاء شارة Lovable بشكل دوري
  setInterval(hideLovableBadge, 100);
  hideLovableBadge();

  // مراقب للتغييرات لإخفاء أي شارات جديدة
  const badgeObserver = new MutationObserver(() => {
    hideLovableBadge();
  });

  badgeObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
};

// تهيئة جميع وسائل الحماية عند تحميل الصفحة
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAntiDevTools);
  } else {
    initAntiDevTools();
  }
}