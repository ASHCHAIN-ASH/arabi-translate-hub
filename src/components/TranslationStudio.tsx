import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Languages,
  Calculator,
  Zap,
  Eye,
  Download,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TranslationExtrasForm from "./TranslationExtrasForm";

interface FileAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  wordCount: number;
  characterCount: number;
  detectedLanguage: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedPrice: number;
  processingTime: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProjectStats {
  totalFiles: number;
  totalWords: number;
  totalCharacters: number;
  estimatedCost: number;
  estimatedTime: number;
  languages: string[];
}

const TranslationStudio = () => {
  const [files, setFiles] = useState<FileAnalysis[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    totalFiles: 0,
    totalWords: 0,
    totalCharacters: 0,
    estimatedCost: 0,
    estimatedTime: 0,
    languages: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // محاكاة تحليل الملفات
  const analyzeFile = useCallback(async (file: File): Promise<FileAnalysis> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const supportedTypes = ['pdf', 'docx', 'txt', 'pptx', 'xlsx'];
    
    // محاكاة عملية المعالجة
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const wordCount = Math.floor(100 + Math.random() * 5000);
    const characterCount = wordCount * 6;
    const languages = ['العربية', 'الإنجليزية', 'الفرنسية', 'الألمانية', 'الإسبانية'];
    const detectedLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    const complexityLevels = ['simple', 'medium', 'complex'] as const;
    const complexity = complexityLevels[Math.floor(Math.random() * 3)];
    
    const basePrice = wordCount * 0.15;
    const complexityMultiplier = complexity === 'simple' ? 1 : complexity === 'medium' ? 1.3 : 1.6;
    const estimatedPrice = basePrice * complexityMultiplier;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      fileType: fileExtension.toUpperCase(),
      fileSize: file.size,
      wordCount,
      characterCount,
      detectedLanguage,
      complexity,
      estimatedPrice,
      processingTime: Math.floor(1 + Math.random() * 5),
      status: supportedTypes.includes(fileExtension) ? 'completed' : 'error'
    };
  }, []);

  // معالجة رفع الملفات
  const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    setIsProcessing(true);
    setCurrentStep(2);

    const pendingFiles = fileArray.map(file => ({
      id: Math.random().toString(),
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      fileSize: file.size,
      wordCount: 0,
      characterCount: 0,
      detectedLanguage: 'معالجة...',
      complexity: 'simple' as const,
      estimatedPrice: 0,
      processingTime: 0,
      status: 'processing' as const
    }));

    setFiles(pendingFiles);

    // معالجة الملفات تدريجياً
    const completedFiles: FileAnalysis[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const result = await analyzeFile(fileArray[i]);
      completedFiles.push(result);
      
      setFiles(prev => prev.map((file, index) => 
        index === i ? result : file
      ));

      // تحديث الإحصائيات
      const stats = calculateProjectStats([...completedFiles]);
      setProjectStats(stats);
    }

    setIsProcessing(false);
    setCurrentStep(3);
  }, [analyzeFile]);

  // حساب إحصائيات المشروع
  const calculateProjectStats = useCallback((fileList: FileAnalysis[]): ProjectStats => {
    const validFiles = fileList.filter(f => f.status === 'completed');
    
    return {
      totalFiles: validFiles.length,
      totalWords: validFiles.reduce((sum, f) => sum + f.wordCount, 0),
      totalCharacters: validFiles.reduce((sum, f) => sum + f.characterCount, 0),
      estimatedCost: validFiles.reduce((sum, f) => sum + f.estimatedPrice, 0),
      estimatedTime: Math.max(...validFiles.map(f => f.processingTime), 0),
      languages: [...new Set(validFiles.map(f => f.detectedLanguage))]
    };
  }, []);

  // التعامل مع السحب والإفلات
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // حذف ملف
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      const stats = calculateProjectStats(newFiles);
      setProjectStats(stats);
      return newFiles;
    });
  }, [calculateProjectStats]);

  // إعادة تعيين
  const resetStudio = useCallback(() => {
    setFiles([]);
    setProjectStats({
      totalFiles: 0,
      totalWords: 0,
      totalCharacters: 0,
      estimatedCost: 0,
      estimatedTime: 0,
      languages: []
    });
    setCurrentStep(1);
  }, []);

  return (
    <div className="space-y-8">
      {/* شريط التقدم */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              <span className={`mr-3 text-sm font-medium transition-colors ${
                currentStep >= step ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step === 1 && 'رفع الملفات'}
                {step === 2 && 'التحليل'}
                {step === 3 && 'النتائج'}
              </span>
              {step < 3 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* منطقة رفع الملفات */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <CardContent className="p-8">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    dragOver
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.doc,.txt,.pptx,.xlsx"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <motion.div
                    animate={{ 
                      y: dragOver ? -10 : 0,
                      scale: dragOver ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">اسحب وأفلت ملفاتك هنا</h3>
                  <p className="text-muted-foreground mb-6">
                    أو اضغط لاختيار الملفات من جهازك
                  </p>
                  
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative overflow-hidden group"
                  >
                    <span className="relative z-10">اختيار الملفات</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {['PDF', 'DOCX', 'PPTX', 'XLSX', 'TXT'].map((type) => (
                      <Badge key={type} variant="secondary" className="animate-pulse">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مرحلة المعالجة */}
      <AnimatePresence mode="wait">
        {currentStep === 2 && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-5 w-5 text-primary" />
                  </motion.div>
                  جاري تحليل الملفات...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        <div className="text-sm text-muted-foreground">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.status === 'processing' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="h-4 w-4 text-orange-500" />
                        </motion.div>
                      )}
                      {file.status === 'completed' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                      {file.status === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* النتائج والإحصائيات */}
      <AnimatePresence mode="wait">
        {currentStep === 3 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* إحصائيات المشروع */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: FileText,
                  label: 'إجمالي الملفات',
                  value: projectStats.totalFiles,
                  color: 'text-blue-500',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: Languages,
                  label: 'إجمالي الكلمات',
                  value: projectStats.totalWords.toLocaleString(),
                  color: 'text-green-500',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: Calculator,
                  label: 'التكلفة المقدرة',
                  value: `${projectStats.estimatedCost.toFixed(2)} ر.س`,
                  color: 'text-orange-500',
                  bgColor: 'bg-orange-50'
                },
                {
                  icon: Clock,
                  label: 'وقت التسليم',
                  value: `${projectStats.estimatedTime} أيام`,
                  color: 'text-purple-500',
                  bgColor: 'bg-purple-50'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <Card className="overflow-hidden relative group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* تفاصيل الملفات */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  تفاصيل الملفات المحللة
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetStudio}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  بدء جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.filter(f => f.status === 'completed').map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10 group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{file.fileName}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{file.detectedLanguage}</span>
                            <Badge 
                              variant="secondary" 
                              className={
                                file.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                                file.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {file.complexity === 'simple' ? 'بسيط' : 
                               file.complexity === 'medium' ? 'متوسط' : 'معقد'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <div className="font-bold text-lg text-primary">
                          {file.estimatedPrice.toFixed(2)} ر.س
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {file.wordCount.toLocaleString()} كلمة
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* الخدمات الإضافية */}
            <TranslationExtrasForm onExtrasChange={() => {}} />

            {/* أزرار العمل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  بدء المشروع
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
              
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                تحميل التقرير
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslationStudio;