import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, ArrowRight, Bot, ChevronDown, Loader2, Home, MapPin, Hammer, Users } from 'lucide-react';
import { TimelineBar, TimelineData } from './TimelineBar';

const SUGGESTED_PROMPTS = [
  'My listing has been sitting — how do I find buyer agents?',
  "I'm licensed in CA but my client needs an agent in NY",
  "I'm a contractor who knows a home is about to sell",
  "I know someone looking for a home — how do I get paid?",
];

const SCENARIOS = [
  {
    icon: Home,
    title: 'Stale Listing? Find Buyers',
    desc: 'Your listing has been sitting too long. We connect you with buyer agents who have ready buyers.',
  },
  {
    icon: MapPin,
    title: 'Out-of-State Referrals',
    desc: "Your client needs an agent in another state. We match them with a licensed local pro — you keep the referral fee.",
  },
  {
    icon: Hammer,
    title: 'Tip Providers Get Paid',
    desc: "Contractors, designers, or anyone who knows a home is about to sell — share the tip and earn a cut when it closes.",
  },
  {
    icon: Users,
    title: 'Matchmakers Earn Too',
    desc: "Know someone looking for a home? Introduce them to the right agent through us and collect a referral fee at closing.",
  },
];

const TIMELINES: TimelineData[] = [
  {
    steps: [
      { label: 'Search', desc: 'Post your listing on Referro' },
      { label: 'Matching', desc: 'AI finds buyers & buyer agents' },
      { label: 'Accepted', desc: 'Agent accepts your referral' },
      { label: 'Contract', desc: 'Agree referral fee with Referro' },
      { label: 'Offer', desc: 'Buyer makes an offer' },
      { label: 'Close', desc: 'Deal closes' },
      { label: 'Get Paid', desc: 'Receive your referral fee' },
    ],
  },
  {
    steps: [
      { label: 'Share Lead', desc: "Share your client's needs" },
      { label: 'Matching', desc: 'AI finds a licensed local agent' },
      { label: 'Accepted', desc: 'Agent accepts the referral' },
      { label: 'Contract', desc: 'Agree referral fee terms' },
      { label: 'Deal', desc: 'Agent works with your client' },
      { label: 'Close', desc: 'Deal closes' },
      { label: 'Get Paid', desc: 'Receive your referral fee' },
    ],
  },
  {
    steps: [
      { label: 'Share Tip', desc: 'Tell us about the home' },
      { label: 'Matching', desc: 'We find the right listing agent' },
      { label: 'Accepted', desc: 'Agent accepts' },
      { label: 'Contract', desc: 'Agree your cut' },
      { label: 'List', desc: 'Agent lists the property' },
      { label: 'Offer', desc: 'Buyer makes an offer' },
      { label: 'Close', desc: 'Deal closes' },
      { label: 'Get Paid', desc: 'Receive your cut' },
    ],
  },
  {
    steps: [
      { label: 'Share Lead', desc: 'Tell us about the buyer' },
      { label: 'Matching', desc: 'We find the right buyer agent' },
      { label: 'Accepted', desc: 'Agent accepts' },
      { label: 'Contract', desc: 'Agree referral fee' },
      { label: 'Deal', desc: 'Agent works with the buyer' },
      { label: 'Close', desc: 'Deal closes' },
      { label: 'Get Paid', desc: 'Receive your referral fee' },
    ],
  },
];

export const LoginScreen: React.FC = () => {
  const { setDemoMode, loginWithEmail, registerWithEmail, connectLinkedIn } = useApp();
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "Hi! I'm Referral AI. Ask me anything about real estate referrals, agent matching, or how Referro works — it's completely free!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

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
        { role: 'ai', text: "I can help you find the right agent, structure a referral fee, or share a tip about a home. What's your situation?" },
      ]);
    } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 font-sans antialiased">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">Referro</span>
        </div>
        <button
          onClick={() => { setShowAuth(true); setAuthMode('login'); }}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Sign in
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Every real estate connection becomes a{' '}
          <span className="text-indigo-600">paid opportunity</span>.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-4 max-w-2xl mx-auto">
          Referro connects agents, contractors, and everyday people — anyone who knows about a deal — with the right professional to close it. You get paid when the deal closes.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setDemoMode(true)}
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <span>Find the right people</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Free to explore — no signup needed
          </span>
        </div>
      </div>

      {/* Main grid: scenarios + AI chat */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

        {/* Left: 4 scenarios */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">How it works</h2>
          {SCENARIOS.map((s, i) => {
            const Icon = s.icon;
            const isSelected = i === selectedScenario;
            return (
              <button
                key={i}
                onClick={() => setSelectedScenario(i)}
                className={`flex items-start gap-4 p-4 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all text-left w-full ${
                  isSelected ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-100'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: AI chat */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col" style={{ maxHeight: '560px' }}>
            {/* Header */}
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
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 text-sm min-h-[260px]">
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
                    className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sign in / Create account */}
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

      {/* Timeline: step-by-step journey for the selected scenario */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-sm font-bold text-slate-900">
              Your journey: {SCENARIOS[selectedScenario].title}
            </h2>
            <span className="text-xs text-slate-400">— tap a scenario above to see its timeline</span>
          </div>
          <TimelineBar timelines={TIMELINES} selectedIndex={selectedScenario} />
        </div>
      </div>
    </div>
  );
};
