import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Search, BookOpen, Users, Award } from "lucide-react";

const TrainingCourses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 bg-gradient-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <Search className="h-20 w-20 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl md:text-6xl font-arabic-title font-bold mb-6">الدورات التدريبية</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">دورات متخصصة في مناهج البحث العلمي</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">ابدأ الآن</Button>
        </div>
      </section>
      
    </div>
  );
};

export default TrainingCourses;