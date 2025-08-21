import { Badge } from "@/components/ui/badge";

interface WordDetails {
  arabic: number;
  english: number;
  numbers: number;
  others: number;
  total: number;
}

interface WordCounterProps {
  wordDetails: WordDetails;
  isProcessing?: boolean;
}

const WordCounter = ({ wordDetails, isProcessing }: WordCounterProps) => {
  if (wordDetails.total === 0 && !isProcessing) return null;

  return (
    <div className="space-y-4">
      {/* إحصائيات مفصلة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">
            {isProcessing ? "..." : wordDetails.arabic.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-medium">كلمات عربية</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-accent">
            {isProcessing ? "..." : wordDetails.english.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-medium">كلمات إنجليزية</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-emerald-600">
            {isProcessing ? "..." : wordDetails.numbers.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-medium">أرقام</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold text-orange-600">
            {isProcessing ? "..." : wordDetails.others.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-medium">رموز أخرى</div>
        </div>
      </div>
      
      {/* الإجمالي */}
      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
        <div className="text-4xl font-bold text-primary mb-2">
          {isProcessing ? "جاري الحساب..." : wordDetails.total.toLocaleString()}
        </div>
        <div className="text-muted-foreground font-medium">إجمالي الكلمات</div>
        {wordDetails.total > 0 && (
          <Badge variant="secondary" className="mt-2">
            تم الحساب بدقة عالية
          </Badge>
        )}
      </div>
    </div>
  );
};

export default WordCounter;