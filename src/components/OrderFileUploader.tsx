import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface FileItem {
  file: File;
  id: string;
  uploadUrl?: string;
}

interface OrderFileUploaderProps {
  onFilesChange: (files: FileItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

const OrderFileUploader: React.FC<OrderFileUploaderProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError('');

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    // التحقق من عدد الملفات
    if (files.length + newFiles.length > maxFiles) {
      setError(`لا يمكن رفع أكثر من ${maxFiles} ملفات`);
      return;
    }

    // التحقق من حجم الملفات
    const oversizedFiles = newFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`حجم الملف يجب أن يكون أقل من ${maxFileSize} ميجابايت`);
      return;
    }

    setIsUploading(true);
    const newFileItems: FileItem[] = [];

    try {
      for (const file of newFiles) {
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileName = `${fileId}-${file.name}`;
        
        // رفع الملف إلى Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('order-attachments')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError('حدث خطأ أثناء رفع الملف');
          continue;
        }

        // الحصول على رابط الملف
        const { data: { publicUrl } } = supabase.storage
          .from('order-attachments')
          .getPublicUrl(fileName);

        newFileItems.push({
          file,
          id: fileId,
          uploadUrl: publicUrl
        });
      }

      const updatedFiles = [...files, ...newFileItems];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    } catch (error) {
      console.error('File upload error:', error);
      setError('حدث خطأ أثناء رفع الملفات');
    } finally {
      setIsUploading(false);
    }
  }, [files, maxFiles, maxFileSize, onFilesChange]);

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-colors duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <motion.div
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            اسحب وأفلت الملفات هنا
          </h3>
          <p className="text-muted-foreground mb-4">
            أو انقر لاختيار الملفات ({maxFiles} ملفات كحد أقصى، {maxFileSize} ميجابايت للملف الواحد)
          </p>
          
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleFileInput}
            accept="*/*"
            disabled={isUploading}
          />
          
          <Button 
            asChild
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
          >
            <label htmlFor="file-upload">
              {isUploading ? 'جاري الرفع...' : 'اختر الملفات'}
            </label>
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h4 className="font-semibold text-sm">الملفات المرفقة:</h4>
            {files.map((fileItem) => (
              <motion.div
                key={fileItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{fileItem.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(fileItem.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderFileUploader;