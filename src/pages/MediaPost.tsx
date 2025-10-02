import { motion } from "framer-motion";
import { 
  Calendar, 
  Eye, 
  Share2, 
  ArrowLeft,
  User,
  Tag,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

// Import images
import successStoriesImg from "@/assets/blog-academic-conferences.jpg";
import newsImg from "@/assets/blog-journal-publication.jpg";
import articlesImg from "@/assets/blog-academic-writing.jpg";
import guidesImg from "@/assets/blog-research-methods.jpg";

const MediaPost = () => {
  const { id } = useParams();

  const mediaPosts = [
    {
      id: 1,
      title: "نجاح باهر لطالب الدكتوراه في النشر بمجلة Nature",
      excerpt: "استطاع أحد عملائنا تحقيق إنجاز علمي كبير بنشر بحثه في إحدى أرقى المجلات العلمية عالمياً",
      category: "قصص النجاح",
      image: successStoriesImg,
      date: "2025-01-15",
      views: 2400,
      readTime: "5 دقائق",
      author: "فريق MasterEduPath",
      content: `
        <p>في إنجاز علمي متميز، استطاع الدكتور أحمد محمد، أحد عملائنا المميزين، تحقيق حلمه بنشر بحثه في مجلة Nature، إحدى أعرق المجلات العلمية على مستوى العالم.</p>
        
        <h2>رحلة النجاح</h2>
        <p>بدأت رحلة الدكتور أحمد معنا منذ عام كامل، حيث كان يواجه صعوبات كبيرة في صياغة بحثه بطريقة تتوافق مع معايير المجلات الدولية. من خلال خدماتنا المتكاملة، استطعنا مساعدته في:</p>
        
        <ul>
          <li>مراجعة وتدقيق البحث لغوياً وعلمياً</li>
          <li>تحسين المنهجية البحثية</li>
          <li>تنسيق البحث وفقاً لمعايير المجلة</li>
          <li>ترجمة البحث بدقة عالية</li>
          <li>متابعة عملية النشر حتى القبول النهائي</li>
        </ul>
        
        <h2>التحديات والحلول</h2>
        <p>واجهنا العديد من التحديات خلال هذه الرحلة، أبرزها:</p>
        
        <ul>
          <li><strong>التعقيد العلمي:</strong> كان البحث يحتوي على مصطلحات علمية معقدة تتطلب دقة فائقة في الترجمة</li>
          <li><strong>المعايير الصارمة:</strong> مجلة Nature معروفة بمعاييرها الصارمة للغاية</li>
          <li><strong>الوقت المحدود:</strong> كان هناك موعد نهائي محدد للتقديم</li>
        </ul>
        
        <h2>النتائج المبهرة</h2>
        <p>بعد أشهر من العمل المتواصل والتعاون الوثيق مع الدكتور أحمد، تم قبول البحث للنشر. وقد أشادت هيئة التحرير بجودة العرض والصياغة اللغوية الممتازة.</p>
        
        <blockquote>
          "لولا الدعم الاحترافي من فريق MasterEduPath، لما استطعت تحقيق هذا الإنجاز. خدماتهم المتميزة جعلت الفرق بين القبول والرفض."
          <br>- د. أحمد محمد
        </blockquote>
        
        <h2>دروس مستفادة</h2>
        <p>هذه التجربة علمتنا أهمية:</p>
        
        <ul>
          <li>التخطيط الجيد والمنهجي</li>
          <li>الدقة في كل التفاصيل</li>
          <li>التواصل المستمر مع الباحث</li>
          <li>المرونة في التعامل مع التعديلات</li>
          <li>الالتزام بالمواعيد النهائية</li>
        </ul>
        
        <p>نفخر بهذا الإنجاز ونتطلع لمساعدة المزيد من الباحثين في تحقيق أحلامهم الأكاديمية.</p>
      `
    },
    {
      id: 2,
      title: "إطلاق خدمة الترجمة الفورية بالذكاء الاصطناعي",
      excerpt: "نعلن عن إطلاق خدمة جديدة للترجمة الفورية باستخدام أحدث تقنيات الذكاء الاصطناعي",
      category: "الأخبار",
      image: newsImg,
      date: "2025-01-10",
      views: 3200,
      readTime: "4 دقائق",
      author: "إدارة التطوير",
      content: `
        <p>يسرنا الإعلان عن إطلاق خدمة الترجمة الفورية المدعومة بالذكاء الاصطناعي، والتي تمثل قفزة نوعية في عالم الترجمة الأكاديمية.</p>
        
        <h2>مميزات الخدمة الجديدة</h2>
        <ul>
          <li>ترجمة فورية بدقة عالية تصل إلى 98%</li>
          <li>دعم أكثر من 100 لغة</li>
          <li>الحفاظ على السياق العلمي والأكاديمي</li>
          <li>مراجعة بشرية للتأكد من الجودة</li>
          <li>أسعار تنافسية</li>
        </ul>
        
        <h2>كيف تعمل الخدمة؟</h2>
        <p>تعتمد الخدمة على نماذج ذكاء اصطناعي متقدمة تم تدريبها على ملايين النصوص الأكاديمية، مما يضمن:</p>
        
        <ul>
          <li>فهم عميق للمصطلحات العلمية</li>
          <li>ترجمة دقيقة للمعاني المعقدة</li>
          <li>الحفاظ على الأسلوب الأكاديمي</li>
        </ul>
        
        <p>الخدمة متاحة الآن لجميع العملاء، ونقدم تخفيضاً خاصاً بنسبة 30% للمشتركين الجدد.</p>
      `
    },
    {
      id: 3,
      title: "دليل شامل للنشر في المجلات العلمية المحكّمة",
      excerpt: "خطوات عملية ونصائح مهمة للباحثين الراغبين في نشر أبحاثهم في مجلات علمية محكّمة",
      category: "الأدلة التعليمية",
      image: guidesImg,
      date: "2025-01-08",
      views: 1800,
      readTime: "8 دقائق",
      author: "د. محمد الأحمد",
      content: `
        <p>النشر في المجلات العلمية المحكّمة هو حلم كل باحث. في هذا الدليل الشامل، سنستعرض الخطوات الأساسية لتحقيق هذا الهدف.</p>
        
        <h2>1. اختيار المجلة المناسبة</h2>
        <p>أول خطوة هي اختيار المجلة التي تتناسب مع موضوع بحثك:</p>
        
        <ul>
          <li>تحقق من نطاق المجلة (Scope)</li>
          <li>راجع معامل التأثير (Impact Factor)</li>
          <li>اقرأ الأبحاث المنشورة سابقاً</li>
          <li>تأكد من التصنيف (Q1, Q2, etc.)</li>
        </ul>
        
        <h2>2. إعداد البحث</h2>
        <p>جهز بحثك وفقاً للمعايير التالية:</p>
        
        <ul>
          <li>اتبع دليل المؤلفين (Author Guidelines)</li>
          <li>استخدم القالب الرسمي للمجلة</li>
          <li>راجع التنسيق والمراجع</li>
          <li>تأكد من جودة الأشكال والجداول</li>
        </ul>
        
        <h2>3. التقديم والمتابعة</h2>
        <p>بعد التقديم، كن مستعداً لـ:</p>
        
        <ul>
          <li>الانتظار لمدة قد تصل إلى عدة أشهر</li>
          <li>التعامل مع ملاحظات المحكمين بإيجابية</li>
          <li>إجراء التعديلات المطلوبة بدقة</li>
          <li>المتابعة المستمرة مع المحرر</li>
        </ul>
        
        <p>تذكر أن الرفض أمر طبيعي - لا تستسلم واستمر في المحاولة!</p>
      `
    },
    {
      id: 4,
      title: "أهمية الترجمة الأكاديمية في البحث العلمي",
      excerpt: "تعرف على الدور الحيوي الذي تلعبه الترجمة الأكاديمية في نشر المعرفة وتبادل الخبرات",
      category: "المقالات",
      image: articlesImg,
      date: "2025-01-05",
      views: 1500,
      readTime: "6 دقائق",
      author: "أ. سارة الخالدي",
      content: `
        <p>تلعب الترجمة الأكاديمية دوراً محورياً في تسهيل تبادل المعرفة العلمية بين مختلف الثقافات واللغات.</p>
        
        <h2>أهمية الترجمة الأكاديمية</h2>
        
        <h3>1. نشر المعرفة عالمياً</h3>
        <p>الترجمة تتيح للباحثين الوصول إلى جمهور أوسع وتبادل الأفكار مع زملائهم حول العالم.</p>
        
        <h3>2. تعزيز التعاون الدولي</h3>
        <p>من خلال الترجمة الدقيقة، يمكن للباحثين من مختلف البلدان التعاون في مشاريع بحثية مشتركة.</p>
        
        <h3>3. الحفاظ على الدقة العلمية</h3>
        <p>الترجمة الأكاديمية المتخصصة تضمن نقل المفاهيم العلمية بدقة دون فقدان المعنى.</p>
        
        <h2>تحديات الترجمة الأكاديمية</h2>
        <ul>
          <li>المصطلحات العلمية المعقدة</li>
          <li>الحفاظ على الأسلوب الأكاديمي</li>
          <li>التكيف مع معايير النشر المختلفة</li>
          <li>الدقة في نقل البيانات والأرقام</li>
        </ul>
        
        <p>لذا، من الضروري الاستعانة بمترجمين متخصصين في المجال الأكاديمي لضمان أفضل النتائج.</p>
      `
    }
  ];

  const post = mediaPosts.find(p => p.id === parseInt(id || "1")) || mediaPosts[0];
  const relatedPosts = mediaPosts.filter(p => p.id !== post.id).slice(0, 3);

  const shareLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: `https://facebook.com/sharer/sharer.php?u=${window.location.href}`,
      color: "hover:text-blue-600"
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`,
      color: "hover:text-sky-500"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${post.title}`,
      color: "hover:text-blue-700"
    },
    { 
      name: "Email", 
      icon: Mail, 
      url: `mailto:?subject=${post.title}&body=${window.location.href}`,
      color: "hover:text-red-600"
    }
  ];

  return (
    <>
      <SEO 
        title={`${post.title} | المركز الإعلامي`}
        description={post.excerpt}
        keywords={`${post.category}, ${post.title}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb 
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "المركز الإعلامي", href: "/media" },
              { label: post.title }
            ]}
          />

          <div className="max-w-4xl mx-auto mt-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link to="/media">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة إلى المركز الإعلامي
                </Button>
              </Link>
            </motion.div>

            {/* Post Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('ar-SA')}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {post.views.toLocaleString()} مشاهدة
                </span>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-12 flex items-center gap-4 p-6 bg-card rounded-xl border"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold">شارك المقال:</span>
              <div className="flex gap-2">
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all ${link.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Post Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                direction: 'rtl',
                textAlign: 'right'
              }}
            />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-16 border-t pt-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8">مقالات ذات صلة</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/media/${relatedPost.id}`}
                      className="group"
                    >
                      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border hover:border-primary">
                        <div className="relative overflow-hidden h-40">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          
                          <span className="text-sm text-primary font-semibold flex items-center gap-2">
                            اقرأ المزيد
                            <ArrowLeft className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 flex justify-between items-center"
            >
              <Link to="/media">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  جميع المقالات
                </Button>
              </Link>
              
              {parseInt(id || "1") > 1 && (
                <Link to={`/media/${parseInt(id || "1") - 1}`}>
                  <Button variant="outline">
                    المقال السابق
                  </Button>
                </Link>
              )}
              
              {parseInt(id || "1") < mediaPosts.length && (
                <Link to={`/media/${parseInt(id || "1") + 1}`}>
                  <Button variant="outline">
                    المقال التالي
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MediaPost;