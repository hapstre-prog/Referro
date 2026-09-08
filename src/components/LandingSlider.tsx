import React, { useState, useRef, useEffect } from 'react';
import { LoginScreen } from './LoginScreen';
import { DashboardView } from '../views/DashboardView';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const LandingSlider: React.FC = () => {
  const { setActiveTab } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { id: 'landing', label: 'How it works' },
    { id: 'dashboard', label: 'Dashboard preview' },
  ];

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  // Track which slide is in view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveSlide(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-slate-50">
      {/* Slides container */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Slide 1: Landing page */}
        <div className="w-screen h-screen shrink-0 snap-start snap-always overflow-y-auto">
          <LoginScreen />
        </div>

        {/* Slide 2: Dashboard preview */}
        <div className="w-screen h-screen shrink-0 snap-start snap-always overflow-hidden">
          <div className="h-screen flex flex-col bg-slate-100/70">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <DashboardView />
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators (dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollToSlide(i)}
            className={`transition-all rounded-full ${
              activeSlide === i
                ? 'w-6 h-2.5 bg-indigo-600'
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to ${s.label}`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      {activeSlide === 0 && (
        <button
          onClick={() => scrollToSlide(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-all"
        >
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {activeSlide === 1 && (
        <button
          onClick={() => scrollToSlide(0)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Landing</span>
        </button>
      )}
    </div>
  );
};
