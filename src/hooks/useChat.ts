import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatConversation {
  id: string;
  user_id: string;
  admin_id: string | null;
  subject: string;
  status: string;
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export function useChat(userId?: string, isAdmin = false) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });
      
      if (data) setConversations(data as ChatConversation[]);
    } catch (e) {
      console.error('Error loading conversations:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data as ChatMessage[]);
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string, senderId: string, senderType: string) => {
    const { error } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_type: senderType,
      content,
    });

    if (!error) {
      // Update conversation's last message
      await supabase.from('chat_conversations').update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      }).eq('id', conversationId);
    }

    return { error };
  }, []);

  const createConversation = useCallback(async (subject: string, firstMessage: string, userId: string) => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        subject,
        last_message: firstMessage,
      })
      .select()
      .single();

    if (data && !error) {
      await supabase.from('chat_messages').insert({
        conversation_id: data.id,
        sender_id: userId,
        sender_type: 'client',
        content: firstMessage,
      });
      await loadConversations();
      return data as ChatConversation;
    }
    return null;
  }, [loadConversations]);

  const markAsRead = useCallback(async (conversationId: string, readerId: string) => {
    await supabase
      .from('chat_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', readerId)
      .is('read_at', null);
  }, []);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .is('read_at', null);
    setUnreadCount(count || 0);
  }, [userId]);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();

    const channelId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel(`chat-realtime-${channelId}`);

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
        if (activeConversation) {
          loadMessages(activeConversation);
        }
        loadConversations();
        loadUnreadCount();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, () => {
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadConversations, loadMessages, activeConversation, loadUnreadCount]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
      if (userId) markAsRead(activeConversation, userId);
    }
  }, [activeConversation, loadMessages, markAsRead, userId]);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    createConversation,
    markAsRead,
    loading,
    unreadCount,
    refresh: loadConversations,
  };
}
