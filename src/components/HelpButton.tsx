import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, Bot, MessageSquare, X, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const HelpButton: React.FC = () => {
  const { setIsAiAssistantOpen, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'feature_request' | 'workflow_issue' | 'bug' | 'other'>('feature_request');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAskAI = () => {
    setIsAiAssistantOpen(true);
    setIsOpen(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message: feedbackText,
          userName: user.name || 'Anonymous',
          userEmail: user.email || '',
          timestamp: new Date().toISOString(),
        }),
      });
      setSubmitted(true);
      setFeedbackText('');
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackMode(false);
        setIsOpen(false);
      }, 2000);
    } catch {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackMode(false);
        setIsOpen(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 group"
          aria-label="Help & Feedback"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-semibold bg-slate-900 text-white px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Help & Feedback
          </span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-50 w-80 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold">Help & Feedback</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); setFeedbackMode(false); }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Thank you!</p>
              <p className="text-xs text-slate-500 mt-1">Your feedback has been sent to our team.</p>
            </div>
          ) : feedbackMode ? (
            /* Feedback Form */
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Feedback Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { value: 'feature_request', label: 'Feature Request' },
                    { value: 'workflow_issue', label: 'Workflow Issue' },
                    { value: 'bug', label: 'Bug Report' },
                    { value: 'other', label: 'Other' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFeedbackType(opt.value)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        feedbackType === opt.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Tell us more</label>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="What feature would you like added? What workflow needs adjusting?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFeedbackMode(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackText.trim() || submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Feedback
                </button>
              </div>
            </div>
          ) : (
            /* Main Menu */
            <div className="p-3 space-y-2">
              <button
                onClick={handleAskAI}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Ask AI for Help</p>
                  <p className="text-xs text-slate-500">Stuck? Our AI can guide you on what to do next.</p>
                </div>
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setFeedbackMode(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Send Feedback to Admin</p>
                  <p className="text-xs text-slate-500">Request features or suggest workflow improvements.</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
