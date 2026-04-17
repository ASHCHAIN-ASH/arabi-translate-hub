import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, User, Clock, CheckCheck, Check,
  Search, RefreshCw, Inbox, Plus, ChevronsUpDown
} from 'lucide-react';

const AdminChat = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading,
  } = useChat(user?.id, true);

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation || !user?.id) return;
    setSending(true);
    await sendMessage(activeConversation, newMessage.trim(), user.id, 'admin');
    setNewMessage('');
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

  const filtered = conversations.filter(c =>
    c.subject.includes(searchTerm) || (c.last_message || '').includes(searchTerm)
  );

  const activeConv = conversations.find(c => c.id === activeConversation);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">المحادثات</h1>
            <p className="text-xs text-muted-foreground">التواصل المباشر مع العملاء</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            {conversations.length} محادثة
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 border-border/40 flex flex-col">
            <CardHeader className="p-3 pb-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث..."
                  className="pr-9 text-sm h-9"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="px-3 pb-3 space-y-1.5">
                {filtered.length === 0 && (
                  <div className="text-center py-8">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">لا توجد محادثات</p>
                  </div>
                )}
                {filtered.map((conv) => (
                  <motion.button
                    key={conv.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActiveConversation(conv.id)}
                    className={`w-full p-3 rounded-xl text-right transition-all flex items-start gap-3 ${
                      activeConversation === conv.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      conv.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold truncate">{conv.subject}</span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {getTimeStr(conv.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.last_message || '-'}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2 border-border/40 flex flex-col">
            {activeConv ? (
              <>
                <CardHeader className="p-4 pb-3 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{activeConv.subject}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activeConv.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <Badge variant={activeConv.status === 'open' ? 'default' : 'secondary'}>
                      {activeConv.status === 'open' ? 'نشطة' : 'مغلقة'}
                    </Badge>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((msg, i) => {
                      const isAdmin = msg.sender_type === 'admin';
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] p-3 rounded-2xl ${
                            isAdmin
                              ? 'bg-primary text-primary-foreground rounded-bl-md'
                              : 'bg-muted text-foreground rounded-br-md'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`text-[10px] font-semibold ${isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {isAdmin ? 'أنت (الإدارة)' : 'العميل'}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                              <span className={`text-[10px] ${isAdmin ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>
                                {getTimeStr(msg.created_at)}
                              </span>
                              {isAdmin && (msg.read_at ? <CheckCheck className="w-3 h-3 text-primary-foreground/50" /> : <Check className="w-3 h-3 text-primary-foreground/30" />)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-border/30">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="اكتب ردك..."
                      className="flex-1 text-sm"
                      disabled={sending}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || sending} className="gap-1.5">
                      <Send className="w-4 h-4" /> إرسال
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">اختر محادثة للبدء</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminChat;
