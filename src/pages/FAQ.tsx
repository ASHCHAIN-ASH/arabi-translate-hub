import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle, Phone, Mail, HelpCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { name: "الكل", count: 28, color: "bg-blue-500" },
    { name: "الخدمات العامة", count: 8, color: "bg-green-500" },
    { name: "الأسعار والدفع", count: 6, color: "bg-purple-500" },
    { name: "الجودة والضمان", count: 5, color: "bg-orange-500" },
    { name: "المواعيد والتسليم", count: 4, color: "bg-red-500" },
    { name: "التقنية والدعم", count: 3, color: "bg-indigo-500" },
    { name: "الخصوصية والأمان", count: 2, color: "bg-pink-500" }
  ];

  const faqItems = [
    {
      id: 1,
      category: "الخدمات العامة",
      question: "ما هي الخدمات التي تقدمها شركة MasterEduPath؟",
      answer: "نقدم مجموعة شاملة من الخدمات التعليمية والترجمة المتخصصة تشمل: الترجمة القانونية والطبية والتقنية، ترجمة المواقع والتطبيقات، الخدمات الأكاديمية والبحثية، التدقيق اللغوي، والاستشارات التعليمية المتقدمة. نعمل بأكثر من 100 لغة مع فريق من 128 خبير ومترجم معتمد.",
      popular: true
    },
    {
      id: 2,
      category: "الأسعار والدفع",
      question: "كيف يتم حساب تكلفة الترجمة؟",
      answer: "تعتمد التكلفة على عدة عوامل: نوع المستند ومستوى التخصص، عدد الكلمات، اللغات المطلوبة، مستوى الجودة المطلوب، والمدة الزمنية للتسليم. نقدم تقديرات مجانية فورية عبر الموقع، ويمكنكم الحصول على عرض سعر مفصل خلال ساعة من إرسال المستندات.",
      popular: true
    },
    {
      id: 3,
      category: "الجودة والضمان",
      question: "ما هي ضمانات الجودة التي تقدمونها؟",
      answer: "نضمن جودة استثنائية من خلال: فريق مترجمين معتمدين ومتخصصين، مراجعة ثلاثية المستويات (ترجمة - مراجعة - تدقيق نهائي)، استخدام أحدث أدوات الترجمة المساعدة، شهادات ISO للجودة، وضمان إعادة العمل مجاناً في حالة عدم الرضا. جميع مشاريعنا مشمولة بضمان الجودة لمدة 30 يوماً.",
      popular: false
    },
    {
      id: 4,
      category: "المواعيد والتسليم",
      question: "كم يستغرق إنجاز مشروع الترجمة؟",
      answer: "المدة تعتمد على حجم وتعقيد المشروع: المستندات البسيطة (1-5 صفحات): 24-48 ساعة، المشاريع المتوسطة (6-20 صفحة): 2-5 أيام، المشاريع الكبيرة (أكثر من 20 صفحة): 5-10 أيام. نوفر خدمة التسليم السريع (خلال 12 ساعة) للمشاريع العاجلة مقابل رسوم إضافية.",
      popular: true
    },
    {
      id: 5,
      category: "التقنية والدعم",
      question: "هل تدعمون جميع أنواع الملفات؟",
      answer: "نعم، ندعم جميع صيغ الملفات الشائعة: Word، PDF، Excel، PowerPoint، InDesign، HTML، XML، وملفات الصور. كما ندعم ملفات الصوت والفيديو للترجمة الصوتية. فريقنا التقني يتعامل مع الملفات المعقدة والتخطيطات المتقدمة مع الحفاظ على التنسيق الأصلي.",
      popular: false
    },
    {
      id: 6,
      category: "الخصوصية والأمان",
      question: "كيف تحمون سرية المستندات والبيانات؟",
      answer: "أمان بياناتكم أولويتنا القصوى. نطبق أعلى معايير الأمان: تشفير end-to-end لجميع الملفات، خوادم آمنة معتمدة ISO 27001، اتفاقيات سرية مع جميع المترجمين، حذف تلقائي للملفات بعد انتهاء المشروع، وعدم مشاركة أي بيانات مع طرف ثالث. جميع مترجمينا ملزمون بعقود سرية صارمة.",
      popular: true
    },
    {
      id: 7,
      category: "الخدمات العامة",
      question: "هل تقدمون خدمة الترجمة المعتمدة رسمياً؟",
      answer: "نعم، نقدم خدمة الترجمة المعتمدة والمصدقة رسمياً للوثائق الحكومية والقانونية والأكاديمية. مترجمونا معتمدون من الجهات الرسمية، ونوفر خدمة التصديق من الخارجية والسفارات عند الحاجة. هذه الخدمة متاحة لأكثر من 50 لغة.",
      popular: false
    },
    {
      id: 8,
      category: "الأسعار والدفع",
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نوفر طرق دفع متنوعة ومرنة: التحويل البنكي، بطاقات الائتمان (Visa/MasterCard)، محافظ إلكترونية (STC Pay، Apple Pay، Google Pay)، والدفع النقدي في المكتب. نقبل الدفع المؤجل للعملاء المؤسسيين، ونوفر خصومات للمشاريع الكبيرة والعملاء الدائمين.",
      popular: true
    },
    {
      id: 9,
      category: "الجودة والضمان",
      question: "ماذا لو لم أكن راضياً عن جودة الترجمة؟",
      answer: "رضاكم مضمون 100%! في حالة عدم الرضا عن الجودة: نعيد المراجعة والتعديل مجاناً، نوفر مترجم آخر إذا لزم الأمر، نضمن استرداد كامل إذا لم نتمكن من تحقيق توقعاتكم. لدينا فريق جودة متخصص يراقب جميع المشاريع ويضمن تطبيق أعلى المعايير المهنية.",
      popular: false
    },
    {
      id: 10,
      category: "المواعيد والتسليم",
      question: "هل يمكن تسريع إنجاز المشروع في الحالات العاجلة؟",
      answer: "بالطبع! نوفر خدمة التسليم العاجل على مدار الساعة: خدمة 12 ساعة للمشاريع الصغيرة، خدمة 24 ساعة للمشاريع المتوسطة، تخصيص فريق كامل للمشاريع الكبيرة العاجلة. نحافظ على نفس معايير الجودة العالية حتى مع المواعيد المضغوطة.",
      popular: true
    }
  ];

  const toggleItem = (itemId: number) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6"
            >
              <HelpCircle className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              إجابات شاملة على أكثر الأسئلة شيوعاً حول خدماتنا وطرق العمل
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="ابحث في الأسئلة..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  التصنيفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button 
                      variant={activeCategory === category.name ? "default" : "ghost"} 
                      className="w-full justify-between group"
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        {category.name}
                      </div>
                      <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">تحتاج مساعدة؟</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 text-center">
                  لم تجد إجابة لسؤالك؟ تواصل معنا مباشرة
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="ml-2 h-4 w-4" />
                    0500776343
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="ml-2 h-4 w-4" />
                    info@masteredupath.com
                  </Button>
                  <Button className="w-full">دردشة فورية</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {filteredFAQs.length} سؤال في "{activeCategory}"
              </h2>
              {searchTerm && (
                <Badge variant="outline" className="text-primary">
                  نتائج البحث: {filteredFAQs.length}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader 
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-right leading-relaxed">
                              {item.question}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.popular && (
                                <Badge className="text-xs bg-orange-500">
                                  سؤال شائع
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        </motion.div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {openItems.includes(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 pr-14">
                            <div className="border-t border-slate-200 pt-4">
                              <p className="text-slate-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  لم نجد أي نتائج
                </h3>
                <p className="text-slate-500">
                  جرب البحث بكلمات مختلفة أو تواصل معنا مباشرة
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;