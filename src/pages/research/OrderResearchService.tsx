import { useParams } from 'react-router-dom';
import { ModernResearchOrderForm } from '@/components/ModernResearchOrderForm';
import Header from "@/components/Header";
import { GraduationCap, Microscope, Briefcase, Scale, HeartPulse, ShieldCheck, Clock } from 'lucide-react';

const categoryIcons = {
  academic: GraduationCap,
  scientific: Microscope,
  business: Briefcase,
  legal: Scale,
  medical: HeartPulse,
  social: ShieldCheck
};

const categoryData: Record<string, { 
  title: string; 
  color: string;
  description: string;
  specializations: string[];
  researchTypes: string[];
  icon: any;
}> = {
  academic: {
    title: "الأبحاث الأكاديمية",
    color: "#3b82f6",
    description: "نقدم خدمات بحثية متخصصة للطلاب والباحثين في مختلف التخصصات الأكاديمية",
    specializations: ["القانون", "الطب", "الهندسة", "الإدارة", "العلوم", "التربية", "الآداب", "المحاسبة", "علوم اجتماعية", "فنون", "IT", "زراعة"],
    researchTypes: ["ماجستير", "دكتوراه", "بحث علمي", "ورقة علمية", "دراسة حالة"],
    icon: GraduationCap
  },
  scientific: {
    title: "البحوث العلمية",
    color: "#a855f7",
    description: "فريقنا من الخبراء المتخصصين في العلوم الطبيعية والتطبيقية",
    specializations: ["الأحياء", "الكيمياء", "الفيزياء", "علوم بيئية", "جيولوجيا", "علم مواد", "تقنية حيوية", "علوم طاقة", "تقنية نانو", "فلك"],
    researchTypes: ["بحث تجريبي", "دراسة معملية", "بحث تطبيقي", "مراجعة علمية", "تحليل بيانات"],
    icon: Microscope
  },
  business: {
    title: "أبحاث الأعمال",
    color: "#f97316",
    description: "نساعدك في إعداد دراسات وأبحاث الأعمال الاحترافية",
    specializations: ["إدارة أعمال", "اقتصاد", "محاسبة", "مالية", "تسويق", "موارد بشرية", "إدارة عمليات", "أعمال دولية", "ريادة أعمال", "تحليل بيانات"],
    researchTypes: ["دراسة جدوى", "خطة عمل", "بحث سوق", "تحليل استراتيجي", "دراسة مالية"],
    icon: Briefcase
  },
  social: {
    title: "البحوث الاجتماعية",
    color: "#10b981",
    description: "خدمات بحثية متميزة في العلوم الإنسانية والاجتماعية",
    specializations: ["علم النفس", "التربية", "علم الاجتماع", "خدمة اجتماعية", "إعلام", "أنثروبولوجيا", "جغرافيا", "تاريخ", "فلسفة", "دراسات أسرية"],
    researchTypes: ["دراسة ميدانية", "بحث استبياني", "دراسة تحليلية", "بحث نوعي", "بحث كمي"],
    icon: ShieldCheck
  },
  legal: {
    title: "البحوث القانونية",
    color: "#ef4444",
    description: "فريق من الخبراء القانونيين يقدم أبحاث قانونية دقيقة",
    specializations: ["قانون عام", "قانون خاص", "قانون جنائي", "شريعة إسلامية", "قانون دولي", "قانون عمل", "قانون عقاري", "حقوق إنسان", "قانون بيئي", "أحوال شخصية"],
    researchTypes: ["بحث قانوني", "دراسة مقارنة", "تحليل قضائي", "بحث فقهي", "دراسة تشريعية"],
    icon: Scale
  },
  medical: {
    title: "الأبحاث الطبية",
    color: "#ec4899",
    description: "نساعدك في إعداد الأبحاث الطبية والصحية",
    specializations: ["طب سريري", "صيدلة", "تمريض", "صحة عامة", "مختبرات طبية", "طب أسنان", "أشعة", "علم نفس صحي", "طب أطفال", "تغذية"],
    researchTypes: ["دراسة سريرية", "بحث طبي", "مراجعة منهجية", "دراسة حالة", "تحليل بيانات طبية"],
    icon: HeartPulse
  }
};

const OrderResearchService = () => {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = category ? categoryData[category] : categoryData.academic;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        <ModernResearchOrderForm
          category={category || 'academic'}
          categoryTitle={categoryInfo.title}
          categoryColor={categoryInfo.color}
          specializations={categoryInfo.specializations}
          researchTypes={categoryInfo.researchTypes}
        />
      </div>
    </div>
  );
};

export default OrderResearchService;