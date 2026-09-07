import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, setDemoMode, runDemoScenario } = useApp();

  if (!isDemoMode) return null;

  return (
    <div id="demo-mode-persistent-banner" className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-50 px-4 py-2 text-xs md:text-sm font-medium flex flex-wrap items-center justify-between shadow-sm z-50 sticky top-0">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-900/80 text-amber-200 border border-amber-500/40">
          <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
          DEMO MODE
        </span>
        <span className="hidden sm:inline text-amber-100">
          You're exploring a sample account (Alex Morgan, KW Luxury SF) with 50+ network contacts & sample deals.
        </span>
        <span className="sm:hidden text-amber-100">
          Sample account active.
        </span>
      </div>

      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
        <div className="hidden lg:flex items-center space-x-1.5 mr-2">
          <span className="text-amber-200 text-xs">Try Scenarios:</span>
          <button 
            onClick={() => runDemoScenario(1)}
            className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-900 text-amber-100 text-xs border border-amber-500/30 transition-colors"
            title="Alex has a buyer relocating to Miami"
          >
            1. Miami Buyer
          </button>
          <button 
            onClick={() => runDemoScenario(2)}
            className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-900 text-amber-100 text-xs border border-amber-500/30 transition-colors"
            title="127-day stuck listing looking for buyers"
          >
            2. Stuck Listing
          </button>
          <button 
            onClick={() => runDemoScenario(3)}
            className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-900 text-amber-100 text-xs border border-amber-500/30 transition-colors"
            title="Contractor renovated property, owner selling"
          >
            3. Contractor Lead
          </button>
        </div>

        <button
          onClick={() => setDemoMode(false)}
          className="inline-flex items-center px-2.5 py-1 rounded bg-white text-slate-900 font-semibold text-xs hover:bg-amber-50 transition-colors shadow-xs"
        >
          <span>EXIT DEMO</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
};
