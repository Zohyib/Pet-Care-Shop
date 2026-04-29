'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  PawPrint, Send, Search, Loader2, MessageSquare,
  Wifi, WifiOff, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender?: { id: string; name: string };
}

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ChatPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track seen message IDs to avoid duplicates
  const seenIds = useRef<Set<string>>(new Set());

  // ─── Socket Connection ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Only create once
    if (socketRef.current?.connected) return;

    const socket = io(BACKEND_URL, {
      auth: { token: `Bearer ${token}` },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setIsConnected(false);
    });

    socket.on('error', (err: { message: string }) => {
      console.error('[Socket] Server error:', err.message);
      toast.error('Chat error: ' + err.message);
    });

    // ── Incoming message handler ──
    socket.on('newMessage', (msg: Message) => {
      // Deduplicate using message ID
      if (seenIds.current.has(msg.id)) return;
      seenIds.current.add(msg.id);

      setMessages((prev) => {
        // Also discard if message is not in current conversation
        const contactId = activeContactRef.current?.id;
        if (
          contactId &&
          msg.senderId !== contactId &&
          msg.receiverId !== contactId
        ) {
          // Message for a different conversation — show toast notification
          toast.info('New message from another contact');
          return prev;
        }
        return [...prev, msg];
      });
    });

    // ── Typing indicator ──
    socket.on('userTyping', ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      if (senderId === activeContactRef.current?.id) {
        setPartnerTyping(isTyping);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Keep a ref to activeContact for use inside socket event handlers (closure issue)
  const activeContactRef = useRef<Contact | null>(null);
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  // ─── Load Chat History ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeContact) return;
    setIsLoadingHistory(true);
    seenIds.current.clear(); // Reset deduplication for new conversation

    api
      .get(`/chat/history/${activeContact.id}`)
      .then((res) => {
        const history: Message[] = res.data;
        history.forEach((m) => seenIds.current.add(m.id));
        setMessages(history);
      })
      .catch(() => toast.error('Could not load chat history.'))
      .finally(() => setIsLoadingHistory(false));
  }, [activeContact]);

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  // ─── Send Message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = inputText.trim();
      if (!text || !activeContact || !socketRef.current?.connected) {
        if (!socketRef.current?.connected) toast.error('Not connected. Please wait…');
        return;
      }

      setIsSending(true);
      socketRef.current.emit('sendMessage', {
        receiverId: activeContact.id,
        content: text,
      });
      setInputText('');
      setIsSending(false);

      // Stop typing indicator
      socketRef.current.emit('typing', { receiverId: activeContact.id, isTyping: false });
    },
    [inputText, activeContact],
  );

  // ─── Typing Indicator ───────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!activeContact || !socketRef.current?.connected) return;

    socketRef.current.emit('typing', { receiverId: activeContact.id, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', { receiverId: activeContact.id, isTyping: false });
    }, 2000);
  };

  // ─── Contacts ───────────────────────────────────────────────────────────────
  const { data: contacts, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await api.get('/users/contacts');
      return res.data;
    },
    enabled: !!token,
  });

  // ─── Guard ──────────────────────────────────────────────────────────────────
  if (!user) return null;

  const myId = user.sub; // JWT payload stores userId as .sub

  // ─── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20 shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-premium shadow-md z-10">
          <div className="flex items-center gap-3">
            <PawPrint className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            {isConnected
              ? <Wifi className="w-4 h-4 text-green-300" />
              : <WifiOff className="w-4 h-4 text-red-300 animate-pulse" />
            }
            <span className={`text-xs font-medium ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Profile strip */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-200 text-indigo-900 rounded-full flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name || user.email}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search contacts…" className="pl-9 h-10 bg-slate-100 dark:bg-slate-800 border-none rounded-xl" />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-3">
            {user.role === 'DOCTOR' ? 'Your Patients' : 'Available Doctors'}
          </p>
          {contactsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : contacts?.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">No contacts found.</p>
          ) : contacts?.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                if (activeContact?.id !== contact.id) {
                  setMessages([]);
                  setPartnerTyping(false);
                  setActiveContact(contact);
                }
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                activeContact?.id === contact.id
                  ? 'bg-gradient-premium text-white shadow-lg shadow-indigo-500/25'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex justify-center items-center font-bold shadow-sm shrink-0 ${
                activeContact?.id === contact.id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {contact.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{contact.name || contact.email}</p>
                <p className={`text-xs truncate ${activeContact?.id === contact.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {user.role === 'USER' ? 'Veterinarian' : 'Patient'}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </div>
      </aside>

      {/* ── Chat Area ── */}
      <main className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <header className="h-[72px] border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex justify-center items-center font-bold text-lg">
                  {activeContact.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{activeContact.name || activeContact.email}</h2>
                  <div className="flex items-center gap-1.5 text-xs">
                    {partnerTyping ? (
                      <span className="text-indigo-500 italic animate-pulse">typing…</span>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-green-600 dark:text-green-400">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingHistory ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                  <MessageSquare className="w-12 h-12 opacity-20" />
                  <p className="text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isMe = msg.senderId === myId;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.18 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm mr-2 self-end shrink-0">
                            {activeContact.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                        <div className={`max-w-[65%] px-4 py-3 rounded-2xl whitespace-pre-wrap break-words ${
                          isMe
                            ? 'bg-gradient-premium text-white rounded-br-sm shadow-md shadow-indigo-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700'
                        }`}>
                          <p className="text-[14px] leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              {/* Typing bubble */}
              {partnerTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
                    {activeContact.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
                <Input
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e as any);
                    }
                  }}
                  placeholder={isConnected ? 'Type a message…' : 'Connecting…'}
                  disabled={!isConnected}
                  className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <Button
                  type="submit"
                  disabled={!inputText.trim() || !isConnected || isSending}
                  className="h-12 w-12 bg-gradient-premium hover:opacity-90 disabled:opacity-40 text-white rounded-2xl shadow-lg transition-transform active:scale-95 shrink-0"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </Button>
              </form>
              {!isConnected && (
                <p className="text-center text-xs text-red-400 mt-2 animate-pulse">
                  Reconnecting to server…
                </p>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Select a conversation</h2>
            <p className="max-w-xs text-sm">
              Choose a {user.role === 'USER' ? 'veterinarian' : 'patient'} from the list on the left to start chatting.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
