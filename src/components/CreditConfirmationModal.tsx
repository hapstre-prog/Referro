import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, AlertCircle, Check } from 'lucide-react';

export const CreditConfirmationModal: React.FC = () => {
  const { consumptionConfirmation, setConsumptionConfirmation, wallet } = useApp();

  if (!consumptionConfirmation || !consumptionConfirmation.isOpen) return null;

  const handleConfirm = () => {
    consumptionConfirmation.onConfirm();
  };

  const handleCancel = () => {
    setConsumptionConfirmation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
          <Compass className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Search Beyond Your Network?
        </h3>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900 mb-1">
            This search will use <strong>1 credit</strong> to search beyond your network.
          </p>
          <p className="text-xs text-slate-500">
            Current balance: <span className="font-semibold text-slate-800">{wallet.availableCredits} available credits</span> ({wallet.freeCreditsRemaining} free, {wallet.purchasedCredits} purchased). Free credits are consumed first.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Search Beyond Network</span>
          </button>
        </div>
      </div>
    </div>
  );
};
