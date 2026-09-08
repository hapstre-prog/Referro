import React from 'react';
import { Sparkles, Check } from 'lucide-react';

interface JourneyStep {
  num: number;
  title: string;
  desc: string;
}

const STEPS: JourneyStep[] = [
  { num: 1, title: 'Post', desc: 'List your stale property on Referro' },
  { num: 2, title: 'Match', desc: 'AI finds buyer agents with ready buyers' },
  { num: 3, title: 'Accept', desc: 'Agent accepts your referral request' },
  { num: 4, title: 'Sign', desc: 'Agree the referral fee split on Referro' },
  { num: 5, title: 'Offer', desc: 'Buyer submits an offer on the property' },
  { num: 6, title: 'Close', desc: 'Escrow opens and the deal closes' },
  { num: 7, title: 'Get Paid', desc: 'Receive your referral fee payout' },
];

interface JourneyTimelineProps {
  journeyTitle: string;
  onFindPeople: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ journeyTitle, onFindPeople }) => {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <h3 className="font-bold text-sm text-slate-900 mb-5">
        Your journey: {journeyTitle}
      </h3>

      {/* Timeline */}
      <div className="flex items-start justify-between mb-6">
        {STEPS.map((step, idx) => {
          const isLast = step.num === 7;
          const isSecondLast = step.num === 6;
          return (
            <React.Fragment key={step.num}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center text-center shrink-0" style={{ width: '64px' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: isLast ? '#34D399' : '#4F46E5' }}
                >
                  {isLast ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className="text-[11px] font-bold mt-1.5 leading-tight"
                  style={{ color: isLast ? '#059669' : '#374151' }}
                >
                  {step.title}
                </span>
                <span className="text-[9px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                  {step.desc}
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 flex items-start pt-4">
                  <div
                    className="h-px w-full"
                    style={{
                      backgroundColor: isSecondLast ? '#34D399' : '#E5E7EB',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action button */}
      <button
        onClick={onFindPeople}
        className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all hover:opacity-90 shadow-sm"
        style={{ backgroundColor: '#4F46E5' }}
      >
        <Sparkles className="w-4 h-4" />
        <span>Find the right people</span>
      </button>
    </div>
  );
};
