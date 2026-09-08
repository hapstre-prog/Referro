import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Send, Sparkles, X, ChevronRight, CheckCircle2, CornerDownLeft } from 'lucide-react';

export const ReferralAIAssistant: React.FC = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, user, deals, opportunities, setActiveTab } = useApp();
  
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; action?: { label: string; tab: string } }>>([
    {
      role: 'ai',
      text: `Hello ${user.name}! I'm Referral AI, your intelligence partner on Referro. I help you structure referral leads, score high-value matches, draft warm intros, and optimize your 25% referral commission splits. How can I help today?`,
      action: { label: 'Explore Miami Relocation Match', tab: 'give' }
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAiAssistantOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: `User: ${user.name} (${user.company}). Active deals: ${deals.length}. Active opportunities: ${opportunities.length}. Markets: ${(user.marketsServed || []).join(', ')}.`
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: data.reply || "I can help you review your matches, verify licensing requirements, or draft an introduction message."
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: "I analyzed your request. I recommend posting this as a Give opportunity with standard 25% referral terms to match with certified luxury specialists in your target market."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-96 max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight">Referral AI</h4>
            <span className="text-[10px] text-indigo-300 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
              Real Estate Deal Copilot
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAiAssistantOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
              }`}
            >
              {m.text}

              {m.action && (
                <button
                  onClick={() => {
                    setActiveTab(m.action!.tab);
                    setIsAiAssistantOpen(false);
                  }}
                  className="mt-2 text-indigo-600 font-semibold inline-flex items-center text-[11px] hover:underline cursor-pointer"
                >
                  <span>{m.action.label}</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            <span>Referral AI is analyzing...</span>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="p-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[10px] text-slate-600">
        <button
          onClick={() => setInput("How should I structure a 25% referral fee agreement?")}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
        >
          Fee Structure?
        </button>
        <button
          onClick={() => setInput("What makes Sarah Chen a 94% match for Miami?")}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
        >
          Why Sarah 94%?
        </button>
        <button
          onClick={() => setInput("How do Beyond Network credits work?")}
          className="whitespace-nowrap px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
        >
          Credits explanation?
        </button>
      </div>

      {/* Input */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Referral AI about deals, matches, or fees..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
