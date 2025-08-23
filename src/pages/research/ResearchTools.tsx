import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Cog, ClipboardList, BarChart, Target } from "lucide-react";

const ResearchTools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <Cog className="h-20 w-20 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">توفير أدوات الدراسة</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">إعداد الاستبانات والمقاييس وأدوات جمع البيانات</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">ابدأ الآن</Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResearchTools;