import React, { useState, useEffect } from 'react';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BackgroundRemovalToolProps {
  imageUrl: string;
  onProcessed: (processedImageUrl: string) => void;
}

const BackgroundRemovalTool: React.FC<BackgroundRemovalToolProps> = ({ imageUrl, onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const processImage = async () => {
    setIsProcessing(true);
    toast.info('جاري معالجة الصورة وحذف الخلفية...');

    try {
      // Load the image
      const imageElement = await loadImageFromUrl(imageUrl);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      onProcessed(processedUrl);
      
      toast.success('تم حذف الخلفية بنجاح!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('حدث خطأ أثناء معالجة الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Auto-process the image when component mounts
    processImage();
  }, [imageUrl]);

  return (
    <div className="hidden">
      {/* This component works in the background */}
      {isProcessing && (
        <div className="text-sm text-muted-foreground">
          جاري معالجة صورة اليوم الوطني...
        </div>
      )}
    </div>
  );
};

export default BackgroundRemovalTool;