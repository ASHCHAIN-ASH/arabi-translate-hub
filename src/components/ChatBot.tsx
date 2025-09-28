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
    response: 'نقدم خدمات ترجمة متخصصة في:\n• الترجمة الأكاديمية والعلمية\n• الترجمة القانونية والطبية\n• الترجمة التقنية والتجارية\n• ترجمة المواقع والوسائط المتعددة\n\nجميع خدماتنا معتمدة ومضمونة الجودة 100%',
    quickReplies: ['أسعار الترجمة', 'مدة التنفيذ', 'نماذج أعمال سابقة'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الترجمة') || n.label.includes('خدمة'))
  },
  'البحث العلمي': {
    response: 'خدمات البحث العلمي المتكاملة:\n• إعداد وكتابة الأبحاث العلمية\n• المراجعة الأكاديمية واللغوية\n• التحليل الإحصائي للبيانات\n• النشر في المجلات المحكمة\n• الاستشارات الأكاديمية\n\nفريق من الخبراء الأكاديميين المعتمدين',
    quickReplies: ['تكلفة البحث', 'مدة الإنجاز', 'التخصصات المتاحة'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الاستشارات') || n.label.includes('الدعم'))
  },
  'التحليل الإحصائي': {
    response: 'خدمات التحليل الإحصائي الاحترافية:\n• التحليل الوصفي والاستنتاجي\n• استخدام SPSS, R, Python\n• تفسير النتائج وكتابة التقارير\n• التصور البياني للبيانات\n• الاستشارات الإحصائية\n\nنتائج دقيقة ومضمونة 100%',
    quickReplies: ['أسعار التحليل', 'البرامج المستخدمة', 'أمثلة سابقة'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الدعم') || n.label.includes('الاستشارات'))
  },
  'الأسعار': {
    response: 'أسعارنا تنافسية ومرنة:\n• الترجمة: من 0.05$ للكلمة\n• البحث العلمي: حسب التخصص والحجم\n• التحليل الإحصائي: حسب تعقيد البيانات\n• خصومات للكميات الكبيرة\n• عروض خاصة للطلاب\n\n💳 طرق دفع متعددة ومرنة',
    quickReplies: ['طرق الدفع', 'خصومات متاحة', 'عرض سعر مخصص'],
    whatsappLinks: WHATSAPP_NUMBERS
  },
  'طرق الدفع': {
    response: 'طرق دفع آمنة ومتنوعة:\n• التحويل البنكي\n• فيزا وماستركارد\n• PayPal\n• التحويل عبر ويسترن يونيون\n• الدفع عند الاستلام (للعملاء المحليين)\n\n🔒 جميع المعاملات مشفرة وآمنة',
    quickReplies: ['تفاصيل التحويل', 'الدفع الآمن', 'فاتورة مفصلة'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('خدمة'))
  },
  'مدة التنفيذ': {
    response: 'مدة التنفيذ حسب نوع الخدمة:\n• الترجمة: 24-72 ساعة\n• البحث العلمي: 7-21 يوم\n• التحليل الإحصائي: 3-7 أيام\n• المراجعة اللغوية: 24-48 ساعة\n\n⚡ خدمة عاجلة متاحة مقابل رسوم إضافية',
    quickReplies: ['خدمة عاجلة', 'تتبع الطلب', 'ضمان التسليم'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('الدعم'))
  },
  'ضمان الجودة': {
    response: 'ضمانات الجودة لدينا:\n• مراجعة من 3 مستويات\n• ضمان الجودة 100%\n• إعادة العمل مجاناً في حالة عدم الرضا\n• خبراء معتمدون ومتخصصون\n• سرية تامة للمعلومات\n\n🏆 شهادات جودة دولية',
    quickReplies: ['الشهادات', 'سياسة الاسترداد', 'أمثلة الجودة'],
    whatsappLinks: WHATSAPP_NUMBERS.filter(n => n.label.includes('خدمة') || n.label.includes('الدعم'))
  }
};

const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً وسهلاً بك في وكالة ماستر إيدو باث! 👋\n\nأنا مساعدك الذكي، هنا لمساعدتك في:\n• الحصول على معلومات عن خدماتنا\n• الإجابة على استفساراتك\n• توجيهك للتواصل المناسب\n\nكيف يمكنني مساعدتك اليوم؟',
      isBot: true,
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.slice(0, 4)
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

    // ردود افتراضية للكلمات المفتاحية
    if (lowerMessage.includes('مرحب') || lowerMessage.includes('السلام') || lowerMessage.includes('هلا')) {
      return {
        id: Date.now().toString(),
        text: 'أهلاً وسهلاً بك! 🌟\nأنا هنا لمساعدتك في جميع استفساراتك حول خدماتنا المتميزة.\nما الذي تود معرفته؟',
        isBot: true,
        timestamp: new Date(),
        quickReplies: QUICK_REPLIES.slice(0, 4)
      };
    }

    if (lowerMessage.includes('شكر') || lowerMessage.includes('تسلم')) {
      return {
        id: Date.now().toString(),
        text: 'العفو! سعيد بخدمتك 😊\nهل تحتاج لأي مساعدة أخرى؟',
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['نعم', 'تواصل مع الإدارة', 'إنهاء المحادثة']
      };
    }

    if (lowerMessage.includes('واتساب') || lowerMessage.includes('رقم') || lowerMessage.includes('تواصل')) {
      return {
        id: Date.now().toString(),
        text: 'يمكنك التواصل معنا عبر واتساب من خلال الأرقام التالية:\n\n👈 اختر القسم المناسب لك:',
        isBot: true,
        timestamp: new Date(),
        whatsappLinks: WHATSAPP_NUMBERS
      };
    }

    // رد افتراضي
    return {
      id: Date.now().toString(),
      text: 'شكراً لك على استفسارك! 🤔\n\nيبدو أنني لم أفهم طلبك بشكل دقيق. يمكنك:\n• اختيار من الخيارات السريعة أدناه\n• التواصل مباشرة مع فريقنا المتخصص\n• إعادة صياغة سؤالك بطريقة أخرى',
      isBot: true,
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.slice(0, 6),
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
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: 0,
        height: isMinimized ? '60px' : '600px'
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-80 sm:w-96 h-full shadow-2xl border border-border/50 bg-background/95 backdrop-blur-sm">
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
              <CardContent className="p-0 h-96 flex flex-col">
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
                        <div className={`max-w-[85%] ${message.isBot ? 'order-2' : 'order-1'}`}>
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
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.quickReplies.map((reply, index) => (
                                  <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSendMessage(reply)}
                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs font-medium transition-colors duration-200 border border-primary/20"
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