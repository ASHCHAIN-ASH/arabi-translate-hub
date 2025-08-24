import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTheme = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTheme = (pathname: string) => {
      // إزالة جميع الفئات السابقة
      document.body.classList.remove(
        'page-home', 'page-legal', 'page-business', 'page-technical',
        'page-medical', 'page-academic', 'page-instant', 'page-media',
        'page-literary', 'page-research', 'page-about'
      );

      // تحديد الثيم بناءً على المسار
      if (pathname === '/') {
        return 'page-home';
      } else if (pathname.includes('legal')) {
        return 'page-legal';
      } else if (pathname.includes('business')) {
        return 'page-business';
      } else if (pathname.includes('technical')) {
        return 'page-technical';
      } else if (pathname.includes('medical')) {
        return 'page-medical';
      } else if (pathname.includes('academic')) {
        return 'page-academic';
      } else if (pathname.includes('instant')) {
        return 'page-instant';
      } else if (pathname.includes('media')) {
        return 'page-media';
      } else if (pathname.includes('literary')) {
        return 'page-literary';
      } else if (pathname.includes('research')) {
        return 'page-research';
      } else if (pathname.includes('about')) {
        return 'page-about';
      } else {
        return 'page-home'; // افتراضي
      }
    };

    const theme = getPageTheme(location.pathname);
    document.body.classList.add(theme);

    // تنظيف عند إلغاء التحميل
    return () => {
      document.body.classList.remove(
        'page-home', 'page-legal', 'page-business', 'page-technical',
        'page-medical', 'page-academic', 'page-instant', 'page-media',
        'page-literary', 'page-research', 'page-about'
      );
    };
  }, [location.pathname]);
};

export default usePageTheme;