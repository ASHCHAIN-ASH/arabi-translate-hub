import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Phone, 
  Mail, 
  Clock,
  Sparkles,
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
  whatsappLinks?: { number: string; label: string }[];
}

interface ChatBotProps {
  className?: string;
}

const WHATSAPP_NUMBERS = [
  { number: '+967123456789', label: 'الدعم الفني' },
  { number: '+967987654321', label: 'خدمة العملاء' },
  { number: '+967555666777', label: 'الاستشارات الأكاديمية' },
  { number: '+967444333222', label: 'الترجمة المتخصصة' }
];

const QUICK_REPLIES = [
  'خدمات الترجمة',
  'البحث العلمي', 
  'التحليل الإحصائي',
  'الأسعار',
  'طرق الدفع',
  'مدة التنفيذ',
  'ضمان الجودة',
  'شهادات الاعتماد'
];

const KNOWLEDGE_BASE = {
  'خدمات الترجمة': {
    response: 'في وكالة ماستر إيدو باث، نفخر بتقديم خدمات ترجمة احترافية على أعلى مستوى:\n\n🎓 **الترجمة الأكاديمية والعلمية:**\n• ترجمة الأطروحات والرسائل العلمية\n• ترجمة الأوراق البحثية والمؤتمرات\n• ترجمة الكتب والمراجع العلمية\n• مراجعة لغوية متخصصة\n\n⚖️ **الترجمة القانونية:**\n• ترجمة العقود والاتفاقيات\n• ترجمة الوثائق الرسمية\n• ترجمة معتمدة للمحاكم\n• ترجمة القوانين واللوائح\n\n🏥 **الترجمة الطبية:**\n• ترجمة التقارير الطبية\n• ترجمة الأدوية والعلاجات\n• ترجمة البحوث الطبية\n\n💼 **الترجمة التجارية:**\n• ترجمة المراسلات التجارية\n• ترجمة المواقع الإلكترونية\n• ترجمة المحتوى التسويقي\n\n✅ **ضماناتنا:**\n• دقة 99.9% في الترجمة\n• مراجعة من قبل خبراء متخصصين\n• تسليم في الوقت المحدد\n• سرية مطلقة للمعلومات',
    quickReplies: ['احسب تكلفة ترجمتي', 'نماذج أعمال سابقة', 'شهادات الاعتماد'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الترجمة') || n.label.includes('خدمة'))
  },
  'البحث العلمي': {
    response: 'نحن في ماستر إيدو باث نقدم خدمات بحثية شاملة لجميع المراحل الأكاديمية:\n\n📚 **خدمات البحث العلمي:**\n• **كتابة الأطروحات:** من الماجستير إلى الدكتوراه\n• **إعداد مقترحات البحث:** بمنهجية علمية صحيحة\n• **المراجعة النقدية للأدبيات:** تحليل شامل للدراسات السابقة\n• **التحليل الإحصائي:** باستخدام أحدث البرامج\n• **كتابة التقارير العلمية:** بمعايير النشر الدولية\n\n👨‍🎓 **فريق العمل:**\n• أساتذة جامعيون متخصصون\n• حاصلون على درجة الدكتوراه\n• خبرة تزيد عن 10 سنوات\n• نشروا في مجلات محكمة\n\n🏆 **التخصصات المتاحة:**\n• العلوم الإنسانية والاجتماعية\n• العلوم الطبية والصحية\n• الهندسة والتكنولوجيا\n• إدارة الأعمال والاقتصاد\n• التربية وعلم النفس\n\n⭐ **مميزاتنا:**\n• بحوث أصلية 100% خالية من الانتحال\n• التزام بالمواعيد المحددة\n• مراجعة مجانية حتى الوصول للنتيجة المرضية\n• دعم مستمر حتى بعد التسليم',
    quickReplies: ['تكلفة إعداد الرسالة', 'التخصصات المتاحة', 'خطوات العمل'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الاستشارات') || n.label.includes('الدعم'))
  },
  'التحليل الإحصائي': {
    response: 'في ماستر إيدو باث، نوفر لك خدمات التحليل الإحصائي المتقدمة:\n\n📊 **أنواع التحليلات المتاحة:**\n• **التحليل الوصفي:** المتوسطات، الانحرافات، التوزيعات\n• **التحليل الاستنتاجي:** اختبار الفرضيات، تحليل التباين\n• **تحليل الارتباط والانحدار:** العلاقات بين المتغيرات\n• **التحليل العاملي:** تحديد العوامل المؤثرة\n• **تحليل السلاسل الزمنية:** التنبؤ والاتجاهات\n• **التحليل اللامعياري:** للبيانات غير الطبيعية\n\n💻 **البرامج المستخدمة:**\n• **SPSS:** الأكثر استخداماً في البحوث الاجتماعية\n• **R Programming:** للتحليلات المتقدمة والرسوم البيانية\n• **Python:** للتحليل الضخم والذكاء الاصطناعي\n• **Excel:** للتحليلات البسيطة والسريعة\n• **AMOS:** لنمذجة المعادلات الهيكلية\n\n📈 **خدماتنا تشمل:**\n• تنظيف وإعداد البيانات\n• اختيار الاختبار الإحصائي المناسب\n• تنفيذ التحليل بدقة عالية\n• تفسير النتائج بشكل مفصل\n• إنشاء الجداول والرسوم البيانية\n• كتابة تقرير شامل بالنتائج\n\n✨ **لماذا نحن الأفضل؟**\n• خبراء في الإحصاء الحيوي والتطبيقي\n• نتائج دقيقة ومضمونة 100%\n• شرح مبسط للنتائج\n• مراجعة مجانية للتحليل',
    quickReplies: ['أسعار التحليل الإحصائي', 'أمثلة سابقة', 'استشارة مجانية'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الدعم') || n.label.includes('الاستشارات'))
  },
  'الأسعار': {
    response: 'في ماستر إيدو باث، نؤمن بالشفافية في التسعير وقيمة مقابل المال:\n\n💰 **أسعار الترجمة:**\n• الترجمة العامة: 0.04$ - 0.06$ للكلمة\n• الترجمة المتخصصة: 0.06$ - 0.10$ للكلمة\n• الترجمة المعتمدة: 0.08$ - 0.12$ للكلمة\n• المراجعة اللغوية: 0.02$ - 0.04$ للكلمة\n\n📚 **أسعار البحث العلمي:**\n• رسالة الماجستير: 1,500$ - 3,000$\n• أطروحة الدكتوراه: 3,000$ - 6,000$\n• البحوث القصيرة: 300$ - 800$\n• مقترح البحث: 200$ - 500$\n\n📊 **أسعار التحليل الإحصائي:**\n• التحليل البسيط: 100$ - 200$\n• التحليل المتقدم: 200$ - 500$\n• التحليل الشامل: 300$ - 800$\n• الاستشارة الإحصائية: 50$ للساعة\n\n🎁 **عروضنا الخاصة:**\n• خصم 15% للطلاب الجامعيين\n• خصم 20% للكميات الكبيرة (+10,000 كلمة)\n• خصم 10% للعملاء المتكررين\n• عرض خاص: ترجمة + مراجعة بخصم 25%\n\n💳 **مرونة في الدفع:**\n• إمكانية الدفع على دفعات\n• لا توجد رسوم إضافية خفية\n• ضمان استرداد المال في حالة عدم الرضا',
    quickReplies: ['احسب التكلفة الإجمالية', 'طرق الدفع المتاحة', 'العروض الحالية'],
    whatsappLinks: WHATSAPP_NUMBERS
  },
  'طرق الدفع': {
    response: 'نوفر لك في ماستر إيدو باث طرق دفع متنوعة وآمنة لراحتك:\n\n💳 **البطاقات الائتمانية:**\n• فيزا (Visa) - دفع فوري وآمن\n• ماستركارد (MasterCard) - حماية عالية\n• أمريكان إكسبرس - للعملاء المميزين\n\n🏦 **التحويل البنكي:**\n• تحويل محلي داخل اليمن\n• تحويل دولي عبر البنوك العالمية\n• إيصال التحويل خلال 24 ساعة\n\n🌐 **المحافظ الإلكترونية:**\n• PayPal - الأكثر أماناً عالمياً\n• Skrill - سريع ومضمون\n• Western Union - للتحويلات الدولية\n• MoneyGram - متوفر في جميع الدول\n\n📱 **طرق الدفع المحلية:**\n• الدفع النقدي (للعملاء في صنعاء)\n• تحويل عبر الحوالات المحلية\n• دفع عند الاستلام (للخدمات المحلية)\n\n🔒 **ضمانات الأمان:**\n• جميع المعاملات مشفرة بتقنية SSL\n• لا نحتفظ ببيانات بطاقاتك الائتمانية\n• إشعار فوري عند كل عملية دفع\n• إمكانية تتبع حالة الدفع\n\n📋 **سياسة الدفع:**\n• دفعة مقدمة 50% لبدء العمل\n• الباقي عند التسليم والموافقة\n• إمكانية التقسيط للمشاريع الكبيرة\n• فاتورة مفصلة لكل عملية دفع',
    quickReplies: ['تفاصيل التحويل البنكي', 'الدفع بالبايبال', 'فاتورة ضريبية'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('خدمة'))
  },
  'مدة التنفيذ': {
    response: 'في ماستر إيدو باث، نلتزم بمواعيد التسليم ونقدر وقتك الثمين:\n\n⚡ **خدمات الترجمة:**\n• الترجمة السريعة: 2-6 ساعات (حتى 1000 كلمة)\n• الترجمة العادية: 1-3 أيام (حتى 5000 كلمة)\n• الترجمة المتخصصة: 3-7 أيام (تتطلب بحث إضافي)\n• المراجعة اللغوية: 24-48 ساعة\n\n📚 **البحث العلمي:**\n• مقترح البحث: 5-10 أيام\n• رسالة الماجستير: 3-8 أسابيع\n• أطروحة الدكتوراه: 2-6 أشهر\n• البحوث القصيرة: 1-3 أسابيع\n• المراجعة النقدية: 1-2 أسبوع\n\n📊 **التحليل الإحصائي:**\n• التحليل البسيط: 2-4 أيام\n• التحليل المتوسط: 5-10 أيام\n• التحليل المعقد: 1-3 أسابيع\n• كتابة تقرير النتائج: 2-5 أيام إضافية\n\n🚀 **الخدمة العاجلة:**\n• متاحة على مدار 24 ساعة\n• رسوم إضافية 50% من السعر الأساسي\n• تسليم خلال نصف المدة المعتادة\n• أولوية قصوى في التنفيذ\n\n📅 **عوامل تؤثر على المدة:**\n• حجم النص أو المشروع\n• مستوى التخصص المطلوب\n• توفر المراجع والمصادر\n• جودة النص الأصلي\n\n✅ **ضماناتنا:**\n• التسليم في الموعد المحدد أو قبله\n• إشعارات دورية عن سير العمل\n• إمكانية طلب تحديثات في أي وقت\n• تعويض في حالة التأخير بدون مبرر',
    quickReplies: ['الخدمة العاجلة', 'تتبع سير العمل', 'ضمان التسليم'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الدعم'))
  },
  'ضمان الجودة': {
    response: 'في ماستر إيدو باث، الجودة ليست مجرد وعد بل التزام نعيشه يومياً:\n\n🏆 **نظام الجودة الثلاثي:**\n• **المرحلة الأولى:** تنفيذ من قبل خبير متخصص\n• **المرحلة الثانية:** مراجعة من خبير آخر في نفس المجال\n• **المرحلة الثالثة:** فحص نهائي من قبل مدير الجودة\n\n✅ **معايير الجودة:**\n• **الدقة:** 99.9% في المحتوى والمعلومات\n• **الأصالة:** محتوى أصلي 100% خالي من الانتحال\n• **الاتساق:** توحيد المصطلحات والأسلوب\n• **الوضوح:** سهولة القراءة والفهم\n• **الالتزام:** بالمعايير الأكاديمية والمهنية\n\n📜 **شهادات الاعتماد:**\n• ISO 9001:2015 لإدارة الجودة\n• عضوية الجمعية الدولية للمترجمين\n• اعتماد من الجامعات العربية والدولية\n• شهادات من هيئات التعليم العالي\n\n🛡️ **ضماناتنا الحصرية:**\n• **ضمان الرضا:** إعادة العمل مجاناً حتى تحصل على ما تريد\n• **ضمان الجودة:** 100% أو استرداد كامل للمبلغ\n• **ضمان المواعيد:** تعويض في حالة التأخير\n• **ضمان السرية:** اتفاقية عدم إفشاء صارمة\n\n🔍 **أدوات فحص الجودة:**\n• برامج كشف الانتحال المتقدمة\n• أدوات التحقق من القواعد النحوية\n• فحص دقة المصطلحات المتخصصة\n• مراجعة المراجع والاستشهادات\n\n👥 **فريق الجودة:**\n• خبراء بخبرة تزيد عن 15 عاماً\n• حاصلون على أعلى الشهادات الأكاديمية\n• متدربون على أحدث معايير الجودة الدولية\n• متابعة مستمرة للتطورات في كل مجال',
    quickReplies: ['شهادات الاعتماد', 'نماذج جودة سابقة', 'سياسة الاسترداد'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('خدمة') || n.label.includes('الدعم'))
  }
};

const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🌟 مرحباً بك في وكالة ماستر إيدو باث! 🌟\n\nيسعدني جداً أن أكون مساعدك الشخصي اليوم! أنا هنا لأقدم لك:\n\n✨ **معلومات شاملة** عن جميع خدماتنا المتميزة\n🎯 **إجابات دقيقة** على كل استفساراتك\n📞 **توجيه مباشر** للتواصل مع الخبراء المختصين\n💡 **اقتراحات مخصصة** حسب احتياجاتك\n\nنحن متخصصون في:\n• **الترجمة الاحترافية** بجميع أنواعها\n• **البحث العلمي** والأطروحات الأكاديمية  \n• **التحليل الإحصائي** المتقدم\n• **الاستشارات الأكاديمية** المتخصصة\n\nما الذي يمكنني مساعدتك فيه اليوم؟ 😊',
      isBot: true,
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.slice(0, 6)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendNotificationToAdmin = async (userMessage: string, userInfo?: any) => {
    try {
      await supabase.functions.invoke('send-chatbot-notification', {
        body: {
          message: userMessage,
          timestamp: new Date().toISOString(),
          userInfo: userInfo || 'مستخدم غير محدد'
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const getBotResponse = (message: string): Message => {
    const lowerMessage = message.toLowerCase();
    
    // البحث في قاعدة المعرفة
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
      if (lowerMessage.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(lowerMessage) ||
          value.quickReplies?.some(reply => lowerMessage.includes(reply.toLowerCase()))) {
        return {
          id: Date.now().toString(),
          text: value.response,
          isBot: true,
          timestamp: new Date(),
          quickReplies: value.quickReplies,
          whatsappLinks: value.whatsappLinks
        };
      }
    }

    // ردود متنوعة للترحيب
    const greetings = ['مرحب', 'السلام', 'هلا', 'أهلا', 'صباح', 'مساء', 'hello', 'hi'];
    if (greetings.some(greeting => lowerMessage.includes(greeting))) {
      const welcomeMessages = [
        '🌸 أهلاً وسهلاً بك في ماستر إيدو باث! يشرفنا تواصلك معنا.\n\nنحن هنا لنقدم لك أفضل الخدمات الأكاديمية والترجمة المتخصصة. كيف يمكنني مساعدتك اليوم؟',
        '✨ مرحباً بك في عائلة ماستر إيدو باث الكريمة!\n\nسعيد جداً لوجودك معنا. نحن متخصصون في تقديم حلول أكاديمية متكاملة. ما الخدمة التي تبحث عنها؟',
        '🎓 حياك الله في وكالة ماستر إيدو باث!\n\nنحن فخورون بثقتك فينا. خبراؤنا جاهزون لخدمتك في الترجمة والبحث العلمي والتحليل الإحصائي. كيف أقدر أساعدك؟'
      ];
      
      return {
        id: Date.now().toString(),
        text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        isBot: true,
        timestamp: new Date(),
        quickReplies: QUICK_REPLIES.slice(0, 6)
      };
    }

    // ردود متنوعة للشكر
    if (lowerMessage.includes('شكر') || lowerMessage.includes('تسلم') || lowerMessage.includes('ممتاز') || lowerMessage.includes('رائع')) {
      const thankResponses = [
        'العفو! 😊 يسعدني أن أكون في خدمتك دائماً.\n\nهل هناك أي استفسار آخر يمكنني مساعدتك فيه؟',
        '🌟 شكراً لك على كلماتك الطيبة! نحن نسعى دائماً لتقديم الأفضل.\n\nما رأيك في أن نتحدث عن خدمة أخرى قد تحتاجها؟',
        '💫 أشكرك من القلب! رضاك هو هدفنا الأسمى.\n\nدعني أقدم لك المزيد من المساعدة...'
      ];
      
      return {
        id: Date.now().toString(),
        text: thankResponses[Math.floor(Math.random() * thankResponses.length)],
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['خدمات أخرى', 'تواصل مع خبير', 'إنهاء المحادثة']
      };
    }

    // أسئلة حول التواصل
    if (lowerMessage.includes('واتساب') || lowerMessage.includes('رقم') || lowerMessage.includes('تواصل') || lowerMessage.includes('اتصال')) {
      return {
        id: Date.now().toString(),
        text: '📞 ممتاز! لدينا فريق متخصص جاهز للرد عليك فوراً:\n\n🎯 اختر القسم المناسب لاحتياجك وسنوصلك بالخبير المتخصص مباشرة:\n\n👇 انقر على الرقم للتواصل الفوري عبر واتساب:',
        isBot: true,
        timestamp: new Date(),
        whatsappLinks: WHATSAPP_NUMBERS
      };
    }

    // أسئلة حول الوقت والسرعة
    if (lowerMessage.includes('سريع') || lowerMessage.includes('عاجل') || lowerMessage.includes('وقت') || lowerMessage.includes('متى')) {
      return {
        id: Date.now().toString(),
        text: '⚡ نعم، نحن متخصصون في الخدمات السريعة والعاجلة!\n\n🏃‍♂️ **خدماتنا السريعة:**\n• ترجمة عاجلة خلال ساعات\n• استشارات فورية\n• رد خلال 15 دقيقة على واتساب\n• عمل على مدار 24 ساعة\n\nما نوع الخدمة العاجلة التي تحتاجها؟',
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['ترجمة عاجلة', 'استشارة فورية', 'تواصل عاجل'],
        whatsappLinks: WHATSAPP_NUMBERS.slice(0, 2)
      };
    }

    // أسئلة حول الجودة والخبرة
    if (lowerMessage.includes('جود') || lowerMessage.includes('خبر') || lowerMessage.includes('كيف') || lowerMessage.includes('مؤهل')) {
      return {
        id: Date.now().toString(),
        text: '🏆 ممتاز سؤالك! الجودة هي أساس عملنا في ماستر إيدو باث:\n\n⭐ **مميزاتنا:**\n• فريق من الدكاترة والخبراء\n• خبرة تزيد عن 10 سنوات\n• شهادات اعتماد دولية\n• آلاف العملاء الراضين\n• ضمان 100% أو استرداد المال\n\n🎯 نحن لسنا مجرد خدمة، بل شريك نجاحك الأكاديمي!',
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['شهادات الاعتماد', 'نماذج سابقة', 'آراء العملاء'],
        whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الدعم'))
      };
    }

    // رد افتراضي ذكي
    const defaultResponses = [
      '🤔 سؤال مثير للاهتمام! دعني أفهم احتياجك بشكل أفضل.\n\nيمكنك اختيار من الخيارات أدناه أو توضيح ما تبحث عنه بكلمات أخرى:',
      '💡 أعتذر إذا لم أفهم تماماً ما تقصده. نحن هنا لمساعدتك!\n\nحاول اختيار من الخيارات التالية أو أعد صياغة سؤالك:',
      '🔍 يبدو أن لديك استفسار مهم! دعني أساعدك بطريقة أفضل.\n\nاختر مما يلي أو تواصل مباشرة مع خبرائنا:'
    ];
    
    return {
      id: Date.now().toString(),
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      isBot: true,
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.slice(0, 8),
      whatsappLinks: WHATSAPP_NUMBERS.slice(0, 2)
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // إرسال إشعار للإدارة
    await sendNotificationToAdmin(textToSend);

    // محاكاة تأخير في الرد
    setTimeout(() => {
      const botResponse = getBotResponse(textToSend);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const openWhatsApp = (number: string) => {
    const message = `السلام عليكم، أتواصل معكم من خلال موقع وكالة ماستر إيدو باث بخصوص الخدمات المتاحة.`;
    const url = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    toast({
      title: "تم فتح واتساب",
      description: "سيتم توجيهك إلى تطبيق واتساب للتواصل المباشر",
      duration: 3000
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) {
    return (
      <motion.div 
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-200" />
          </motion.div>
        </Button>
        
        {/* نبضة للإشعار */}
        <motion.div
          className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity 
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`fixed bottom-4 right-4 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: 0,
        height: isMinimized ? '60px' : '650px'
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-[90vw] max-w-sm sm:w-96 sm:max-w-md lg:max-w-lg h-full shadow-2xl border border-border/50 bg-background/95 backdrop-blur-sm">
        {/* رأس الشات */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Bot className="h-8 w-8" />
              <motion.div
                className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">مساعد ماستر إيدو</h3>
              <p className="text-xs opacity-90">متاح دائماً لخدمتك</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-0 h-[500px] sm:h-[520px] flex flex-col">
                {/* منطقة الرسائل */}
                <ScrollArea className="flex-1 p-4" dir="rtl">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[90%] sm:max-w-[85%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                          <div 
                            className={`rounded-2xl p-3 shadow-sm ${
                              message.isBot 
                                ? 'bg-muted text-foreground rounded-tr-md' 
                                : 'bg-primary text-primary-foreground rounded-tl-md'
                            }`}
                          >
                            <p className="whitespace-pre-line text-sm leading-relaxed">
                              {message.text}
                            </p>
                            
                            {/* روابط واتساب */}
                            {message.whatsappLinks && message.whatsappLinks.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.whatsappLinks.map((link, index) => (
                                  <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => openWhatsApp(link.number)}
                                    className="flex items-center gap-2 w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors duration-200"
                                  >
                                    <Phone className="h-4 w-4" />
                                    <span>{link.label}</span>
                                    <span className="mr-auto font-mono text-xs">{link.number}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </motion.button>
                                ))}
                              </div>
                            )}
                            
                            {/* الردود السريعة */}
                            {message.quickReplies && message.quickReplies.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                                {message.quickReplies.map((reply, index) => (
                                  <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSendMessage(reply)}
                                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 border border-primary/20 leading-tight"
                                  >
                                    {reply}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-1 mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
                            {message.isBot ? <Bot className="h-3 w-3 text-primary" /> : <User className="h-3 w-3 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* مؤشر الكتابة */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted rounded-2xl rounded-tr-md p-3 shadow-sm max-w-[85%]">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    delay: i * 0.2 
                                  }}
                                  className="w-2 h-2 bg-primary rounded-full"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">يكتب...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* منطقة الإدخال */}
                <div className="p-4 border-t border-border/50 bg-background/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 rounded-full border-border/50 focus:border-primary transition-colors"
                      dir="rtl"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </div>
                  
                  {/* شريط الحالة */}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                      </motion.div>
                      <span>مدعوم بالذكاء الاصطناعي</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>متاح 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ChatBot;