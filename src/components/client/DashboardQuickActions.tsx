import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, HeadphonesIcon, FileText, CreditCard, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    title: 'طلب جديد',
    icon: Plus,
    href: '/client-services',
    color: 'bg-primary text-primary-foreground',
  },
  {
    title: 'فواتيري',
    icon: FileText,
    href: '/invoices',
    color: 'bg-emerald-600 text-white',
  },
  {
    title: 'عقودي',
    icon: ScrollText,
    href: '/client/contracts',
    color: 'bg-primary text-primary-foreground',
  },
  {
    title: 'المدفوعات',
    icon: CreditCard,
    href: '/wallet',
    color: 'bg-purple-600 text-white',
  },
  {
    title: 'الدعم الفني',
    icon: HeadphonesIcon,
    href: '/support/tickets',
    color: 'bg-amber-600 text-white',
  },
];

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Card
            className="cursor-pointer border border-border/50 shadow-sm hover:shadow-md transition-all"
            onClick={() => navigate(action.href)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">{action.title}</span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
