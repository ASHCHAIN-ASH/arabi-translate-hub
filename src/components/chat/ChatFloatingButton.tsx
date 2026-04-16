import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ChatPanel from './ChatPanel';

interface ChatFloatingButtonProps {
  userId: string;
  isAdmin?: boolean;
}

const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ userId, isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useChat(userId, isAdmin);

  return (
    <>
      <ChatPanel userId={userId} isAdmin={isAdmin} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-shadow"
          >
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatFloatingButton;
