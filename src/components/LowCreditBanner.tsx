import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, X, ArrowUpRight } from 'lucide-react';

export const LowCreditBanner: React.FC = () => {
  const { wallet, adminConfig, isDemoMode, setActiveTab } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Only show when not in demo mode and credits are low (between 1 and lowCreditThreshold)
  if (isDemoMode || dismissed || wallet.availableCredits > adminConfig.lowCreditThreshold || wallet.availableCredits === 0) {
    return null;
  }

  return (
    <div className="bg-sky-50 border-b border-sky-100 text-sky-900 px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
          <Zap className="w-3 h-3" />
        </div>
        <span className="font-medium">
          You have <strong className="font-semibold text-sky-800">{wallet.availableCredits} credit{wallet.availableCredits === 1 ? '' : 's'}</strong> remaining for Beyond Network searches.
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveTab('credits')}
          className="font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center hover:underline cursor-pointer"
        >
          Get More Credits
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-sky-500 hover:text-sky-700 p-0.5 rounded transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
