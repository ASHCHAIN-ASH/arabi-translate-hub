import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  wordCount: number;
  status: 'processing' | 'completed' | 'error';
  progress: number;
}

interface FileUploaderProps {
  onWordCountChange?: (totalWords: number) => void;
  onFileProcess?: (content: string, fileName: string) => void;
  isProcessing?: boolean;
  onProcessingChange?: (processing: boolean) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUploader = ({ 
  onWordCountChange, 
  onFileProcess,
  isProcessing: externalProcessing,
  onProcessingChange,
  maxFiles = 5,
  acceptedTypes = ['.doc', '.docx', '.pdf', '.txt']
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // استخدام الحالة الخارجية إذا توفرت
  const processing = externalProcessing !== undefined ? externalProcessing : isProcessing;

  const processFile = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        // حساب الكلمات - تحسين للغة العربية والإنجليزية
        const words = text
          .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0020-\u007E]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 0 && !/^\d+$/.test(word));
        
        setTimeout(() => resolve(words.length), 1000 + Math.random() * 1000);
      };
      
      reader.onerror = () => resolve(0);
      reader.readAsText(file);
    });
  };

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "تجاوز الحد المسموح",
        description: `يمكنك رفع ${maxFiles} ملفات كحد أقصى`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    const newFiles: FileInfo[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // التحقق من نوع الملف
      const isValidType = acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
      
      if (!isValidType) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: `الملف ${file.name} نوع غير مدعوم`,
          variant: "destructive"
        });
        continue;
      }

      const fileInfo: FileInfo = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        wordCount: 0,
        status: 'processing',
        progress: 0
      };

      newFiles.push(fileInfo);
    }

    setFiles(prev => [...prev, ...newFiles]);

    // معالجة الملفات
    for (const fileInfo of newFiles) {
      try {
        const file = Array.from(selectedFiles).find(f => f.name === fileInfo.name);
        if (!file) continue;

        // تحديث التقدم
        for (let progress = 0; progress <= 100; progress += 20) {
          setTimeout(() => {
            setFiles(prev => prev.map(f => 
              f.id === fileInfo.id 
                ? { ...f, progress }
                : f
            ));
          }, progress * 10);
        }

        const wordCount = await processFile(file);
        
        // استدعاء onFileProcess إذا توفرت
        if (onFileProcess && file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileProcess(content, file.name);
          };
          reader.readAsText(file);
        }
        
        setFiles(prev => prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, wordCount, status: 'completed', progress: 100 }
            : f
        ));

      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, status: 'error', progress: 100 }
            : f
        ));
        
        toast({
          title: "خطأ في معالجة الملف",
          description: `فشل في معالجة ${fileInfo.name}`,
          variant: "destructive"
        });
      }
    }

    setIsProcessing(false);
    if (onProcessingChange) {
      onProcessingChange(false);
    }
  }, [files.length, maxFiles, acceptedTypes, toast]);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  // حساب إجمالي الكلمات عند تغيير الملفات
  useEffect(() => {
    const totalWords = files.reduce((sum, file) => sum + file.wordCount, 0);
    if (onWordCountChange) {
      onWordCountChange(totalWords);
    }
  }, [files, onWordCountChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <File className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-6 w-6 text-blue-500" />;
      case 'txt': return <FileText className="h-6 w-6 text-gray-500" />;
      default: return <File className="h-6 w-6 text-gray-400" />;
    }
  };

  const totalWords = files.reduce((sum, file) => sum + file.wordCount, 0);

  return (
    <div className="space-y-6">
      {/* منطقة رفع الملفات */}
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const droppedFiles = e.dataTransfer.files;
          if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles);
          }
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = acceptedTypes.join(',');
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) handleFileSelect(files);
          };
          input.click();
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ 
            y: dragOver ? -5 : 0,
            scale: dragOver ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
          
          <h3 className="text-lg font-bold text-foreground mb-2">
            اسحب وأفلت ملفاتك هنا أو اضغط للاختيار
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            الأنواع المدعومة: {acceptedTypes.join(', ')} • حد أقصى {maxFiles} ملفات
          </p>
          
          {isProcessing && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-primary">جاري المعالجة...</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* عرض الملفات المرفوعة */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-foreground">
                    الملفات المرفوعة ({files.length})
                  </h4>
                  <div className="flex gap-3">
                    <Badge className="bg-gradient-primary text-primary-foreground shadow-primary px-4 py-2">
                      إجمالي: {totalWords.toLocaleString()} كلمة
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearAllFiles}
                      className="text-red-500 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      حذف الكل
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-4 p-4 bg-background rounded-xl shadow-soft"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.name)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground truncate text-sm">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {file.status === 'processing' && (
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            )}
                            {file.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {file.status === 'error' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-red-500 hover:bg-red-50 p-1 h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {file.status === 'processing' && (
                          <Progress value={file.progress} className="h-2 mb-2" />
                        )}
                        
                        {file.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            {file.wordCount.toLocaleString()} كلمة
                          </Badge>
                        )}
                        
                        {file.status === 'error' && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            خطأ في المعالجة
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;