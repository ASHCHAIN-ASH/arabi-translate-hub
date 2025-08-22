// محرك تحليل النصوص المتقدم للترجمة
export interface TextAnalysisResult {
  totalWords: number;
  sourceWords: number;
  tableWords: number;
  numbersOnly: number;
  excluded: number;
  placeholders: number;
  duplicatesIntra: number;
  uniqueWords: number;
  detectedLanguage: string;
  wordFrequency: Map<string, number>;
  billableWords: number;
}

export class AdvancedTextAnalyzer {
  private arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  private englishPattern = /[a-zA-Z]/;
  private frenchPattern = /[àâäéèêëïîôùûüÿç]/i;
  private spanishPattern = /[ñáéíóúü]/i;
  private germanPattern = /[äöüß]/i;
  
  // أنماط الاستبعاد
  private excludePatterns = {
    placeholder: /^[\{\[%].*[\}\]%]$|%[a-zA-Z_]+%|\{[a-zA-Z_]+\}/,
    number: /^\d+([.,]\d+)*$|^\d+[٠-٩]+$|^[٠-٩]+$/,
    code: /^(https?:\/\/|www\.|[A-Z0-9]{3,}-[A-Z0-9]{3,}|#[a-zA-Z0-9_]+)/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    specialChars: /^[^\u0600-\u06FFa-zA-Z0-9\s]+$/,
    shortWord: /^.{1}$/
  };

  /**
   * كشف لغة النص
   */
  detectLanguage(text: string): string {
    if (!text || text.trim().length === 0) return "غير محدد";
    
    const sample = text.substring(0, 2000);
    const arabicMatches = (sample.match(this.arabicPattern) || []).length;
    const englishMatches = (sample.match(this.englishPattern) || []).length;
    const frenchMatches = (sample.match(this.frenchPattern) || []).length;
    const spanishMatches = (sample.match(this.spanishPattern) || []).length;
    const germanMatches = (sample.match(this.germanPattern) || []).length;
    
    const total = sample.length;
    const arabicRatio = arabicMatches / total;
    const englishRatio = englishMatches / total;
    
    if (arabicRatio > 0.1) return "العربية";
    if (frenchMatches > englishMatches * 0.1) return "الفرنسية";
    if (spanishMatches > englishMatches * 0.1) return "الإسبانية";
    if (germanMatches > englishMatches * 0.1) return "الألمانية";
    if (englishRatio > 0.05) return "الإنجليزية";
    
    return "مختلطة";
  }

  /**
   * تنظيف النص وتحضيره للتحليل
   */
  private cleanText(text: string): string {
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/[""'']/g, '"')
      .replace(/[–—]/g, '-')
      .trim();
  }

  /**
   * استخراج الكلمات من النص
   */
  private extractWords(text: string): string[] {
    const cleanedText = this.cleanText(text);
    
    // فصل الكلمات بناءً على المسافات والعلامات
    const words = cleanedText
      .split(/[\s\n\r\t,.;:!?()[\]{}"'«»„""''‚''…]+/)
      .filter(word => word.length > 0)
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    return words;
  }

  /**
   * تصنيف الكلمة
   */
  private classifyWord(word: string): {
    type: 'source' | 'table' | 'number' | 'placeholder' | 'excluded';
    isValid: boolean;
  } {
    // إزالة الرموز الجانبية
    const cleanWord = word.replace(/^[^\u0600-\u06FFa-zA-Z0-9]+|[^\u0600-\u06FFa-zA-Z0-9]+$/g, '');
    
    if (this.excludePatterns.placeholder.test(cleanWord)) {
      return { type: 'placeholder', isValid: false };
    }
    
    if (this.excludePatterns.number.test(cleanWord)) {
      return { type: 'number', isValid: false };
    }
    
    if (this.excludePatterns.code.test(cleanWord) || 
        this.excludePatterns.email.test(cleanWord) ||
        this.excludePatterns.specialChars.test(cleanWord) ||
        this.excludePatterns.shortWord.test(cleanWord)) {
      return { type: 'excluded', isValid: false };
    }
    
    // إذا كانت الكلمة تحتوي على أحرف صالحة للترجمة
    if (this.arabicPattern.test(cleanWord) || this.englishPattern.test(cleanWord)) {
      return { type: 'source', isValid: true };
    }
    
    return { type: 'excluded', isValid: false };
  }

  /**
   * كشف الجداول في النص
   */
  private detectTables(text: string): boolean {
    const tableIndicators = [
      /\t.*\t/, // علامات تبويب متعددة
      /\|.*\|.*\|/, // خطوط عمودية متعددة
      /^\s*[\|\+\-]{3,}/, // خطوط الجداول
      /^\s*\d+\.\s+.*\s+\d+/, // قوائم مرقمة مع أرقام
    ];
    
    return tableIndicators.some(pattern => pattern.test(text));
  }

  /**
   * تحليل النص الرئيسي
   */
  analyzeText(text: string): TextAnalysisResult {
    if (!text || text.trim().length === 0) {
      return {
        totalWords: 0,
        sourceWords: 0,
        tableWords: 0,
        numbersOnly: 0,
        excluded: 0,
        placeholders: 0,
        duplicatesIntra: 0,
        uniqueWords: 0,
        detectedLanguage: "غير محدد",
        wordFrequency: new Map(),
        billableWords: 0
      };
    }

    const detectedLanguage = this.detectLanguage(text);
    const words = this.extractWords(text);
    const hasTabularData = this.detectTables(text);
    
    let sourceWords = 0;
    let tableWords = 0;
    let numbersOnly = 0;
    let excluded = 0;
    let placeholders = 0;
    
    const wordFrequency = new Map<string, number>();
    const uniqueWords = new Set<string>();
    let duplicatesIntra = 0;

    // تحليل كل كلمة
    words.forEach((word, index) => {
      const classification = this.classifyWord(word);
      
      switch (classification.type) {
        case 'placeholder':
          placeholders++;
          break;
          
        case 'number':
          numbersOnly++;
          break;
          
        case 'excluded':
          excluded++;
          break;
          
        case 'source':
          const normalizedWord = word.toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, '');
          
          if (normalizedWord.length < 2) {
            excluded++;
            break;
          }
          
          // تحديد إذا كانت في جدول
          if (hasTabularData) {
            const wordPosition = text.indexOf(word);
            const context = text.substring(
              Math.max(0, wordPosition - 50),
              Math.min(text.length, wordPosition + word.length + 50)
            );
            
            if (this.detectTables(context)) {
              tableWords++;
            } else {
              sourceWords++;
            }
          } else {
            sourceWords++;
          }
          
          // إضافة للكلمات الفريدة والتكرارات
          if (uniqueWords.has(normalizedWord)) {
            duplicatesIntra++;
          } else {
            uniqueWords.add(normalizedWord);
          }
          
          // إحصائيات التكرار
          const currentCount = wordFrequency.get(normalizedWord) || 0;
          wordFrequency.set(normalizedWord, currentCount + 1);
          
          break;
      }
    });

    const totalWords = words.length;
    const billableWords = sourceWords + tableWords;
    const uniqueWordsCount = uniqueWords.size;

    return {
      totalWords,
      sourceWords,
      tableWords,
      numbersOnly,
      excluded,
      placeholders,
      duplicatesIntra,
      uniqueWords: uniqueWordsCount,
      detectedLanguage,
      wordFrequency,
      billableWords
    };
  }

  /**
   * تحليل متقدم للملفات المتعددة
   */
  analyzeMultipleTexts(texts: { fileName: string; content: string }[]): {
    individual: (TextAnalysisResult & { fileName: string })[];
    combined: TextAnalysisResult & { interFileDuplicates: number };
  } {
    const individual = texts.map(({ fileName, content }) => ({
      fileName,
      ...this.analyzeText(content)
    }));

    // حساب التكرارات بين الملفات
    const allWords = new Set<string>();
    const interFileWordMap = new Map<string, string[]>();
    let interFileDuplicates = 0;

    individual.forEach(analysis => {
      analysis.wordFrequency.forEach((count, word) => {
        if (allWords.has(word)) {
          // كلمة مكررة بين الملفات
          if (!interFileWordMap.has(word)) {
            interFileWordMap.set(word, []);
          }
          interFileWordMap.get(word)!.push(analysis.fileName);
          interFileDuplicates += count;
        } else {
          allWords.add(word);
        }
      });
    });

    // دمج النتائج
    const combined = individual.reduce((acc, current) => ({
      totalWords: acc.totalWords + current.totalWords,
      sourceWords: acc.sourceWords + current.sourceWords,
      tableWords: acc.tableWords + current.tableWords,
      numbersOnly: acc.numbersOnly + current.numbersOnly,
      excluded: acc.excluded + current.excluded,
      placeholders: acc.placeholders + current.placeholders,
      duplicatesIntra: acc.duplicatesIntra + current.duplicatesIntra,
      uniqueWords: allWords.size,
      detectedLanguage: "مختلطة",
      wordFrequency: new Map([...acc.wordFrequency, ...current.wordFrequency]),
      billableWords: acc.billableWords + current.billableWords,
      interFileDuplicates
    }), {
      totalWords: 0,
      sourceWords: 0,
      tableWords: 0,
      numbersOnly: 0,
      excluded: 0,
      placeholders: 0,
      duplicatesIntra: 0,
      uniqueWords: 0,
      detectedLanguage: "مختلطة",
      wordFrequency: new Map<string, number>(),
      billableWords: 0,
      interFileDuplicates: 0
    });

    return { individual, combined };
  }
}

// إنشاء مثيل مفرد من المحلل
export const textAnalyzer = new AdvancedTextAnalyzer();