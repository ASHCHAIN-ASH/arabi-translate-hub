import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Layout, FileText, Palette, Settings } from "lucide-react";

const Formatting = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 bg-gradient-success text-white">
        <div className="container mx-auto px-4 text-center">
          <Layout className="h-20 w-20 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">تنسيق الرسائل العلمية</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">تنسيق احترافي وفقاً للمعايير الأكاديمية</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">ابدأ التنسيق</Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Formatting;