import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, User, Linkedin, ArrowRight, Loader2, AlertCircle, Network, Gift, Zap } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithEmail, registerWithEmail, connectLinkedIn, setDemoMode } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        await registerWithEmail(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedIn = async () => {
    setLinkedinLoading(true);
    try {
      await connectLinkedIn();
    } catch (err: any) {
      setError('Failed to connect to LinkedIn. Please try again.');
      setLinkedinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 flex items-center justify-center p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left: Hero / Try First */}
        <div className="order-2 lg:order-1">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Referro</h1>
              <p className="text-xs text-slate-500">Your network is your first source of opportunities.</p>
            </div>
          </div>

          {/* Headline */}
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

          {/* Primary CTA: Try First */}
          <button
            onClick={() => setDemoMode(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            <span>Try it free — no signup needed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Explore the full app instantly. Sign up later to save your network and sync real connections.
          </p>
        </div>

        {/* Right: Login / Signup Card */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
            <div className="mb-5">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sign up to discover if your current network also brings value.
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || linkedinLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* LinkedIn Login */}
            <button
              onClick={handleLinkedIn}
              disabled={loading || linkedinLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#0A4fA8] text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {linkedinLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Linkedin className="w-4 h-4" />
                  <span>Continue with LinkedIn</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
