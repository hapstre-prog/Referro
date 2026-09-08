import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, ArrowRight, Bot, Gift, Network, Zap, Loader2, ChevronDown } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How do I find the right agent for a luxury Miami relocation?',
  'What is a fair referral fee split?',
  'How does Referro match me with agents?',
  'Can I search my network for free?',
];

const FREE_CREDITS = 5;

export const LoginScreen: React.FC = () => {
  const { setDemoMode, loginWithEmail, registerWithEmail, connectLinkedIn } = useApp();
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "Hi! I'm Referral AI. Ask me anything about real estate referrals, agent matching, or how Referro works. Each question uses 1 free credit — you start with 5.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(FREE_CREDITS);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading || creditsLeft <= 0) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          context: 'Prospective user exploring Referro on the landing page.',
        }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: data.reply || "I can help you find the right referral partners, structure fee agreements, and match with verified agents. Try asking about a specific market!" },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "I can help you find the right referral partners, structure fee agreements, and match with verified agents across luxury US markets. What would you like to know?" },
      ]);
    } finally {
      setCreditsLeft(c => Math.max(0, c - 1));
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) { setAuthError('Please enter your name.'); setAuthLoading(false); return; }
        await registerWithEmail(name, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLinkedIn = async () => {
    setLinkedinLoading(true);
    try { await connectLinkedIn(); }
    catch { setAuthError('Failed to connect to LinkedIn.'); setLinkedinLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 flex items-center justify-center p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left: Hero + Free Network CTA */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Referro</h1>
              <p className="text-xs text-slate-500">Your network is your first source of opportunities.</p>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Turn your professional network into{' '}
            <span className="text-indigo-600">real referral revenue</span>.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Referro connects you with verified real estate professionals across luxury US markets. Search your network, send referrals, and track deals — all in one place.
          </p>

          {/* Free Network Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Searching your network is always free</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Browse and search your entire network of professionals without consuming any credits — no limits, no cost.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 font-medium">Sync your LinkedIn connections and discover referral partners instantly</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 font-medium">AI-powered matching finds the right agent for every opportunity</p>
            </div>
          </div>

          {/* Primary CTA: Start exploring network — always free */}
          <button
            onClick={() => setDemoMode(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <span>Start to find the right people within your network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <Gift className="w-3 h-3" />
            Always free — does not consume any credits
          </p>
        </div>

        {/* Right: AI Question Interface */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
            {/* Header with credit counter */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Ask Referral AI</h3>
                  <span className="text-[10px] text-indigo-300 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                    Ask anything — no signup needed
                  </span>
                </div>
              </div>
              {/* Credit counter */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                creditsLeft > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{creditsLeft} free {creditsLeft === 1 ? 'credit' : 'credits'}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 text-sm min-h-[280px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed text-xs ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
                  }`}>
                    {m.text}
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
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 1 && (
              <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={creditsLeft <= 0}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Credits exhausted message */}
            {creditsLeft === 0 && (
              <div className="p-3 bg-amber-50 border-t border-amber-100 text-center">
                <p className="text-xs text-amber-700 font-semibold mb-2">
                  You've used all your free questions. Create an account to get more credits!
                </p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Sign up for more credits →
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={creditsLeft > 0 ? 'Ask a question...' : 'No credits remaining'}
                disabled={creditsLeft <= 0}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || creditsLeft <= 0}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sign in / Create account — collapsed below */}
          <div className="mt-4 text-center">
            {!showAuth ? (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
              >
                Already have an account? Sign in
                <ChevronDown className="w-3 h-3" />
              </button>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 text-left">
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4">
                  <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-colors ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Sign In</button>
                  <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-colors ${authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Create Account</button>
                </div>
                {authError && <p className="text-xs text-rose-600 mb-3">{authError}</p>}
                <form onSubmit={handleAuth} className="space-y-3">
                  {authMode === 'register' && (
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" required />
                  )}
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" required />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" required minLength={6} />
                  <button type="submit" disabled={authLoading || linkedinLoading} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{authMode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
                <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or</span><div className="flex-1 h-px bg-slate-200" /></div>
                <button onClick={handleLinkedIn} disabled={authLoading || linkedinLoading} className="w-full py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0A4fA8] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {linkedinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue with LinkedIn</>}
                </button>
                <button onClick={() => setShowAuth(false)} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-3">Hide</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
