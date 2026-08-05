import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am MediBot, your 24/7 MediCare Healthcare Assistant. How can I help you today?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'How do I book an appointment?',
    'Where is the emergency department?',
    'Which doctor handles cardiology?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text }];
    setMessages(newMsgs);
    if (!textToSend) setInputText('');

    // Generate automated Bot response
    setTimeout(() => {
      let reply = 'Thank you for reaching out! You can easily book an appointment by clicking the blue "Book Appointment" button at the top of the page.';
      const lower = text.toLowerCase();
      if (lower.includes('emergency')) {
        reply = 'Our Trauma Unit and Emergency Department operate 24/7 at 500 Healthcare Blvd. Call 1-800-MEDICARE for instant dispatch!';
      } else if (lower.includes('cardiol') || lower.includes('heart') || lower.includes('doctor')) {
        reply = 'Dr. Marcus Vance (Chief Cardiologist) and Dr. Robert Chen (Internal Medicine) are available this week. You can view their full profiles in our Doctors section!';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-4 rounded-full bg-[#0B3D91] hover:bg-blue-700 text-white shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-2 border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-sky-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B3D91]"></span>
          </div>
          <span className="hidden sm:inline font-bold text-sm pr-1">Live Care Chat</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[460px] animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="bg-[#0B3D91] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <div className="font-bold text-sm font-heading">MediCare AI Assistant</div>
                <div className="text-[10px] text-sky-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online 24/7
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F5F9FF] dark:bg-slate-950/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#0B3D91] text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-sky-300" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0B3D91] text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[10px] font-semibold text-[#0B3D91] dark:text-blue-300 bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#0B3D91] hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
