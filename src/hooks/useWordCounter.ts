import { useState, useCallback, useMemo } from "react";

interface WordDetails {
  arabic: number;
  english: number;
  numbers: number;
  others: number;
  total: number;
}

export const useWordCounter = () => {
  const [text, setText] = useState("");
  const [fileContent, setFileContent] = useState("");

  const countWordsDetailed = useCallback((content: string): WordDetails => {
    if (!content || content.trim().length === 0) {
      return { total: 0, arabic: 0, english: 0, numbers: 0, others: 0 };
    }
    
    // تنظيف المحتوى أولاً
    const cleanContent = content
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\u00C0-\u017F\u0100-\u024F]/g, ' ')
      .replace(/\s+/g, ' ');
    
    // تقسيم النص إلى كلمات
    const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
    
    let arabicWords = 0;
    let englishWords = 0;
    let numberWords = 0;
    let otherWords = 0;
    
    words.forEach(word => {
      // إزالة علامات الترقيم من بداية ونهاية الكلمة
      const cleanWord = word.replace(/^[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\u00C0-\u017F\u0100-\u024F]*/, '')
                           .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\u00C0-\u017F\u0100-\u024F]*$/, '');
      
      if (cleanWord.length === 0) return;
      
      // تحديد نوع الكلمة بناءً على الحرف الأول
      if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(cleanWord)) {
        arabicWords++;
      } else if (/[a-zA-Z\u00C0-\u017F\u0100-\u024F]/.test(cleanWord)) {
        englishWords++;
      } else if (/^\d+$/.test(cleanWord)) {
        numberWords++;
      } else {
        otherWords++;
      }
    });
    
    const total = arabicWords + englishWords + numberWords + otherWords;
    
    return {
      total,
      arabic: arabicWords,
      english: englishWords,
      numbers: numberWords,
      others: otherWords
    };
  }, []);

  const wordDetails = useMemo(() => {
    const content = fileContent || text;
    return countWordsDetailed(content);
  }, [text, fileContent, countWordsDetailed]);

  const handleTextChange = useCallback((value: string) => {
    setText(value);
    setFileContent(""); // مسح محتوى الملف عند الكتابة
  }, []);

  const handleFileContent = useCallback((content: string, fileName: string) => {
    setFileContent(content);
    setText(""); // مسح النص المكتوب عند رفع ملف
  }, []);

  const clearAll = useCallback(() => {
    setText("");
    setFileContent("");
  }, []);

  return {
    text,
    fileContent,
    wordDetails,
    handleTextChange,
    handleFileContent,
    clearAll
  };
};