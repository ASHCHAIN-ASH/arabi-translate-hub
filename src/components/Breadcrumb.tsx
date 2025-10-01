import { Link } from 'react-router-dom';
import { Home, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="bg-primary/10 backdrop-blur-sm border-b border-primary/20" dir="rtl">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>الصفحة الرئيسية</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              {item.href ? (
                <Link 
                  to={item.href}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;