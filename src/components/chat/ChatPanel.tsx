import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Plus, ArrowRight, Clock, CheckCheck, 
  Check, X, Sparkles, User, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat, ChatConversation, ChatMessage } from '@/hooks/useChat';

interface ChatPanelProps {
  userId: string;
  isAdmin?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ userId, isAdmin = false, isOpen, onClose }) => {
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    createConversation,
    unreadCount,
    loading,
  } = useChat(userId, isAdmin);

  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    setSending(true);
    await sendMessage(activeConversation, newMessage.trim(), userId, isAdmin ? 'admin' : 'client');
    setNewMessage('');
    setSending(false);
  };

  const handleCreateChat = async () => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    setSending(true);
    const conv = await createConversation(newSubject.trim(), newMessage.trim(), userId);
    if (conv) {
      setActiveConversation(conv.id);
      setShowNewChat(false);
      setNewSubject('');
      setNewMessage('');
    }
    setSending(false);
  };

  const getTimeStr = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `${mins}د`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}س`;
    return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 w-[380px] h-[560px] bg-card border border-border/50 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {activeConv ? activeConv.subject : 'المحادثات'}
                </h3>
                <p className="text-xs text-primary-foreground/70">
                  {activeConv ? (activeConv.status === 'open' ? 'محادثة نشطة' : 'مغلقة') : `${conversations.length} محادثة`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {activeConversation && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                  onClick={() => setActiveConversation(null)}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!activeConversation && !showNewChat ? (
              /* Conversation List */
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {!isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowNewChat(true)}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                    >
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">محادثة جديدة</span>
                    </motion.button>
                  )}

                  {conversations.length === 0 && (
                    <div className="text-center py-12">
                      <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">لا توجد محادثات بعد</p>
                    </div>
                  )}

                  {conversations.map((conv, i) => (
                    <motion.button
                      key={conv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setActiveConversation(conv.id)}
                      className="w-full p-3 rounded-xl hover:bg-muted/50 transition-all text-right flex items-start gap-3 group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        conv.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isAdmin ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold truncate">{conv.subject}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {getTimeStr(conv.last_message_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.last_message || 'لا توجد رسائل'}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            ) : showNewChat ? (
              /* New Chat Form */
              <div className="p-4 space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">موضوع المحادثة</label>
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="مثال: استفسار عن طلبي"
                    className="text-sm"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">رسالتك</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full h-24 p-3 text-sm rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </motion.div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateChat} disabled={!newSubject.trim() || !newMessage.trim() || sending} className="flex-1 gap-2">
                    <Send className="w-4 h-4" /> إرسال
                  </Button>
                  <Button variant="outline" onClick={() => { setShowNewChat(false); setNewSubject(''); setNewMessage(''); }}>
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              /* Messages View */
              <ScrollArea className="h-full">
                <div className="p-3 space-y-3 pb-2">
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_id === userId;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-bl-md'
                            : 'bg-muted text-foreground rounded-br-md'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'justify-start' : 'justify-end'}`}>
                            <span className={`text-[10px] ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                              {getTimeStr(msg.created_at)}
                            </span>
                            {isMe && (
                              msg.read_at 
                                ? <CheckCheck className="w-3 h-3 text-primary-foreground/60" />
                                : <Check className="w-3 h-3 text-primary-foreground/40" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Message Input */}
          {activeConversation && !showNewChat && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border-t border-border/40 bg-card"
            >
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="text-sm flex-1"
                  disabled={sending}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim() || sending} className="h-10 w-10 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
