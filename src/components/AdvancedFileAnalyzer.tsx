import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  FileText, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Building,
  Stethoscope,
  Cpu
} from "lucide-react";

interface FileAnalysis {
  wordCount: number;
  documentType: 'legal' | 'medical' | 'technical' | 'business' | 'academic' | 'general';
  complexity: 'low' | 'medium' | 'high' | 'expert';
  specialTerms: number;
  formatComplexity: number;
  fileName: string;
  language: string;
  readabilityScore: number;
  technicalDensity: number;
  processingTime: number;
}

interface AdvancedFileAnalyzerProps {
  files: File[];
  onAnalysisComplete: (analyses: FileAnalysis[]) => void;
  isProcessing: boolean;
}

const AdvancedFileAnalyzer = ({ 
  files, 
  onAnalysisComplete, 
  isProcessing 
}: AdvancedFileAnalyzerProps) => {
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [progress, setProgress] = useState(0);

  // قواميس المصطلحات المتخصصة
  const specialTermDictionaries = {
    legal: [
      'محكمة', 'قاضي', 'حكم', 'عقد', 'اتفاقية', 'دعوى', 'مدعي', 'مدعى عليه',
      'برهان', 'دليل', 'شاهد', 'قانون', 'مادة', 'فقرة', 'نص', 'تفسير',
      'court', 'judge', 'verdict', 'contract', 'agreement', 'lawsuit', 'plaintiff',
      'defendant', 'evidence', 'witness', 'law', 'article', 'clause'
    ],
    medical: [
      'مريض', 'طبيب', 'علاج', 'دواء', 'جراحة', 'تشخيص', 'أعراض', 'مرض',
      'patient', 'doctor', 'treatment', 'medicine', 'surgery', 'diagnosis', 
      'symptoms', 'disease', 'therapy', 'prescription'
    ],
    technical: [
      'نظام', 'برنامج', 'تطبيق', 'خوارزمية', 'قاعدة بيانات', 'شبكة', 'خادم',
      'system', 'software', 'application', 'algorithm', 'database', 'network',
      'server', 'API', 'interface', 'protocol'
    ],
    business: [
      'شركة', 'مؤسسة', 'إدارة', 'مبيعات', 'تسويق', 'أرباح', 'خسائر', 'ميزانية',
      'company', 'corporation', 'management', 'sales', 'marketing', 'profit',
      'loss', 'budget', 'revenue', 'investment'
    ],
    academic: [
      'بحث', 'دراسة', 'نظرية', 'منهجية', 'تحليل', 'نتائج', 'خلاصة', 'مراجع',
      'research', 'study', 'theory', 'methodology', 'analysis', 'results',
      'conclusion', 'references', 'hypothesis', 'experiment'
    ]
  };

  // تحليل نوع الوثيقة
  const analyzeDocumentType = (content: string): 'legal' | 'medical' | 'technical' | 'business' | 'academic' | 'general' => {
    const scores = {
      legal: 0,
      medical: 0,
      technical: 0,
      business: 0,
      academic: 0,
      general: 0
    };

    const lowerContent = content.toLowerCase();

    // حساب نقاط كل نوع
    Object.entries(specialTermDictionaries).forEach(([type, terms]) => {
      terms.forEach(term => {
        const count = (lowerContent.match(new RegExp(term.toLowerCase(), 'g')) || []).length;
        scores[type as keyof typeof scores] += count;
      });
    });

    // إيجاد النوع بأعلى نقاط
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'general';

    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as keyof typeof scores || 'general';
  };

  // تحليل التعقيد
  const analyzeComplexity = (content: string, documentType: string): 'low' | 'medium' | 'high' | 'expert' => {
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const longSentences = content.split(/[.!?]/).filter(sentence => sentence.split(/\s+/).length > 20).length;
    const specialTermCount = countSpecialTerms(content, documentType);
    
    const complexityScore = 
      (avgWordLength > 7 ? 1 : 0) +
      (longSentences > words.length * 0.1 ? 1 : 0) +
      (specialTermCount > words.length * 0.05 ? 2 : specialTermCount > words.length * 0.02 ? 1 : 0);

    if (complexityScore >= 4) return 'expert';
    if (complexityScore >= 3) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  };

  // عد المصطلحات المتخصصة
  const countSpecialTerms = (content: string, documentType: string): number => {
    const terms = specialTermDictionaries[documentType as keyof typeof specialTermDictionaries] || [];
    const lowerContent = content.toLowerCase();
    
    return terms.reduce((count, term) => {
      const matches = lowerContent.match(new RegExp(term.toLowerCase(), 'g'));
      return count + (matches ? matches.length : 0);
    }, 0);
  };

  // حساب نقاط القابلية للقراءة
  const calculateReadabilityScore = (content: string): number => {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => count + Math.max(1, word.match(/[aeiouAEIOU]/g)?.length || 1), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // معادلة مبسطة لحساب القابلية للقراءة
    const score = 206.835 - (1.015 * words.length / sentences.length) - (84.6 * syllables / words.length);
    return Math.max(0, Math.min(100, score));
  };

  // حساب الكثافة التقنية
  const calculateTechnicalDensity = (content: string): number => {
    const technicalPatterns = [
      /\b\d+(\.\d+)?\s*%/g, // نسب مئوية
      /\$\d+(\.\d+)?/g,     // مبالغ مالية
      /\b\d{4}\b/g,         // سنوات
      /\b[A-Z]{2,}\b/g,     // اختصارات
      /\b\w+\([^)]*\)/g,    // دوال أو مراجع
    ];

    const words = content.split(/\s+/).length;
    const technicalMatches = technicalPatterns.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length;
    }, 0);

    return Math.min(100, (technicalMatches / words) * 100);
  };

  // كشف اللغة
  const detectLanguage = (content: string): string => {
    const arabicChars = (content.match(/[\u0600-\u06FF]/g) || []).length;
    const totalChars = content.replace(/\s/g, '').length;
    
    return arabicChars / totalChars > 0.3 ? 'Arabic' : 'English';
  };

  // تحليل ملف واحد
  const analyzeFile = async (file: File, index: number): Promise<FileAnalysis> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCurrentFile(file.name);
        
        // محاكاة وقت المعالجة
        setTimeout(() => {
          const words = content.split(/\s+/).filter(w => w.length > 0);
          const wordCount = words.length;
          const documentType = analyzeDocumentType(content);
          const complexity = analyzeComplexity(content, documentType);
          const specialTerms = countSpecialTerms(content, documentType);
          const readabilityScore = calculateReadabilityScore(content);
          const technicalDensity = calculateTechnicalDensity(content);
          const language = detectLanguage(content);

          const analysis: FileAnalysis = {
            wordCount,
            documentType,
            complexity,
            specialTerms,
            formatComplexity: Math.random() * 100, // محاكاة
            fileName: file.name,
            language,
            readabilityScore,
            technicalDensity,
            processingTime: Date.now()
          };

          setProgress(((index + 1) / files.length) * 100);
          resolve(analysis);
        }, 1000 + Math.random() * 2000);
      };

      reader.readAsText(file);
    });
  };

  // تحليل جميع الملفات
  const analyzeAllFiles = useCallback(async () => {
    if (files.length === 0) return;

    const newAnalyses: FileAnalysis[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const analysis = await analyzeFile(files[i], i);
      newAnalyses.push(analysis);
      setAnalyses(prev => [...prev, analysis]);
    }

    onAnalysisComplete(newAnalyses);
    setCurrentFile("");
    setProgress(100);
  }, [files, onAnalysisComplete]);

  // بدء التحليل عند تغيير الملفات
  useEffect(() => {
    if (files.length > 0 && isProcessing) {
      analyzeAllFiles();
    }
  }, [files, isProcessing, analyzeAllFiles]);

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'legal': return Building;
      case 'medical': return Stethoscope;
      case 'technical': return Cpu;
      case 'business': return TrendingUp;
      case 'academic': return BookOpen;
      default: return FileText;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isProcessing && analyses.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* حالة المعالجة */}
      {isProcessing && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-8 w-8 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-foreground">محرك التحليل الذكي</h3>
                <p className="text-sm text-muted-foreground">
                  {currentFile ? `تحليل: ${currentFile}` : 'جهز للتحليل...'}
                </p>
              </div>
            </div>
            
            <Progress value={progress} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>التقدم: {Math.round(progress)}%</span>
              <span>{analyses.length} من {files.length} ملف</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* نتائج التحليل */}
      {analyses.length > 0 && (
        <Card className="bg-background border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              نتائج التحليل الذكي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyses.map((analysis, index) => {
                const IconComponent = getDocumentTypeIcon(analysis.documentType);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{analysis.fileName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.wordCount.toLocaleString()} كلمة • {analysis.language}
                          </p>
                        </div>
                      </div>
                      
                      <Badge className={getComplexityColor(analysis.complexity)}>
                        {analysis.complexity}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{analysis.documentType}</div>
                        <div className="text-xs text-muted-foreground">نوع الوثيقة</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{analysis.specialTerms}</div>
                        <div className="text-xs text-muted-foreground">مصطلحات متخصصة</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{Math.round(analysis.readabilityScore)}</div>
                        <div className="text-xs text-muted-foreground">قابلية القراءة</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{Math.round(analysis.technicalDensity)}%</div>
                        <div className="text-xs text-muted-foreground">الكثافة التقنية</div>
                      </div>
                    </div>

                    {analysis.readabilityScore < 30 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-xs text-orange-700">
                          نص معقد - قد يتطلب وقت إضافي للترجمة
                        </span>
                      </motion.div>
                    )}

                    {analysis.specialTerms > 10 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-700">
                          محتوى متخصص - سيتم تخصيص مترجم خبير
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AdvancedFileAnalyzer;