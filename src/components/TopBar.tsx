import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const TopBar = () => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:block w-full bg-gradient-to-r from-primary via-primary-dark to-primary text-primary-foreground py-2"
      dir="rtl"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between text-sm">
          {/* معلومات التواصل */}
          <div className="flex items-center gap-6">
            {/* شارة الدعم */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium">دعم فني 24/7</span>
            </div>
            
            {/* أرقام واتساب */}
            <a 
              href="https://wa.me/966500776343" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-saudi-gold transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              <span>0500776343</span>
            </a>
            
            <a 
              href="https://wa.me/966559600824" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-saudi-gold transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              <span>0559600824</span>
            </a>
            
            {/* البريد الإلكتروني */}
            <a 
              href="mailto:info@masteredupath.com"
              className="flex items-center gap-2 hover:text-saudi-gold transition-colors duration-200"
            >
              <Mail className="h-4 w-4" />
              <span>info@masteredupath.com</span>
            </a>
          </div>
          
          {/* أيقونات السوشيال ميديا */}
          <div className="flex items-center gap-3">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-saudi-gold transition-colors duration-200"
              aria-label="فيسبوك"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-saudi-gold transition-colors duration-200"
              aria-label="تويتر"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-saudi-gold transition-colors duration-200"
              aria-label="إنستغرام"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-saudi-gold transition-colors duration-200"
              aria-label="لينكدإن"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;