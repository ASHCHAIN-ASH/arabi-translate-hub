import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calculator, 
  Copy, 
  Table, 
  Hash, 
  Eye, 
  AlertCircle,
  TrendingUp,
  Layers,
  Filter
} from "lucide-react";

interface FileAnalysis {
  fileName: string;
  fileType: string;
  pages: number;
  sourceWords: number;
  tableWords: number;
  numbersOnly: number;
  excluded: number;
  placeholders: number;
  ocrNeeded: boolean;
  duplicatesIntra: number;
  duplicatesInter: number;
  uniqueWords: number;
  notes: string[];
}

interface AdvancedWordDetails {
  totalWords: number;
  billableWords: number;
  files: FileAnalysis[];
  duplicates: {
    intraFile: number;
    interFile: number;
    totalUnique: number;
  };
  exclusions: {
    headers: number;
    footers: number;
    pureNumbers: number;
    codes: number;
    links: number;
    placeholders: number;
  };
  pricing: {
    baseRate: number;
    duplicateDiscount: {
      intra: number;
      inter: number;
    };
    additionalFees: {
      ocr: number;
      urgency: number;
      formatting: number;
    };
    minimumCharge: number;
    finalTotal: number;
  };
}

interface AdvancedWordCounterProps {
  analysisData: AdvancedWordDetails;
  isProcessing?: boolean;
}

const AdvancedWordCounter = ({ analysisData, isProcessing }: AdvancedWordCounterProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const progressValue = useMemo(() => {
    if (!analysisData.totalWords) return 0;
    return Math.min((analysisData.billableWords / analysisData.totalWords) * 100, 100);
  }, [analysisData]);

  if (analysisData.totalWords === 0 && !isProcessing) return null;

  return (
    <div className="space-y-6">
      {/* نظرة عامة سريعة */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-emerald-500/5 border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Calculator className="h-6 w-6 text-primary animate-pulse-soft" />
            تحليل متقدم للنصوص والملفات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* المؤشرات الرئيسية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">
                {isProcessing ? "..." : analysisData.totalWords.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">إجمالي الكلمات</div>
            </div>
            
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {isProcessing ? "..." : analysisData.billableWords.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">كلمات قابلة للفوترة</div>
            </div>
            
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {isProcessing ? "..." : analysisData.duplicates.totalUnique.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">كلمات فريدة</div>
            </div>
            
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {isProcessing ? "..." : analysisData.files.length}
              </div>
              <div className="text-xs text-muted-foreground">عدد الملفات</div>
            </div>
          </div>

          {/* شريط التقدم للكلمات القابلة للفوترة */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">معدل الكلمات القابلة للفوترة</span>
              <span className="text-emerald-600 font-bold">{progressValue.toFixed(1)}%</span>
            </div>
            <Progress value={progressValue} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {(analysisData.totalWords - analysisData.billableWords).toLocaleString()} كلمة مستبعدة من الفوترة
            </p>
          </div>
        </CardContent>
      </Card>

      {/* التفاصيل المتقدمة */}
      <Card className="bg-gradient-card border-0 shadow-medium">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none bg-muted/30" dir="rtl">
              <TabsTrigger value="overview" className="gap-2 flex-row-reverse">
                <span className="hidden sm:inline">النظرة العامة</span>
                <TrendingUp className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-2 flex-row-reverse">
                <span className="hidden sm:inline">تحليل الملفات</span>
                <FileText className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="duplicates" className="gap-2 flex-row-reverse">
                <span className="hidden sm:inline">التكرارات</span>
                <Copy className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="exclusions" className="gap-2 flex-row-reverse">
                <span className="hidden sm:inline">الاستثناءات</span>
                <Filter className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              {/* ملخص إحصائي */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      تفصيل الكلمات
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>النصوص الأساسية:</span>
                        <span className="font-medium">{(analysisData.totalWords - analysisData.exclusions.placeholders).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>داخل الجداول:</span>
                        <span className="font-medium">{analysisData.files.reduce((sum, file) => sum + file.tableWords, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>النصوص النائبة:</span>
                        <span className="font-medium">{analysisData.exclusions.placeholders.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      تحتاج OCR
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>الصفحات:</span>
                        <span className="font-medium">{analysisData.files.filter(f => f.ocrNeeded).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الرسوم الإضافية:</span>
                        <span className="font-medium">{analysisData.pricing.additionalFees.ocr} ر.س</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* شارات المعلومات */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Hash className="h-3 w-3 mr-1" />
                  {analysisData.exclusions.pureNumbers.toLocaleString()} رقم مستبعد
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Eye className="h-3 w-3 mr-1" />
                  {analysisData.exclusions.codes.toLocaleString()} كود مستبعد
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Table className="h-3 w-3 mr-1" />
                  {analysisData.files.reduce((sum, file) => sum + file.tableWords, 0).toLocaleString()} كلمة في جداول
                </Badge>
              </div>
            </TabsContent>

            <TabsContent value="files" className="p-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg mb-4">تحليل مفصل لكل ملف</h4>
                
                {/* جدول الملفات */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="text-right p-3 font-bold">الملف</th>
                        <th className="text-right p-3 font-bold">النوع</th>
                        <th className="text-right p-3 font-bold">الصفحات</th>
                        <th className="text-right p-3 font-bold">كلمات المصدر</th>
                        <th className="text-right p-3 font-bold">داخل جداول</th>
                        <th className="text-right p-3 font-bold">أرقام فقط</th>
                        <th className="text-right p-3 font-bold">مستبعد</th>
                        <th className="text-right p-3 font-bold">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.files.map((file, index) => (
                        <tr key={index} className="border-b border-muted hover:bg-muted/20">
                          <td className="p-3 font-medium">{file.fileName}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {file.fileType.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3">{file.pages}</td>
                          <td className="p-3 font-medium text-primary">{file.sourceWords.toLocaleString()}</td>
                          <td className="p-3 text-blue-600">{file.tableWords.toLocaleString()}</td>
                          <td className="p-3 text-orange-600">{file.numbersOnly.toLocaleString()}</td>
                          <td className="p-3 text-red-600">{file.excluded.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {file.ocrNeeded && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  يحتاج OCR
                                </Badge>
                              )}
                              {file.duplicatesIntra > 0 && (
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                  تكرار داخلي
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="duplicates" className="p-6">
              <div className="space-y-6">
                <h4 className="font-bold text-lg mb-4">تحليل التكرارات وحساب الخصومات</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardContent className="p-4">
                      <h5 className="font-bold text-purple-800 dark:text-purple-200 mb-3">التكرارات الداخلية</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>الكلمات المكررة:</span>
                          <span className="font-medium">{analysisData.duplicates.intraFile.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>خصم التكرار:</span>
                          <span className="font-medium text-green-600">30%</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold">وفر:</span>
                          <span className="font-bold text-green-600">
                            {(analysisData.duplicates.intraFile * analysisData.pricing.baseRate * 0.3).toFixed(2)} ر.س
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <CardContent className="p-4">
                      <h5 className="font-bold text-blue-800 dark:text-blue-200 mb-3">التكرارات بين الملفات</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>الكلمات المكررة:</span>
                          <span className="font-medium">{analysisData.duplicates.interFile.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>خصم التكرار:</span>
                          <span className="font-medium text-green-600">20%</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold">وفر:</span>
                          <span className="font-bold text-green-600">
                            {(analysisData.duplicates.interFile * analysisData.pricing.baseRate * 0.2).toFixed(2)} ر.س
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                  <h5 className="font-bold text-green-800 dark:text-green-200 mb-2">إجمالي التوفير من التكرارات</h5>
                  <div className="text-2xl font-bold text-green-600">
                    {((analysisData.duplicates.intraFile * 0.3 + analysisData.duplicates.interFile * 0.2) * analysisData.pricing.baseRate).toFixed(2)} ر.س
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    تم توفير {((analysisData.duplicates.intraFile + analysisData.duplicates.interFile) / analysisData.totalWords * 100).toFixed(1)}% من التكلفة الإجمالية
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exclusions" className="p-6">
              <div className="space-y-6">
                <h4 className="font-bold text-lg mb-4">استثناءات من العد والفوترة</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
                    <CardContent className="p-4 text-center">
                      <Hash className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{analysisData.exclusions.pureNumbers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">أرقام صرفة</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">{analysisData.exclusions.codes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">أكواد ومعرفات</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{analysisData.exclusions.headers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">رؤوس وتذييلات</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h5 className="font-bold mb-2">معايير الاستثناء المطبقة:</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• استبعاد الرؤوس والتذييلات المكررة بنسبة ≥90%</li>
                    <li>• استبعاد الأرقام الصرفة والأكواد والمعرفات والروابط</li>
                    <li>• النصوص النائبة مثل {"name"} و%s محسوبة في حقل منفصل</li>
                    <li>• كشف الصفحات التي تحتاج OCR إذا كانت صورًا</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWordCounter;