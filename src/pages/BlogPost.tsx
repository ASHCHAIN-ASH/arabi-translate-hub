import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Calendar, User, Eye, Heart, Share2, Tag, Clock, ArrowLeft, Home, MessageCircle, BookmarkPlus, Copy, ThumbsUp, Facebook, Twitter, Linkedin, Star, TrendingUp, Users, Award, CheckCircle, Send, Smile, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Import blog images
import academicTranslationImg from "@/assets/blog-academic-translation.jpg";
import medicalTranslationImg from "@/assets/blog-medical-translation.jpg";
import legalTranslationImg from "@/assets/blog-legal-translation.jpg";
import technicalTranslationImg from "@/assets/blog-technical-translation.jpg";
import researchMethodsImg from "@/assets/blog-research-methods.jpg";
import businessTranslationImg from "@/assets/blog-business-translation.jpg";
import academicWritingImg from "@/assets/blog-academic-writing.jpg";
import journalPublicationImg from "@/assets/blog-journal-publication.jpg";
import statisticalAnalysisImg from "@/assets/blog-statistical-analysis.jpg";
import literatureReviewImg from "@/assets/blog-literature-review.jpg";
import thesisDefenseImg from "@/assets/blog-thesis-defense.jpg";
import plagiarismCheckImg from "@/assets/blog-plagiarism-check.jpg";
import academicFormattingImg from "@/assets/blog-academic-formatting.jpg";
import academicConferencesImg from "@/assets/blog-academic-conferences.jpg";
import aiTranslationImg from "@/assets/blog-ai-translation.jpg";

const BlogPost = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const blogPosts = [
    {
      id: 1,
      title: "دليل شامل للترجمة الأكاديمية: معايير الجودة العالمية والممارسات المهنية",
      excerpt: "تعرف على أحدث معايير الترجمة الأكاديمية المتبعة في الجامعات العالمية وكيفية ضمان الدقة العلمية والمصطلحية في النصوص الأكاديمية المتخصصة.",
      author: "د. محمد الأكاديمي",
      date: "2024-01-20",
      category: "ترجمة أكاديمية",
      readTime: "12 دقيقة",
      image: academicTranslationImg,
      tags: ["ترجمة", "أكاديمي", "جودة", "معايير"],
      views: 2850,
      likes: 187,
      rating: 4.8,
      difficulty: "متقدم",
      content: `
        <p>تعتبر الترجمة الأكاديمية من أهم التحديات التي تواجه الباحثين والمترجمين المتخصصين في العصر الحديث. فمع تزايد الحاجة لتبادل المعرفة العلمية عبر الحدود اللغوية والثقافية، أصبح من الضروري وضع معايير دقيقة تضمان جودة الترجمة الأكاديمية وتحافظ على الدقة العلمية للمحتوى المترجم.</p>

        <h2>أهمية الترجمة الأكاديمية في العصر الحديث</h2>
        <p>في عالم يشهد تطوراً علمياً متسارعاً، تلعب الترجمة الأكاديمية دوراً محورياً في نشر البحوث العلمية وتسهيل التعاون البحثي بين الجامعات العالمية.</p>

        <h2>معايير الجودة في الترجمة الأكاديمية</h2>
        <p>لضمان تحقيق أعلى معايير الجودة في الترجمة الأكاديمية، يجب التركيز على الدقة المصطلحية والحفاظ على الأسلوب الأكاديمي.</p>

        <h2>الخلاصة</h2>
        <p>الترجمة الأكاديمية مهارة متخصصة تتطلب مزيجاً من الخبرة اللغوية والمعرفة العلمية.</p>
      `
    },
    {
      id: 2,
      title: "الترجمة الطبية المتخصصة: التحديات والحلول المبتكرة",
      excerpt: "استكشف عالم الترجمة الطبية وتعرف على أحدث التقنيات والممارسات المعتمدة عالمياً لضمان دقة ترجمة النصوص الطبية والصيدلانية.",
      author: "د. سارة الطبية",
      date: "2024-01-18",
      category: "ترجمة طبية",
      readTime: "10 دقائق",
      image: medicalTranslationImg,
      tags: ["طب", "ترجمة", "تخصص", "دقة"],
      views: 1920,
      likes: 156,
      rating: 4.6,
      difficulty: "متقدم",
      content: `
        <p>تعد الترجمة الطبية من أكثر أنواع الترجمة تعقيداً ودقة، حيث تتطلب فهماً عميقاً للمصطلحات الطبية والعلمية المتخصصة.</p>

        <h2>أهمية الترجمة الطبية</h2>
        <p>في عالم الطب، الدقة هي مسألة حياة أو موت. لذلك تتطلب الترجمة الطبية مستوى عالياً من الدقة والتخصص.</p>

        <h2>التحديات الأساسية</h2>
        <p>تواجه الترجمة الطبية تحديات عديدة منها المصطلحات المعقدة والتطورات العلمية المستمرة.</p>
      `
    },
    {
      id: 3,
      title: "الترجمة القانونية: دليل المترجم المحترف",
      excerpt: "تعلم أصول الترجمة القانونية وأهم المبادئ والقواعد التي يجب اتباعها لضمان الدقة القانونية واللغوية في الوثائق الرسمية.",
      author: "أ. أحمد القانوني",
      date: "2024-01-15",
      category: "ترجمة قانونية",
      readTime: "15 دقيقة",
      image: legalTranslationImg,
      tags: ["قانون", "وثائق", "ترجمة", "رسمي"],
      views: 2100,
      likes: 189,
      rating: 4.7,
      difficulty: "متوسط",
      content: `
        <p>الترجمة القانونية تتطلب دقة متناهية وفهماً عميقاً للأنظمة القانونية في كلا اللغتين المصدر والهدف.</p>

        <h2>خصائص الترجمة القانونية</h2>
        <p>تتميز الترجمة القانونية بطبيعتها الحساسة والحاجة إلى الدقة المطلقة في نقل المعاني القانونية.</p>
      `
    },
    {
      id: 4,
      title: "الترجمة التقنية: تقنيات حديثة ومهارات متقدمة",
      excerpt: "اكتشف أسرار الترجمة التقنية الناجحة وتعرف على أهم الأدوات والتقنيات المستخدمة في ترجمة النصوص التقنية والهندسية.",
      author: "م. خالد التقني",
      date: "2024-01-12",
      category: "ترجمة تقنية",
      readTime: "11 دقيقة",
      image: technicalTranslationImg,
      tags: ["تقنية", "هندسة", "أدوات", "تخصص"],
      views: 1750,
      likes: 134,
      rating: 4.5,
      difficulty: "متوسط",
      content: `
        <p>الترجمة التقنية تتطلب فهماً عميقاً للمفاهيم التقنية والهندسية بالإضافة إلى المهارات اللغوية المتقدمة.</p>

        <h2>مجالات الترجمة التقنية</h2>
        <p>تشمل الترجمة التقنية مجالات متنوعة مثل الهندسة وتكنولوجيا المعلومات والطيران.</p>
      `
    },
    {
      id: 5,
      title: "منهجيات البحث العلمي الحديثة: دليل الباحث المتميز",
      excerpt: "تعرف على أحدث منهجيات البحث العلمي المعتمدة في الجامعات العالمية وكيفية تطبيقها لإنتاج بحوث علمية متميزة.",
      author: "د. فاطمة الباحثة",
      date: "2024-01-10",
      category: "بحث علمي",
      readTime: "18 دقيقة",
      image: researchMethodsImg,
      tags: ["بحث", "منهجية", "علمي", "جامعات"],
      views: 3200,
      likes: 287,
      rating: 4.9,
      difficulty: "متقدم",
      content: `
        <p>منهجيات البحث العلمي هي الأساس الذي يقوم عليه أي بحث علمي جيد ومعتمد أكاديمياً.</p>

        <h2>أنواع مناهج البحث</h2>
        <p>تتنوع مناهج البحث العلمي بين الكمية والنوعية والمختلطة، ولكل منها مميزاتها وتطبيقاتها.</p>
      `
    },
    {
      id: 6,
      title: "الترجمة التجارية: استراتيجيات النجاح في الأسواق العالمية",
      excerpt: "اكتشف كيفية إتقان الترجمة التجارية وأهم الاستراتيجيات المطلوبة للنجاح في ترجمة المحتوى التجاري والتسويقي.",
      author: "أ. نور التجارية",
      date: "2024-01-08",
      category: "ترجمة تجارية",
      readTime: "9 دقائق",
      image: businessTranslationImg,
      tags: ["تجارة", "أعمال", "تسويق", "عالمي"],
      views: 1650,
      likes: 128,
      rating: 4.4,
      difficulty: "مبتدئ",
      content: `
        <p>الترجمة التجارية تتطلب فهماً عميقاً للثقافة التجارية والممارسات التسويقية في الأسواق المختلفة.</p>

        <h2>خصائص الترجمة التجارية</h2>
        <p>تتميز الترجمة التجارية بالحاجة إلى مراعاة الجوانب الثقافية والتسويقية للجمهور المستهدف.</p>
      `
    },
    {
      id: 7,
      title: "فن الكتابة الأكاديمية: من الفكرة إلى النشر",
      excerpt: "تعلم أساسيات الكتابة الأكاديمية المتميزة وكيفية تطوير مهاراتك في كتابة البحوث والمقالات العلمية بمعايير عالمية.",
      author: "د. علي الكاتب",
      date: "2024-01-05",
      category: "كتابة أكاديمية",
      readTime: "14 دقيقة",
      image: academicWritingImg,
      tags: ["كتابة", "أكاديمي", "بحث", "نشر"],
      views: 2800,
      likes: 234,
      rating: 4.8,
      difficulty: "متوسط",
      content: `
        <p>الكتابة الأكاديمية فن يتطلب مهارات خاصة في التعبير العلمي والأسلوب الأكاديمي المتميز.</p>

        <h2>عناصر الكتابة الأكاديمية</h2>
        <p>تشمل الكتابة الأكاديمية الوضوح والدقة والموضوعية والاستناد إلى المصادر الموثوقة.</p>
      `
    },
    {
      id: 8,
      title: "النشر في المجلات العلمية المحكمة: خطوات النجاح",
      excerpt: "دليل شامل للنشر في المجلات العلمية المحكمة مع نصائح عملية لزيادة فرص قبول بحثك وتجنب الأخطاء الشائعة.",
      author: "د. مريم الناشرة",
      date: "2024-01-03",
      category: "نشر علمي",
      readTime: "16 دقيقة",
      image: journalPublicationImg,
      tags: ["نشر", "مجلات", "علمي", "محكم"],
      views: 2950,
      likes: 278,
      rating: 4.7,
      difficulty: "متقدم",
      content: `
        <p>النشر في المجلات العلمية المحكمة يتطلب إعداداً دقيقاً ومعرفة عميقة بمعايير النشر العالمية.</p>

        <h2>خطوات النشر العلمي</h2>
        <p>تبدأ عملية النشر العلمي باختيار المجلة المناسبة وتنتهي بمتابعة عملية التحكيم والنشر.</p>
      `
    },
    {
      id: 9,
      title: "التحليل الإحصائي للبحوث: أدوات وتقنيات متقدمة",
      excerpt: "تعرف على أهم أدوات وتقنيات التحليل الإحصائي المستخدمة في البحوث العلمية وكيفية تطبيقها بشكل صحيح.",
      author: "د. عبدالله الإحصائي",
      date: "2024-01-01",
      category: "تحليل إحصائي",
      readTime: "13 دقيقة",
      image: statisticalAnalysisImg,
      tags: ["إحصاء", "تحليل", "بيانات", "SPSS"],
      views: 2200,
      likes: 195,
      rating: 4.6,
      difficulty: "متقدم",
      content: `
        <p>التحليل الإحصائي يشكل العمود الفقري للبحث العلمي الكمي ويتطلب فهماً عميقاً للطرق الإحصائية.</p>

        <h2>أدوات التحليل الإحصائي</h2>
        <p>تتنوع أدوات التحليل الإحصائي من البرامج البسيطة إلى الأنظمة المتقدمة مثل SPSS وR.</p>
      `
    },
    {
      id: 10,
      title: "مراجعة الأدبيات: دليل الباحث المحترف",
      excerpt: "تعلم كيفية إجراء مراجعة أدبيات شاملة ومنهجية للبحوث السابقة وتحديد الفجوات البحثية بطريقة علمية.",
      author: "د. هند المراجعة",
      date: "2023-12-28",
      category: "مراجعة أدبيات",
      readTime: "17 دقيقة",
      image: literatureReviewImg,
      tags: ["أدبيات", "مراجعة", "بحث", "منهجية"],
      views: 2650,
      likes: 221,
      rating: 4.5,
      difficulty: "متوسط",
      content: `
        <p>مراجعة الأدبيات جزء أساسي من أي بحث علمي وتتطلب منهجية واضحة ودقة في التحليل.</p>

        <h2>خطوات مراجعة الأدبيات</h2>
        <p>تبدأ مراجعة الأدبيات بتحديد المصادر المناسبة وتنتهي بتحليل شامل للدراسات السابقة.</p>
      `
    },
    {
      id: 11,
      title: "الدفاع عن الرسالة: استراتيجيات النجاح والتميز",
      excerpt: "نصائح وإرشادات عملية لإعداد دفاع ناجح عن رسالة الماجستير أو الدكتوراه مع تقنيات العرض الفعال.",
      author: "د. يوسف المشرف",
      date: "2023-12-25",
      category: "دفاع رسالة",
      readTime: "12 دقيقة",
      image: thesisDefenseImg,
      tags: ["دفاع", "رسالة", "ماجستير", "دكتوراه"],
      views: 3100,
      likes: 298,
      rating: 4.9,
      difficulty: "متقدم",
      content: `
        <p>الدفاع عن الرسالة محطة مهمة في المسيرة الأكاديمية وتتطلب إعداداً جيداً وثقة بالنفس.</p>

        <h2>التحضير للدفاع</h2>
        <p>يشمل التحضير للدفاع مراجعة شاملة للرسالة وإعداد العرض التقديمي والتدرب على الإجابة على الأسئلة.</p>
      `
    },
    {
      id: 12,
      title: "فحص الانتحال الأكاديمي: أدوات وتقنيات الكشف",
      excerpt: "تعرف على أهمية فحص الانتحال الأكاديمي وأحدث الأدوات والتقنيات المستخدمة لضمان الأصالة العلمية.",
      author: "د. ليلى النزاهة",
      date: "2023-12-22",
      category: "نزاهة أكاديمية",
      readTime: "8 دقائق",
      image: plagiarismCheckImg,
      tags: ["انتحال", "نزاهة", "فحص", "أصالة"],
      views: 1800,
      likes: 167,
      rating: 4.4,
      difficulty: "مبتدئ",
      content: `
        <p>فحص الانتحال الأكاديمي ضرورة أساسية لضمان النزاهة العلمية والحفاظ على جودة البحث العلمي.</p>

        <h2>أدوات فحص الانتحال</h2>
        <p>تتنوع أدوات فحص الانتحال من البرامج المجانية إلى الأنظمة المتقدمة المستخدمة في الجامعات.</p>
      `
    },
    {
      id: 13,
      title: "التنسيق الأكاديمي: معايير APA وMLA وشيكاغو",
      excerpt: "دليل شامل لأهم أنظمة التنسيق الأكاديمي العالمية مع أمثلة عملية وقواعد التطبيق الصحيح.",
      author: "أ. رانيا المنسقة",
      date: "2023-12-20",
      category: "تنسيق أكاديمي",
      readTime: "11 دقيقة",
      image: academicFormattingImg,
      tags: ["تنسيق", "APA", "MLA", "أكاديمي"],
      views: 2400,
      likes: 201,
      rating: 4.3,
      difficulty: "مبتدئ",
      content: `
        <p>التنسيق الأكاديمي جزء لا يتجزأ من البحث العلمي ويتطلب دقة في تطبيق القواعد والمعايير.</p>

        <h2>أنظمة التنسيق الأكاديمي</h2>
        <p>تختلف أنظمة التنسيق الأكاديمي حسب التخصص والمجال العلمي، وأشهرها APA وMLA وشيكاغو.</p>
      `
    },
    {
      id: 14,
      title: "المؤتمرات الأكاديمية: فرص التطوير والتشبيك المهني",
      excerpt: "اكتشف أهمية المشاركة في المؤتمرات الأكاديمية وكيفية الاستفادة القصوى من هذه الفرص للتطوير المهني.",
      author: "د. سامي المؤتمرات",
      date: "2023-12-18",
      category: "مؤتمرات أكاديمية",
      readTime: "10 دقائق",
      image: academicConferencesImg,
      tags: ["مؤتمرات", "تطوير", "تشبيك", "أكاديمي"],
      views: 1950,
      likes: 178,
      rating: 4.2,
      difficulty: "مبتدئ",
      content: `
        <p>المؤتمرات الأكاديمية منصة مهمة لتبادل المعرفة والخبرات والتطوير المهني للباحثين والأكاديميين.</p>

        <h2>فوائد المشاركة في المؤتمرات</h2>
        <p>تشمل فوائد المشاركة في المؤتمرات التطوير المهني وبناء الشبكات العلمية وعرض البحوث.</p>
      `
    },
    {
      id: 15,
      title: "الذكاء الاصطناعي في الترجمة: المستقبل والتحديات",
      excerpt: "استكشف دور الذكاء الاصطناعي في مجال الترجمة والتطورات المستقبلية المتوقعة مع التحديات والفرص الجديدة.",
      author: "د. تامر التقنية",
      date: "2023-12-15",
      category: "ذكاء اصطناعي",
      readTime: "13 دقيقة",
      image: aiTranslationImg,
      tags: ["ذكاء اصطناعي", "ترجمة", "تقنية", "مستقبل"],
      views: 3500,
      likes: 342,
      rating: 4.8,
      difficulty: "متوسط",
      content: `
        <p>الذكاء الاصطناعي يحدث ثورة في مجال الترجمة ويفتح آفاقاً جديدة للدقة والسرعة في الترجمة.</p>

        <h2>تطبيقات الذكاء الاصطناعي</h2>
        <p>تشمل تطبيقات الذكاء الاصطناعي في الترجمة الترجمة الآلية والمساعدة في الترجمة وتحليل النصوص.</p>
      `
    }
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || "1")) || blogPosts[0];
  
  useEffect(() => {
    setLikes(post.likes);
    setRating(post.rating);
  }, [post]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "تم إلغاء الحفظ" : "تم حفظ المقال",
      description: isBookmarked ? "تم إزالة المقال من قائمة المحفوظات" : "تم إضافة المقال لقائمة المحفوظات"
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = "";
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط المقال إلى الحافظة"
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleRating = (newRating: number) => {
    setUserRating(newRating);
    toast({
      title: "شكراً لتقييمك",
      description: `تم تسجيل تقييمك ${newRating} نجوم للمقال`
    });
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      toast({
        title: "تم إرسال التعليق",
        description: "شكراً لك! سيتم مراجعة تعليقك ونشره قريباً"
      });
      setComment("");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 border-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'متقدم': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 origin-[0%] z-50"
        style={{ scaleX }}
      />
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">المدونة</Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {post.category}
                </Badge>
                <Badge className={`border ${getDifficultyColor(post.difficulty)}`}>
                  مستوى {post.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              {/* Author & Meta Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {post.author.split(' ')[1]?.charAt(0) || 'د'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(post.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-primary font-medium">{post.readTime}</span>
                </div>
              </div>

              {/* Stats & Rating */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-5 w-5 text-slate-400" />
                    <span className="font-semibold">{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                    <span className="font-semibold">{likes}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-slate-400">(التقييم)</span>
                </div>
              </div>
            </div>

            <div className="relative mb-12">
              <motion.img 
                src={post.image} 
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    
                    {/* Article Actions */}
                    <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Button
                          variant={isLiked ? "default" : "outline"}
                          size="sm"
                          onClick={handleLike}
                          className="flex items-center gap-2"
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                          إعجاب ({likes})
                        </Button>
                        
                        <Button
                          variant={isBookmarked ? "default" : "outline"}
                          size="sm"
                          onClick={handleBookmark}
                          className="flex items-center gap-2"
                        >
                          <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          حفظ
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">شارك:</span>
                        <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div 
                      className="prose prose-lg max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-strong:text-slate-800 prose-a:text-primary hover:prose-a:text-primary/80"
                      style={{ direction: 'rtl' }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    <Separator className="my-8" />
                    
                    {/* Tags */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        الكلمات المفتاحية:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-white transition-colors cursor-pointer px-3 py-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-600" />
                        قيم هذا المقال:
                      </h4>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="transition-colors"
                          >
                            <Star 
                              className={`h-6 w-6 ${
                                star <= userRating 
                                  ? 'text-amber-500 fill-current' 
                                  : 'text-slate-300 hover:text-amber-400'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="mr-3 text-sm text-slate-600">
                          {userRating > 0 ? `تقييمك: ${userRating} نجوم` : 'اختر تقييمك'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mt-8">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-primary" />
                      التعليقات والمناقشة
                    </h3>
                    
                    {/* Comment Form */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-slate-700 mb-4">اترك تعليقك:</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="اسمك" className="bg-white" />
                          <Input placeholder="بريدك الإلكتروني" type="email" className="bg-white" />
                        </div>
                        <Textarea
                          placeholder="اكتب تعليقك هنا..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[120px] bg-white"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Smile className="h-4 w-4" />
                            <span>كن محترماً في تعليقك</span>
                          </div>
                          <Button onClick={handleCommentSubmit} className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            إرسال التعليق
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Sample Comments */}
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white">أ</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-700">أحمد محمود</span>
                              <span className="text-sm text-slate-500">منذ يومين</span>
                            </div>
                            <p className="text-slate-600 mb-3">مقال ممتاز ومفيد جداً! استفدت كثيراً من المعلومات المقدمة خاصة في الجزء المتعلق بمعايير الجودة.</p>
                            <div className="flex items-center gap-3">
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
                                <ThumbsUp className="h-4 w-4 ml-1" />
                                5 إعجابات
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
                                رد
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-slate-200 pb-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white">د</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-700">د. فاطمة الزهراء</span>
                              <span className="text-sm text-slate-500">منذ 3 أيام</span>
                              <Badge variant="outline" className="text-xs">كاتبة أكاديمية</Badge>
                            </div>
                            <p className="text-slate-600 mb-3">شكراً لك على هذا المحتوى القيم. كمتخصصة في المجال، أؤكد على دقة المعلومات المطروحة وأهميتها للمترجمين المبتدئين.</p>
                            <div className="flex items-center gap-3">
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
                                <ThumbsUp className="h-4 w-4 ml-1" />
                                12 إعجاب
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
                                رد
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-6 sticky top-6"
              >
                {/* Author Info */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                      {post.author.split(' ')[1]?.charAt(0) || 'د'}
                    </div>
                    <h4 className="font-bold text-lg mb-2">{post.author}</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      خبير في مجال {post.category} مع خبرة تزيد عن 15 عاماً في التعليم الأكاديمي والترجمة المتخصصة.
                    </p>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="text-center">
                        <div className="font-bold text-primary">150+</div>
                        <div className="text-xs text-slate-500">مقال</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary">50K+</div>
                        <div className="text-xs text-slate-500">متابع</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary">4.8</div>
                        <div className="text-xs text-slate-500">تقييم</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 ml-2" />
                      متابعة الكاتب
                    </Button>
                  </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="shadow-xl border-0">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      محتويات المقال
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="#intro" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        مقدمة
                      </a></li>
                      <li><a href="#importance" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        أهمية الترجمة الأكاديمية
                      </a></li>
                      <li><a href="#standards" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        معايير الجودة
                      </a></li>
                      <li><a href="#challenges" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        التحديات الشائعة
                      </a></li>
                      <li><a href="#best-practices" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        أفضل الممارسات
                      </a></li>
                      <li><a href="#conclusion" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        الخلاصة
                      </a></li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Article Stats */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      إحصائيات المقال
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">المشاهدات</span>
                        <span className="font-bold text-primary">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">الإعجابات</span>
                        <span className="font-bold text-primary">{likes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">المشاركات</span>
                        <span className="font-bold text-primary">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">التقييم</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-primary">{rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card className="shadow-xl border-0">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      مقالات ذات صلة
                    </h4>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link 
                          key={relatedPost.id}
                          to={`/blog/${relatedPost.id}`}
                          className="block group"
                        >
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <img 
                              src={relatedPost.image} 
                              alt={relatedPost.title}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {relatedPost.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500">{relatedPost.readTime}</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span className="text-xs text-slate-500">{(relatedPost.views/1000).toFixed(1)}K</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-primary/10 to-blue-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">اشترك في النشرة الإخبارية</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      احصل على أحدث المقالات والموارد التعليمية مباشرة في بريدك الإلكتروني
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="بريدك الإلكتروني" type="email" />
                      <Button className="w-full">
                        اشتراك مجاني
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة للمدونة
              </Link>
            </Button>
            
            <div className="flex gap-3">
              {parseInt(id || "1") > 1 && (
                <Button variant="outline" asChild>
                  <Link to={`/blog/${parseInt(id || "1") - 1}`}>
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    المقال السابق
                  </Link>
                </Button>
              )}
              
              {parseInt(id || "1") < blogPosts.length && (
                <Button asChild>
                  <Link to={`/blog/${parseInt(id || "1") + 1}`}>
                    المقال التالي
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;