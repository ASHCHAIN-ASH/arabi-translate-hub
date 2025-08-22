// معالجات الملفات المختلفة
// @ts-ignore
import mammoth from "mammoth";
// @ts-ignore  
import * as XLSX from "xlsx";

export interface FileProcessingResult {
  content: string;
  metadata: {
    pages: number;
    fileSize: number;
    processingTime: number;
    needsOCR: boolean;
    processingMethod: string;
  };
  errors: string[];
}

export class FileProcessor {
  
  /**
   * معالجة ملفات النصوص العادية
   */
  async processTextFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    try {
      const content = await file.text();
      return {
        content,
        metadata: {
          pages: Math.ceil(content.length / 2000),
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'direct_text_read'
        },
        errors: []
      };
    } catch (error) {
      return {
        content: '',
        metadata: {
          pages: 0,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'failed'
        },
        errors: [error instanceof Error ? error.message : 'خطأ غير معروف']
      };
    }
  }

  /**
   * معالجة ملفات Word (DOCX/DOC)
   */
  async processWordFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      // استخراج النصوص من الجداول والعناوين أيضاً
      const fullResult = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = fullResult.value;
      
      // إزالة HTML tags واستخراج النص الكامل
      const fullText = htmlContent
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // دمج النصوص
      const combinedContent = result.value + '\n' + fullText;
      const uniqueContent = [...new Set(combinedContent.split(/\s+/))].join(' ');

      return {
        content: uniqueContent,
        metadata: {
          pages: Math.ceil(uniqueContent.length / 2000),
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'mammoth_extraction'
        },
        errors: result.messages.map(msg => msg.message)
      };
    } catch (error) {
      return {
        content: '',
        metadata: {
          pages: 0,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'failed'
        },
        errors: [error instanceof Error ? error.message : 'خطأ في معالجة ملف Word']
      };
    }
  }

  /**
   * معالجة ملفات Excel (XLSX/CSV)
   */
  async processExcelFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let allText = '';
      let totalCells = 0;

      workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        const worksheet = workbook.Sheets[sheetName];
        
        // تحويل إلى JSON للحصول على البيانات المنظمة
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          blankrows: false
        });

        // معالجة كل صف
        jsonData.forEach((row: any, rowIndex) => {
          if (Array.isArray(row)) {
            row.forEach((cell: any, colIndex) => {
              if (cell !== null && cell !== undefined && cell !== '') {
                const cellValue = String(cell).trim();
                if (cellValue.length > 0) {
                  allText += cellValue + ' ';
                  totalCells++;
                }
              }
            });
            allText += '\n';
          }
        });
        
        // إضافة فاصل بين الشيتات
        if (sheetIndex < workbook.SheetNames.length - 1) {
          allText += '\n\n--- ورقة جديدة ---\n\n';
        }
      });

      return {
        content: allText.trim(),
        metadata: {
          pages: workbook.SheetNames.length,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'xlsx_extraction'
        },
        errors: totalCells === 0 ? ['لم يتم العثور على بيانات نصية'] : []
      };
    } catch (error) {
      return {
        content: '',
        metadata: {
          pages: 0,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'failed'
        },
        errors: [error instanceof Error ? error.message : 'خطأ في معالجة ملف Excel']
      };
    }
  }

  /**
   * معالجة ملفات PDF
   */
  async processPDFFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    
    // PDF يحتاج معالجة خاصة - هذا مثال مبسط
    const estimatedPages = Math.ceil(file.size / 50000); // تقدير تقريبي
    
    return {
      content: `ملف PDF: ${file.name}
تم اكتشاف ملف PDF بحجم ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت.
عدد الصفحات المقدر: ${estimatedPages}

هذا الملف يحتاج معالجة OCR لاستخراج النصوص.
يمكنك تحويله إلى DOCX أو استخدام معالج OCR المدمج.

للحصول على تحليل دقيق، يُفضل تحويل الملف إلى DOCX باستخدام:
- Microsoft Word
- Google Docs  
- LibreOffice Writer

أو استخدام معالج OCR المتقدم المدمج في النظام.`,
      metadata: {
        pages: estimatedPages,
        fileSize: file.size,
        processingTime: Date.now() - startTime,
        needsOCR: true,
        processingMethod: 'pdf_detection'
      },
      errors: ['يحتاج معالجة OCR لاستخراج النصوص بدقة']
    };
  }

  /**
   * معالجة ملفات HTML
   */
  async processHTMLFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    try {
      const htmlContent = await file.text();
      
      // إزالة العلامات وتنظيف النص
      const cleanContent = htmlContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-zA-Z0-9#]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        content: cleanContent,
        metadata: {
          pages: Math.ceil(cleanContent.length / 2000),
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'html_cleaning'
        },
        errors: []
      };
    } catch (error) {
      return {
        content: '',
        metadata: {
          pages: 0,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'failed'
        },
        errors: [error instanceof Error ? error.message : 'خطأ في معالجة ملف HTML']
      };
    }
  }

  /**
   * معالجة ملفات JSON
   */
  async processJSONFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    try {
      const jsonContent = await file.text();
      const parsedJson = JSON.parse(jsonContent);
      
      // استخراج النصوص من كائن JSON
      const extractTextFromObject = (obj: any): string[] => {
        const texts: string[] = [];
        
        if (typeof obj === 'string') {
          texts.push(obj);
        } else if (Array.isArray(obj)) {
          obj.forEach(item => {
            texts.push(...extractTextFromObject(item));
          });
        } else if (typeof obj === 'object' && obj !== null) {
          Object.values(obj).forEach(value => {
            texts.push(...extractTextFromObject(value));
          });
        }
        
        return texts;
      };

      const extractedTexts = extractTextFromObject(parsedJson);
      const content = extractedTexts.join(' ').trim();

      return {
        content,
        metadata: {
          pages: 1,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'json_text_extraction'
        },
        errors: extractedTexts.length === 0 ? ['لم يتم العثور على نصوص قابلة للترجمة'] : []
      };
    } catch (error) {
      return {
        content: '',
        metadata: {
          pages: 0,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          needsOCR: false,
          processingMethod: 'failed'
        },
        errors: [error instanceof Error ? error.message : 'خطأ في معالجة ملف JSON']
      };
    }
  }

  /**
   * معالجة الملفات الصورية
   */
  async processImageFile(file: File): Promise<FileProcessingResult> {
    const startTime = Date.now();
    
    return {
      content: `صورة تحتاج معالجة OCR: ${file.name}
الحجم: ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت
النوع: ${file.type}

هذه صورة تحتاج معالجة OCR لاستخراج النصوص.
استخدم معالج OCR المدمج للحصول على النصوص.`,
      metadata: {
        pages: 1,
        fileSize: file.size,
        processingTime: Date.now() - startTime,
        needsOCR: true,
        processingMethod: 'image_detection'
      },
      errors: ['يحتاج معالجة OCR']
    };
  }

  /**
   * معالج رئيسي للملفات
   */
  async processFile(file: File): Promise<FileProcessingResult> {
    const extension = file.name.toLowerCase().split('.').pop() || '';
    
    switch (extension) {
      case 'txt':
      case 'md':
        return this.processTextFile(file);
        
      case 'docx':
      case 'doc':
        return this.processWordFile(file);
        
      case 'xlsx':
      case 'xls':
      case 'csv':
        return this.processExcelFile(file);
        
      case 'pdf':
        return this.processPDFFile(file);
        
      case 'html':
      case 'htm':
        return this.processHTMLFile(file);
        
      case 'json':
        return this.processJSONFile(file);
        
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bmp':
      case 'tiff':
      case 'webp':
        return this.processImageFile(file);
        
      default:
        return {
          content: '',
          metadata: {
            pages: 0,
            fileSize: file.size,
            processingTime: 0,
            needsOCR: false,
            processingMethod: 'unsupported'
          },
          errors: [`نوع الملف .${extension} غير مدعوم`]
        };
    }
  }
}

// إنشاء مثيل مفرد من معالج الملفات
export const fileProcessor = new FileProcessor();