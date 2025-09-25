import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle, Phone, Mail, HelpCircle, CheckCircle, Star, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { name: "الكل", count: 35, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { name: "الخدمات الأكاديمية", count: 7, color: "bg-gradient-to-r from-emerald-500 to-emerald-600" },
    { name: "البحث العلمي", count: 8, color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { name: "الترجمة المتخصصة", count: 5, color: "bg-gradient-to-r from-orange-500 to-orange-600" },
    { name: "الخدمات التقنية", count: 6, color: "bg-gradient-to-r from-teal-500 to-teal-600" },
    { name: "الأسعار والدفع", count: 4, color: "bg-gradient-to-r from-indigo-500 to-indigo-600" },
    { name: "الجودة والاعتماد", count: 4, color: "bg-gradient-to-r from-red-500 to-red-600" },
    { name: "الخصوصية والأمان", count: 2, color: "bg-gradient-to-r from-pink-500 to-pink-600" }
  ];

  const faqItems = [
    // الخدمات الأكاديمية
    {
      id: 1,
      category: "الخدمات الأكاديمية",
      question: "ما هي الخدمات الأكاديمية المتخصصة التي تقدمها MasterEduPath؟",
      answer: "نقدم مجموعة شاملة من الخدمات الأكاديمية المتقدمة: الترجمة الأكاديمية للأوراق البحثية والرسائل العلمية، مراجعة وتحرير النصوص الأكاديمية، خدمات النشر في المجلات العالمية المحكمة، الاستشارات الأكاديمية للباحثين، برامج التدريب على منهجية البحث العلمي، والدعم الشامل للطلاب والباحثين في جميع التخصصات العلمية والإنسانية.",
      popular: true
    },
    {
      id: 2,
      category: "البحث العلمي",
      question: "كيف تساعدون في إعداد وكتابة الرسائل العلمية والأطروحات؟",
      answer: "نوفر دعماً شاملاً لإعداد الرسائل العلمية: وضع خطة البحث والإطار النظري، مراجعة الأدبيات وتحليل الدراسات السابقة، تصميم منهجية البحث وأدوات جمع البيانات، التحليل الإحصائي المتقدم باستخدام SPSS وR، كتابة الفصول وتنسيقها وفق المعايير الأكاديمية، مراجعة لغوية وأكاديمية شاملة، وإعداد الملاحق والببليوغرافيا وفق أحدث المعايير الدولية.",
      popular: true
    },
    {
      id: 3,
      category: "الخدمات الأكاديمية",
      question: "هل تقدمون خدمة فحص الانتحال والأصالة الأكاديمية؟",
      answer: "نعم، نوفر خدمة فحص الانتحال الشاملة باستخدام أحدث البرامج المتخصصة مثل Turnitin وiThenticate وCopyscape. نقدم تقارير مفصلة تشمل نسبة الأصالة، مصادر التشابه، والاقتراحات لتحسين الأصالة. كما نوفر خدمة إعادة الصياغة الأكاديمية المتخصصة للحفاظ على المعنى العلمي مع ضمان الأصالة التامة. جميع خدماتنا تلتزم بأعلى معايير النزاهة الأكاديمية.",
      popular: false
    },
    {
      id: 4,
      category: "البحث العلمي",
      question: "ما هي خدماتكم في التحليل الإحصائي والبحثي؟",
      answer: "نقدم خدمات تحليل إحصائي متقدمة تشمل: التحليل الوصفي والاستنتاجي، اختبارات الفروض الإحصائية، تحليل الانحدار والارتباط، التحليل العاملي وتحليل المسار، النمذجة الهيكلية SEM، تحليل البيانات الضخمة، إعداد الجداول والرسوم البيانية المتخصصة. نستخدم برامج متقدمة مثل SPSS، R، STATA، AMOS، وMatlab. فريقنا من الإحصائيين المتخصصين يضمن دقة التحليل وصحة النتائج العلمية.",
      popular: true
    },
    {
      id: 5,
      category: "الترجمة المتخصصة",
      question: "ما هي التخصصات التي تغطيها خدمات الترجمة لديكم؟",
      answer: "نغطي جميع التخصصات الأكاديمية والمهنية: الطب والعلوم الصحية، الهندسة والتكنولوجيا، القانون والقضاء، الاقتصاد والمالية، العلوم الإنسانية والاجتماعية، التعليم وعلم النفس، العلوم البيئية والزراعية، تكنولوجيا المعلومات والذكاء الاصطناعي، الصيدلة والكيمياء، الفيزياء والرياضيات. لكل تخصص فريق من المترجمين المتخصصين الحاصلين على مؤهلات أكاديمية عليا في نفس المجال.",
      popular: true
    },
    {
      id: 6,
      category: "الخدمات التقنية",
      question: "هل تدعمون ترجمة المحتوى التقني والبرمجي؟",
      answer: "نعم، نتخصص في ترجمة المحتوى التقني المتقدم: الوثائق الفنية والمواصفات، أدلة المستخدم والتشغيل، واجهات البرمجيات والتطبيقات، المحتوى التقني للمواقع الإلكترونية، الوثائق الهندسية والمخططات، براءات الاختراع والملكية الفكرية. فريقنا يضم مترجمين متخصصين في التكنولوجيا والبرمجة، ونستخدم أدوات CAT متقدمة لضمان الاتساق والدقة التقنية.",
      popular: false
    },
    {
      id: 7,
      category: "الجودة والاعتماد",
      question: "ما هي الشهادات والاعتمادات التي تحملها الشركة؟",
      answer: "نحمل العديد من الشهادات والاعتمادات المهنية: شهادة ISO 9001:2015 لإدارة الجودة، شهادة ISO 17100:2015 لخدمات الترجمة، اعتماد من الجمعية الأمريكية للمترجمين ATA، عضوية الاتحاد الدولي للمترجمين FIT، اعتماد معهد اللغويات التطبيقية، شهادات أمان ISO 27001 لحماية البيانات. جميع مترجمينا معتمدون من مؤسسات دولية متخصصة ويخضعون لتقييم دوري مستمر.",
      popular: true
    },
    {
      id: 8,
      category: "الأسعار والدفع",
      question: "كيف يتم تسعير الخدمات الأكاديمية والبحثية؟",
      answer: "التسعير يعتمد على عدة معايير أكاديمية: مستوى التخصص والتعقيد العلمي، نوع الخدمة (ترجمة، تحرير، تحليل)، حجم المشروع وعدد الصفحات، المدة الزمنية المطلوبة، مستوى الجودة المطلوب (أكاديمي، احترافي، متخصص). نقدم باقات مخفضة للطلاب والباحثين، وخصومات للمشاريع الكبيرة والعملاء الدائمين. جميع الأسعار شفافة ومعلنة، مع إمكانية الحصول على عرض سعر مجاني خلال ساعة.",
      popular: true
    },
    {
      id: 9,
      category: "البحث العلمي",
      question: "هل تساعدون في النشر بالمجلات العلمية المحكمة؟",
      answer: "نقدم دعماً شاملاً للنشر العلمي: اختيار المجلة المناسبة وفق معامل التأثير والتخصص، إعداد الورقة البحثية وفق معايير المجلة، المراجعة الأكاديمية واللغوية الشاملة، إعداد الملخص والكلمات المفتاحية، تنسيق المراجع وفق النمط المطلوب، متابعة عملية النشر والرد على تعليقات المحكمين. نتعامل مع أكثر من 10,000 مجلة علمية في قواعد بيانات Scopus وWeb of Science وPubMed.",
      popular: true
    },
    {
      id: 10,
      category: "الخدمات الأكاديمية",
      question: "ما هي خدماتكم في مجال التدريب والتطوير الأكاديمي؟",
      answer: "نوفر برامج تدريبية متخصصة للباحثين والأكاديميين: ورش عمل في منهجية البحث العلمي، دورات في استخدام برامج التحليل الإحصائي، تدريب على كتابة الأوراق العلمية، برامج تطوير مهارات النشر الأكاديمي، دورات في إدارة المراجع العلمية، ورش عمل في تصميم أدوات البحث. جميع البرامج تُقدم من خبراء أكاديميين متخصصين مع شهادات معتمدة وإمكانية التدريب أونلاين أو وجاهياً.",
      popular: false
    },
    {
      id: 11,
      category: "الخدمات التقنية",
      question: "هل تقدمون خدمات ترجمة المواقع والتطبيقات الذكية؟",
      answer: "نتخصص في ترجمة المحتوى الرقمي والتطبيقات: ترجمة المواقع الإلكترونية مع الحفاظ على SEO، ترجمة تطبيقات الهواتف الذكية وواجهاتها، ترجمة البرمجيات والأنظمة، ترجمة المحتوى التفاعلي والألعاب، ترجمة منصات التعلم الإلكتروني، خدمات التعريب الثقافي للتطبيقات. نستخدم تقنيات متقدمة مثل API integration ونظم إدارة الترجمة TMS لضمان الكفاءة والدقة.",
      popular: false
    },
    {
      id: 12,
      category: "البحث العلمي",
      question: "ما هي خدماتكم في مجال الاستشارات البحثية والأكاديمية؟",
      answer: "نقدم استشارات أكاديمية شاملة من خبراء متخصصين: استشارة في اختيار موضوع البحث وصياغة المشكلة، تقييم جدوى البحث وأهميته العلمية، توجيه في اختيار المنهجية المناسبة، استشارة في تصميم أدوات البحث، مراجعة الخطط البحثية والاقتراحات، التوجيه الأكاديمي للطلاب والباحثين، استشارة في التطوير المهني الأكاديمي. نوفر جلسات استشارية فردية ومجموعية مع إمكانية المتابعة المستمرة.",
      popular: true
    },
    {
      id: 13,
      category: "الترجمة المتخصصة",
      question: "هل تتعاملون مع الترجمة القانونية والرسمية؟",
      answer: "نتخصص في الترجمة القانونية المعتمدة: ترجمة العقود والاتفاقيات، الوثائق القضائية والأحكام، الدساتير والقوانين، وثائق الملكية الفكرية، العقود التجارية والاستثمارية، الوثائق الحكومية والرسمية. جميع مترجمينا القانونيين حاصلون على مؤهلات قانونية متخصصة ومعتمدون رسمياً. نوفر خدمة التصديق والتوثيق من الجهات المختصة مع ضمان الدقة القانونية الكاملة.",
      popular: true
    },
    {
      id: 14,
      category: "الخدمات التقنية",
      question: "ما هي خدماتكم في ترجمة المحتوى الصوتي والمرئي؟",
      answer: "نقدم خدمات ترجمة صوتية ومرئية متقدمة: ترجمة الأفلام والبرامج التلفزيونية، ترجمة المحاضرات والندوات العلمية، ترجمة البودكاست والمحتوى الصوتي، خدمات الترجمة الفورية للمؤتمرات، ترجمة المحتوى التعليمي والتدريبي، خدمات التعليق الصوتي والدبلجة. نستخدم تقنيات متقدمة للتعرف على الصوت وأدوات ترجمة متزامنة مع ضمان جودة الصوت والصورة.",
      popular: false
    },
    {
      id: 15,
      category: "الجودة والاعتماد",
      question: "كيف تضمنون جودة الترجمة الأكاديمية والعلمية؟",
      answer: "نطبق نظام جودة متعدد المستويات: اختيار مترجمين متخصصين أكاديمياً في نفس المجال، مراجعة أولى من مترجم مختلف، مراجعة أكاديمية من خبير في التخصص، تدقيق لغوي نهائي، فحص تقني للتنسيق والمراجع، مراجعة شاملة للمصطلحات العلمية. نستخدم قواميس وقواعد بيانات متخصصة، ونطبق معايير الجودة الدولية ISO مع ضمان الرضا الكامل أو إعادة العمل مجاناً.",
      popular: true
    },
    {
      id: 16,
      category: "الأسعار والدفع",
      question: "هل تقدمون خصومات خاصة للمؤسسات التعليمية؟",
      answer: "نعم، نوفر برامج خصومات متميزة للقطاع التعليمي: خصم 20% للجامعات ومراكز البحوث، خصم 15% للطلاب الجامعيين وطلاب الدراسات العليا، عروض خاصة للمشاريع البحثية المؤسسية، باقات سنوية للكليات والأقسام الأكاديمية، خدمات مجانية محدودة للباحثين الناشئين. نقدم أيضاً نظام نقاط الولاء وإمكانية الدفع بالتقسيط للمشاريع الكبيرة مع شروط ميسرة.",
      popular: false
    },
    {
      id: 17,
      category: "البحث العلمي",
      question: "هل تساعدون في إعداد اقتراحات المنح البحثية؟",
      answer: "نقدم دعماً شاملاً لإعداد اقتراحات المنح: كتابة الملخص التنفيذي وأهداف البحث، إعداد الإطار النظري ومراجعة الأدبيات، تصميم منهجية البحث وخطة التنفيذ، إعداد الميزانية وتبرير التكاليف، كتابة السيرة الذاتية الأكاديمية، ترجمة الاقتراحات للغات المطلوبة، مراجعة وتحرير شامل وفق معايير الجهة المانحة. نتعامل مع جميع الجهات المانحة المحلية والدولية مع نسب نجاح عالية.",
      popular: true
    },
    {
      id: 18,
      category: "الخدمات الأكاديمية",
      question: "ما هي خدماتكم لطلاب الدراسات العليا؟",
      answer: "نوفر دعماً شاملاً لطلاب الماجستير والدكتوراه: إعداد اقتراح الرسالة وخطة البحث، مساعدة في مراجعة الأدبيات والدراسات السابقة، تصميم أدوات البحث واستمارات الاستبيان، التحليل الإحصائي للبيانات وتفسير النتائج، كتابة وتحرير فصول الرسالة، التدقيق اللغوي والأكاديمي، إعداد ملخص الرسالة والدفاع، تنسيق المراجع وفق الأنماط الأكاديمية. نقدم متابعة مستمرة مع استشاريين أكاديميين متخصصين.",
      popular: true
    },
    {
      id: 19,
      category: "الخدمات التقنية",
      question: "هل تدعمون التعلم الآلي والذكاء الاصطناعي في خدمات الترجمة؟",
      answer: "نستثمر في أحدث تقنيات الذكاء الاصطناعي لتحسين جودة الترجمة: أنظمة الترجمة الآلية العصبية NMT، تقنيات معالجة اللغة الطبيعية NLP، أدوات التحليل الدلالي المتقدم، نظم إدارة المعرفة الذكية، تقنيات التحقق من الجودة الآلية، أدوات التعرف على الأنماط اللغوية. مع ذلك، نحافظ على التوازن بين التقنية والخبرة البشرية، حيث يبقى المترجم المتخصص في قلب العملية لضمان الدقة والسياق الثقافي.",
      popular: false
    },
    {
      id: 20,
      category: "الخصوصية والأمان",
      question: "كيف تحمون البحوث والمشاريع الأكاديمية السرية؟",
      answer: "نطبق أعلى معايير الأمان والخصوصية: تشفير البيانات end-to-end أثناء النقل والتخزين، خوادم آمنة معتمدة ISO 27001 مع نسخ احتياطية مشفرة، اتفاقيات سرية صارمة NDA مع جميع المترجمين والموظفين، وصول محدود للبيانات حسب الحاجة فقط، مراقبة أمنية مستمرة وسجلات تتبع شاملة، حذف تلقائي للبيانات بعد انتهاء المشروع، سياسات صارمة لحماية الملكية الفكرية. نلتزم بمعايير GDPR وقوانين الخصوصية الدولية.",
      popular: true
    },
    {
      id: 21,
      category: "الترجمة المتخصصة",
      question: "هل تترجمون المحتوى الطبي والأبحاث الصحية؟",
      answer: "نتخصص في الترجمة الطبية عالية الدقة: الأوراق البحثية الطبية والدراسات السريرية، التقارير الطبية والتشخيصية، دليل الأدوية وأوراق السلامة، البروتوكولات الطبية والإجراءات العلاجية، الوثائق التنظيمية للأدوية والأجهزة الطبية، المحتوى التعليمي الطبي للمرضى. فريقنا يضم مترجمين طبيين معتمدين وأطباء متخصصين، ونلتزم بمعايير الترجمة الطبية الدولية مع ضمان الدقة المطلقة للمصطلحات الطبية.",
      popular: true
    },
    {
      id: 22,
      category: "البحث العلمي",
      question: "ما هي خدماتكم في مجال البحوث التطبيقية والتجريبية؟",
      answer: "نقدم دعماً متخصصاً للبحوث التطبيقية: تصميم التجارب وضبط المتغيرات، إعداد بروتوكولات البحث التجريبي، تحليل البيانات التجريبية والقياسات، تفسير النتائج المعملية والميدانية، كتابة تقارير البحوث التطبيقية، إعداد دراسات الحالة والتحليلات المقارنة، مساعدة في تطبيق النتائج عملياً. نتعامل مع جميع التخصصات العلمية والهندسية مع فريق من الباحثين ذوي الخبرة العملية والأكاديمية.",
      popular: false
    },
    {
      id: 23,
      category: "الخدمات الأكاديمية",
      question: "هل تقدمون خدمات التحكيم الأكاديمي والمراجعة النظيرة؟",
      answer: "نوفر خدمات تحكيم أكاديمي متخصصة من خبراء محكمين معتمدين: مراجعة الأوراق البحثية وتقييمها علمياً، تقديم تقارير تحكيم شاملة ومفصلة، تقييم الرسائل العلمية والأطروحات، مراجعة اقتراحات المنح البحثية، تحكيم المؤتمرات العلمية والندوات، خدمات التحكيم السريع للمجلات العاجلة. جميع محكمينا خبراء أكاديميون حاصلون على درجة الدكتوراه مع خبرة واسعة في النشر والتحكيم الدولي.",
      popular: false
    },
    {
      id: 24,
      category: "الجودة والاعتماد",
      question: "ما هي مدة الضمان على الخدمات الأكاديمية؟",
      answer: "نقدم ضمانات شاملة لجميع خدماتنا الأكاديمية: ضمان 90 يوماً للخدمات الأكاديمية والبحثية، ضمان مدى الحياة للترجمة المعتمدة، ضمان إعادة المراجعة مجاناً خلال 60 يوماً، ضمان استرداد كامل إذا لم تحقق الخدمة المعايير المتفق عليها، دعم مجاني لمدة 6 أشهر للمشاريع الكبيرة، ضمان السرية التامة بدون حدود زمنية. نلتزم بأعلى معايير الجودة ونضع رضا العملاء في المقدمة.",
      popular: true
    },
    {
      id: 25,
      category: "الأسعار والدفع",
      question: "هل يمكن تقسيط تكلفة المشاريع البحثية الكبيرة؟",
      answer: "نعم، نوفر خطط دفع مرنة ومتنوعة: تقسيط المشاريع الكبيرة على 3-6 أقساط، دفع 50% مقدماً والباقي عند التسليم، خطط دفع شهرية للعملاء المؤسسيين، تسهيلات خاصة للطلاب وحديثي التخرج، تأجيل الدفع للباحثين في انتظار المنح، خصومات نقدية للدفع المقدم الكامل. نتفهم التحديات المالية للباحثين ونسعى لتقديم حلول دفع تناسب جميع الفئات.",
      popular: false
    },
    {
      id: 26,
      category: "الخدمات التقنية",
      question: "هل تقدمون خدمات الأرشفة الإلكترونية والرقمنة؟",
      answer: "نقدم خدمات أرشفة ورقمنة شاملة: تحويل المستندات الورقية إلى صيغ رقمية، إنشاء قواعد بيانات قابلة للبحث، فهرسة وتصنيف المحتوى الأكاديمي، إنشاء مكتبات رقمية متخصصة، تطوير نظم إدارة المعرفة، خدمات النسخ الاحتياطي السحابي الآمن، تطوير واجهات بحث متقدمة، خدمات الاستخراج النصي OCR. نستخدم تقنيات متقدمة مع ضمان جودة الرقمنة والحفاظ على التنسيق الأصلي.",
      popular: false
    },
    {
      id: 27,
      category: "البحث العلمي",
      question: "ما هي خدماتكم في مجال البحوث الميدانية وجمع البيانات؟",
      answer: "نوفر دعماً شاملاً للبحوث الميدانية: تصميم أدوات جمع البيانات (استبيانات، مقابلات)، تدريب فرق البحث الميداني، تنظيم وتنفيذ الدراسات الميدانية، خدمات الاستقصاء الإلكتروني والهاتفي، جمع البيانات من المصادر المتنوعة، تنظيف البيانات والتحقق من صحتها، إعداد قواعد البيانات وترميز المتغيرات. نتعامل مع جميع أنواع البحوث الكمية والنوعية مع ضمان معايير أخلاقيات البحث العلمي.",
      popular: true
    },
    {
      id: 28,
      category: "الخدمات الأكاديمية",
      question: "هل تساعدون في التحضير لمناقشة الرسائل العلمية؟",
      answer: "نقدم دعماً شاملاً للتحضير للمناقشة: إعداد عرض المناقشة PowerPoint احترافي، تدريب على تقديم البحث والدفاع عنه، محاكاة جلسات المناقشة مع أسئلة متوقعة، إعداد إجابات للانتقادات المحتملة، مراجعة نهائية للرسالة وإصلاح الأخطاء، تدريب على مهارات العرض والتواصل، إعداد الملخص والنشرة الأكاديمية، دعم نفسي وأكاديمي قبل المناقشة. نضمن استعداداً كاملاً ونجاحاً متميزاً في المناقشة.",
      popular: true
    },
    {
      id: 29,
      category: "الترجمة المتخصصة",
      question: "هل تتعاملون مع ترجمة براءات الاختراع والملكية الفكرية؟",
      answer: "نتخصص في ترجمة الملكية الفكرية وبراءات الاختراع: ترجمة طلبات البراءات وأوصافها التقنية، ترجمة المطالبات والرسومات التوضيحية، ترجمة تقارير البحث والفحص، ترجمة عقود الترخيص والتنازل، ترجمة دراسات الانتهاك والتحليل القانوني، ترجمة الأدلة التقنية والمواصفات. فريقنا يضم مترجمين متخصصين في الملكية الفكرية ومهندسين براءات معتمدين مع ضمان الدقة التقنية والقانونية الكاملة.",
      popular: false
    },
    {
      id: 30,
      category: "الخصوصية والأمان",
      question: "ما هي سياساتكم لحماية حقوق الطبع والنشر؟",
      answer: "نطبق سياسات صارمة لحماية حقوق الطبع: احترام تام لحقوق المؤلفين والناشرين، التحقق من صحة تراخيص الترجمة، عدم نشر أو توزيع المحتوى المترجم بدون إذن، حماية الأعمال المترجمة من الاستخدام غير المصرح، توثيق جميع المصادر والمراجع، التزام كامل بقوانين الملكية الفكرية المحلية والدولية، تقديم شهادات أصالة الترجمة، ضمان عدم انتهاك أي حقوق طبع ونشر. نوفر استشارات قانونية متخصصة في هذا المجال.",
      popular: false
    },
    {
      id: 31,
      category: "البحث العلمي",
      question: "هل تقدمون خدمات المراجعة المنهجية والتحليل التلوي؟",
      answer: "نتخصص في إعداد المراجعات المنهجية والتحليل التلوي: تطوير استراتيجية البحث وقواعد البيانات، استخراج وفحص الأدبيات العلمية، تقييم جودة الدراسات والأدلة، استخراج البيانات وترميزها، إجراء التحليل التلوي الإحصائي، تحليل الحساسية والانحياز، إعداد تقارير PRISMA ومخططات التدفق، كتابة المراجعة وفق معايير المجلات العلمية. نستخدم برامج متخصصة مثل RevMan وCMA مع فريق من الباحثين المتخصصين في الطب المبني على الأدلة.",
      popular: true
    },
    {
      id: 32,
      category: "الخدمات الأكاديمية",
      question: "ما هي خدماتكم لأعضاء هيئة التدريس والباحثين؟",
      answer: "نوفر خدمات شاملة لأعضاء هيئة التدريس: إعداد المقررات الدراسية والمناهج، تطوير المواد التعليمية والعروض، إعداد خطط البحث والمشاريع العلمية، كتابة اقتراحات المنح البحثية، إعداد التقارير الأكاديمية والإدارية، خدمات التطوير المهني والأكاديمي، إعداد ملفات الترقية والسيرة الأكاديمية، تطوير برامج الدراسات العليا، إعداد معايير التقييم والامتحانات. نقدم دعماً متكاملاً لرفع مستوى الأداء الأكاديمي والبحثي.",
      popular: false
    },
    {
      id: 33,
      category: "الخدمات التقنية",
      question: "هل تطورون منصات التعلم الإلكتروني والمحتوى التفاعلي؟",
      answer: "نقدم حلولاً متكاملة للتعلم الإلكتروني: تطوير منصات LMS مخصصة، إنشاء محتوى تعليمي تفاعلي، تصميم مقررات إلكترونية متعددة الوسائط، تطوير تطبيقات تعليمية للهواتف الذكية، إنشاء بيئات محاكاة تعليمية، تطوير ألعاب تعليمية، إنشاء مكتبات رقمية متخصصة، تطوير نظم تقييم إلكترونية، خدمات الترجمة للمحتوى التعليمي. نستخدم أحدث تقنيات التعلم الآلي والواقع المعزز لإنشاء تجارب تعليمية متميزة.",
      popular: false
    },
    {
      id: 34,
      category: "الجودة والاعتماد",
      question: "كيف تقيمون رضا العملاء وتطورون خدماتكم؟",
      answer: "نطبق نظام تقييم شامل لرضا العملاء: استبيانات تقييم تفصيلية بعد كل مشروع، مقابلات دورية مع العملاء المؤسسيين، نظام تتبع شكاوى ومقترحات العملاء، تحليل مؤشرات الأداء KPIs بشكل دوري، اجتماعات دورية لتقييم الخدمات، تطبيق التحسين المستمر وفق معايير الجودة، برامج تدريب مستمر للموظفين، تحديث الخدمات وفق احتياجات السوق. نهدف للحصول على رضا 100% من عملائنا مع التطوير المستمر لخدماتنا.",
      popular: true
    },
    {
      id: 35,
      category: "الأسعار والدفع",
      question: "هل تقدمون عروض خاصة للمشاريع البحثية طويلة المدى؟",
      answer: "نعم، نوفر عروضاً مميزة للمشاريع طويلة المدى: خصومات تصل لـ30% للمشاريع السنوية، عقود شراكة مع المؤسسات البحثية، تسعير تفضيلي للباحثين الدائمين، باقات شاملة للدراسات متعددة السنوات، تثبيت الأسعار لمدة العقد، خدمات مجانية إضافية للعملاء المميزين، أولوية في التنفيذ والجدولة، تخصيص فريق عمل ثابت للمشروع. نسعى لبناء شراكات طويلة الأمد مع الباحثين والمؤسسات الأكاديمية.",
      popular: false
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
      <section className="relative py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-700 overflow-hidden">
        {/* Simplified Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              rotate: 360,
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ 
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-r from-white/5 to-white/15 rounded-full"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/20"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <HelpCircle className="h-12 w-12 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-6xl md:text-7xl font-bold mb-6 font-arabic-title bg-gradient-to-l from-white via-white to-yellow-200 bg-clip-text text-transparent"
            >
              الأسئلة الشائعة
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              دليلك الشامل للحصول على إجابات مفصلة حول خدماتنا الأكاديمية والبحثية المتقدمة
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-lg mx-auto"
            >
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6 z-10" />
                  <Input 
                    placeholder="ابحث في جميع الأسئلة والإجابات..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-14 pl-6 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-2xl text-lg focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                  />
                </motion.div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mt-8 lg:mt-12 max-w-4xl mx-auto"
            >
              {[
                { number: "35+", label: "سؤال وإجابة", color: "from-blue-400 to-blue-600" },
                { number: "8", label: "تصنيف متخصص", color: "from-green-400 to-green-600" },
                { number: "100+", label: "خدمة متقدمة", color: "from-purple-400 to-purple-600" },
                { number: "24/7", label: "دعم متواصل", color: "from-orange-400 to-orange-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-2 lg:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className={`text-lg lg:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-xs lg:text-sm mt-0.5 lg:mt-1 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Sidebar - مُحسَّن للجوال */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Categories - مخفية على الجوال ومرئية كـ Dropdown */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-10"
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Categories Card - مخفية على الجوال */}
            <Card className="hidden lg:block mb-6 lg:mb-8 shadow-lg hover:shadow-xl transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  التصنيفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button 
                      variant={activeCategory === category.name ? "default" : "ghost"} 
                      className={`w-full justify-between group text-sm py-2 h-auto ${
                        activeCategory === category.name 
                          ? 'bg-primary text-white shadow-md' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${category.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
                        <span className="truncate">{category.name}</span>
                      </div>
                      <Badge 
                        variant={activeCategory === category.name ? "secondary" : "outline"}
                        className={`text-xs px-2 py-0.5 ${
                          activeCategory === category.name 
                            ? 'bg-white/20 text-white border-white/30' 
                            : 'group-hover:bg-primary group-hover:text-white group-hover:border-primary'
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support - محسن ومعدل */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm hover:from-white/95 hover:to-white/90">
              <CardHeader className="pb-4 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl mb-2 mx-auto"
                >
                  <HelpCircle className="h-6 w-6 text-primary" />
                </motion.div>
                <CardTitle className="text-base lg:text-lg font-bold text-gray-800">
                  هل تحتاج لمساعدة إضافية؟
                </CardTitle>
                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed mt-2">
                  فريق خدمة العملاء جاهز لمساعدتك على مدار الساعة
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* خدمة العملاء */}
                <div className="bg-gradient-to-l from-primary/5 to-blue-50 rounded-lg p-3 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700">خدمة العملاء</span>
                    <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs px-2">
                      متاح الآن
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    نحن متاحون 24/7 لخدمتكم وتقديم الدعم الفني والاستشارات المجانية
                  </p>
                </div>

                {/* أزرار التواصل */}
                <div className="space-y-2">
                  {/* الهاتف */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs lg:text-sm py-3 h-auto hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                      asChild
                    >
                      <a href="tel:+966500776343">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Phone className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-medium text-gray-800">اتصال مباشر</p>
                            <p className="text-xs text-gray-600 direction-ltr">+966 500 776 343</p>
                          </div>
                        </div>
                      </a>
                    </Button>
                  </motion.div>

                  {/* الواتساب */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="sm" 
                      className="w-full justify-start text-xs lg:text-sm py-3 h-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                      asChild
                    >
                      <a href="https://wa.me/966500776343" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-medium">تواصل معنا عبر الواتساب</p>
                            <p className="text-xs text-green-100">دردشة فورية - رد سريع</p>
                          </div>
                        </div>
                      </a>
                    </Button>
                  </motion.div>

                  {/* البريد الإلكتروني */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs lg:text-sm py-3 h-auto hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 group"
                      asChild
                    >
                      <a href="mailto:info@masteredupath.com">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                            <Mail className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-medium text-gray-800">البريد الإلكتروني</p>
                            <p className="text-xs text-gray-600">info@masteredupath.com</p>
                          </div>
                        </div>
                      </a>
                    </Button>
                  </motion.div>
                </div>

                {/* معلومات إضافية */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">ساعات العمل</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    الأحد - الخميس: 10:00 ص - 7:00 م
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    خدمة الواتساب متاحة 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                <span className="text-primary">{filteredFAQs.length}</span> سؤال في "{activeCategory}"
              </h2>
              {searchTerm && (
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 self-start sm:self-auto">
                  <Search className="h-3 w-3 ml-1" />
                  نتائج البحث: {filteredFAQs.length}
                </Badge>
              )}
            </div>

            <div className="space-y-3 lg:space-y-4">
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-primary/20 bg-white/90 backdrop-blur-sm">
                    <CardHeader 
                      className="cursor-pointer hover:bg-slate-50/80 transition-colors relative z-10 select-none p-3 lg:p-6"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('FAQ item clicked:', item.id);
                        toggleItem(item.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 lg:gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                            <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm lg:text-lg font-semibold text-right leading-snug lg:leading-relaxed text-gray-800 pr-2">
                              {item.question}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1 lg:gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5">
                                {item.category}
                              </Badge>
                              {item.popular && (
                                <Badge className="text-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-0.5 shadow-sm">
                                  <Star className="h-2 w-2 ml-1" />
                                  سؤال شائع
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0 mt-1"
                        >
                          <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5 text-slate-400" />
                        </motion.div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence mode="wait">
                      {openItems.includes(item.id) && (
                        <motion.div
                          key={`content-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: "auto", 
                            opacity: 1,
                            transition: { 
                              height: { duration: 0.4, ease: "easeOut" },
                              opacity: { duration: 0.3, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: { duration: 0.3, ease: "easeIn" },
                              opacity: { duration: 0.2 }
                            }
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          <CardContent className="pt-0 pr-8 lg:pr-14 px-3 lg:px-6 pb-4 lg:pb-6">
                            <div className="border-t border-slate-200 pt-3 lg:pt-4">
                              <p className="text-xs lg:text-base text-slate-700 leading-relaxed lg:leading-loose">
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
                className="text-center py-8 lg:py-12"
              >
                <div className="flex flex-col items-center space-y-3 lg:space-y-4">
                  <HelpCircle className="h-12 w-12 lg:h-16 lg:w-16 text-slate-300 mx-auto" />
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-600">
                    لم نجد أي نتائج
                  </h3>
                  <p className="text-sm lg:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                    جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر، أو تواصل معنا مباشرة للحصول على المساعدة
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("الكل");
                      }}
                      className="text-xs lg:text-sm"
                    >
                      مسح البحث
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs lg:text-sm bg-primary hover:bg-primary/90"
                    >
                      تواصل معنا
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;