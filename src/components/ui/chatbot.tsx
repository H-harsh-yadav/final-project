'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Hi there! I am StockBro, your AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 rounded-2xl z-50 flex items-center justify-center border-none cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))',
              boxShadow: '0 0 30px hsl(var(--primary) / 0.4), 0 8px 32px hsl(var(--primary) / 0.2)',
            }}
            aria-label="Open chat"
          >
            <Sparkles size={22} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl flex flex-col z-50 overflow-hidden"
            style={{ 
              height: '500px', 
              maxHeight: 'calc(100vh - 48px)',
              background: 'hsl(var(--card) / 0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 80px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--primary) / 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), hsl(var(--neon-cyan) / 0.3), transparent)' }}
              />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--neon-cyan) / 0.1))' }}
                >
                  <Bot className="w-5 h-5 text-primary" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-neon-green border-2 border-card shadow-[0_0_6px_hsl(var(--neon-green)/0.6)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">StockBro AI</h3>
                  <p className="text-[10px] text-neon-green font-medium">● Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-primary/10' 
                      : ''
                  }`}
                    style={msg.role === 'model' ? {
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--neon-cyan) / 0.1))',
                    } : {}}
                  >
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-primary" />}
                  </div>
                  <div
                    className={`flex flex-col max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-2xl rounded-tr-sm text-white'
                          : 'rounded-2xl rounded-tl-sm text-foreground'
                      }`}
                      style={msg.role === 'user' 
                        ? { background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan) / 0.8))' }
                        : { background: 'hsl(var(--secondary) / 0.5)', backdropFilter: 'blur(8px)' }
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 flex-row"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--neon-cyan) / 0.1))' }}
                  >
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                    style={{ background: 'hsl(var(--secondary) / 0.5)' }}
                  >
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-neon-cyan" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-neon-magenta" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 transition-all focus-within:border-primary/30 focus-within:shadow-[0_0_15px_hsl(var(--primary)/0.08)]"
                style={{ background: 'hsl(var(--background) / 0.5)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-lg transition-all flex flex-shrink-0 items-center justify-center"
                  style={{
                    background: input.trim() && !isLoading
                      ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))'
                      : 'hsl(var(--secondary))',
                    color: input.trim() && !isLoading ? 'white' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
