import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FloatingWhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumbers = [
    { number: '0500776343', label: 'خدمة العملاء 1' },
    { number: '0559600824', label: 'خدمة العملاء 2' }
  ];

  const openWhatsApp = (phoneNumber: string) => {
    const pageTitle = document.title || 'خدمات البحث العلمي';
    const pageUrl = window.location.href;
    const message = encodeURIComponent(`مرحبًا، أود المساعدة بخصوص: ${pageTitle} — ${pageUrl}`);
    window.open(`https://wa.me/966${phoneNumber.slice(1)}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.4)',
              '0 0 40px rgba(34, 197, 94, 0.6)',
              '0 0 20px rgba(34, 197, 94, 0.4)',
            ],
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 2,
            },
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Popup Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-20 left-0 mb-2"
            >
              <Card className="w-72 p-4 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-1">خدمة العملاء</h3>
                  <p className="text-sm text-muted-foreground">اختر رقم للتواصل عبر واتساب</p>
                </div>

                <div className="space-y-2">
                  {phoneNumbers.map((phone, index) => (
                    <motion.div
                      key={phone.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => openWhatsApp(phone.number)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white justify-start gap-3"
                      >
                        <Phone className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs opacity-90">{phone.label}</span>
                          <span className="font-semibold">{phone.number}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
