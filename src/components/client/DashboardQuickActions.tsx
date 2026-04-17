import { motion } from 'framer-motion';
import { Plus, HeadphonesIcon, FileText, CreditCard, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { title: 'طلب جديد', icon: Plus, href: '/client-services', gradient: 'from-indigo-500 to-purple-600' },
  { title: 'فواتيري', icon: FileText, href: '/invoices', gradient: 'from-emerald-500 to-teal-600' },
  { title: 'عقودي', icon: ScrollText, href: '/client/contracts', gradient: 'from-amber-500 to-orange-600' },
  { title: 'المدفوعات', icon: CreditCard, href: '/wallet', gradient: 'from-violet-500 to-fuchsia-600' },
  { title: 'الدعم الفني', icon: HeadphonesIcon, href: '/support/tickets', gradient: 'from-sky-500 to-blue-600' },
];

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur border border-border/60 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black tracking-tight">إجراءات سريعة</h3>
        <span className="text-[10px] text-muted-foreground">اختصارات ذكية</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.06, type: 'spring' }}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(action.href)}
            className="group relative overflow-hidden rounded-2xl p-4 flex flex-col items-center text-center gap-2 cursor-pointer border border-border/40 bg-gradient-to-br from-background to-muted/40 hover:border-transparent transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`relative w-11 h-11 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-white/20 group-hover:backdrop-blur-md transition-all`}>
              <action.icon className="w-5 h-5" strokeWidth={2.3} />
            </div>
            <span className="relative text-xs sm:text-sm font-bold text-foreground group-hover:text-white transition-colors">
              {action.title}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
