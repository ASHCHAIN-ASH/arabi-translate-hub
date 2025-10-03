import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface TableOfContentsProps {
  sections: Section[];
}

export const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-24 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <ChevronRight className="w-5 h-5 text-primary" />
        جدول المحتويات
      </h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "w-full text-right px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2",
              activeSection === section.id
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {section.icon && <span className="flex-shrink-0">{section.icon}</span>}
            <span className="truncate">{section.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
